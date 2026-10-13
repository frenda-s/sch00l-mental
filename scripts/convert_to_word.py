import re
import os
import subprocess
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_formatted_text(paragraph, text, default_color=RGBColor(0x22, 0x1F, 0x33), default_font="Times New Roman", default_size=Pt(11)):
    # Clean latex math delimiters if any ($N_1 = 491$ -> N1 = 491)
    clean_text = re.sub(r'\$([^\$]+)\$', r'\1', text)
    # Convert latex subscript N_1 -> N1, \ge -> >=, \le -> <=
    clean_text = clean_text.replace(r'\ge', '>=').replace(r'\le', '<=').replace('_1', '1').replace('_2', '2')
    
    # Regular expression to match bold, italic, inline code, and normal text
    tokens = re.split(r'(\*\*.*?\*\*|\*.*?\*|`.*?`)', clean_text)
    for token in tokens:
        if not token:
            continue
        if token.startswith('**') and token.endswith('**'):
            run = paragraph.add_run(token[2:-2])
            run.bold = True
            run.font.name = default_font
            run.font.size = default_size
            run.font.color.rgb = RGBColor(0x15, 0x1B, 0x31)
        elif token.startswith('*') and token.endswith('*'):
            run = paragraph.add_run(token[1:-1])
            run.italic = True
            run.font.name = default_font
            run.font.size = default_size
            run.font.color.rgb = default_color
        elif token.startswith('`') and token.endswith('`'):
            run = paragraph.add_run(token[1:-1])
            run.font.name = 'Consolas'
            run.font.size = Pt(9.5)
            run.font.color.rgb = RGBColor(0x8E, 0x3F, 0x63)
        else:
            run = paragraph.add_run(token)
            run.font.name = default_font
            run.font.size = default_size
            run.font.color.rgb = default_color

def render_mermaid_to_png(mermaid_code, output_png_path):
    temp_mmd = output_png_path.with_suffix('.mmd')
    with open(temp_mmd, 'w', encoding='utf-8') as f:
        f.write(mermaid_code)
    
    cmd = [
        "npx", "-y", "@mermaid-js/mermaid-cli",
        "-i", str(temp_mmd),
        "-o", str(output_png_path),
        "-b", "white",
        "-s", "2.5"
    ]
    try:
        subprocess.run(cmd, capture_output=True, text=True, check=True)
        return output_png_path.exists()
    except Exception as e:
        print(f"Error rendering mermaid: {e}")
        return False
    finally:
        if temp_mmd.exists():
            temp_mmd.unlink()

def convert_md_to_docx(md_path, docx_path):
    if docx_path.exists():
        docx_path.unlink()
        print(f"Deleted old file: {docx_path}")

    assets_dir = Path("/tmp/mermaid_docx_assets")
    assets_dir.mkdir(parents=True, exist_ok=True)

    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    doc = Document()
    
    # A4 Page setup with 2cm margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(0.8)
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)

    in_mermaid = False
    in_code = False
    in_table = False
    mermaid_buffer = []
    table_buffer = []
    diagram_count = 0

    for line in lines:
        raw_line = line.rstrip('\r\n')
        stripped = raw_line.strip()

        # 1. Mermaid Blocks
        if stripped.startswith('```mermaid'):
            in_mermaid = True
            mermaid_buffer = []
            continue
        elif in_mermaid:
            if stripped == '```':
                in_mermaid = False
                diagram_count += 1
                img_path = assets_dir / f"diagram_{diagram_count}.png"
                code_content = "\n".join(mermaid_buffer)
                print(f"Rendering Mermaid Diagram {diagram_count}...")
                success = render_mermaid_to_png(code_content, img_path)
                
                if success and img_path.exists():
                    from PIL import Image
                    with Image.open(img_path) as im:
                        w_px, h_px = im.size
                        aspect_ratio = h_px / w_px
                    
                    # Choose display width: vertical diagrams get smaller width to fit on one page
                    if aspect_ratio > 1.2:
                        disp_width = Inches(3.2)
                    elif aspect_ratio > 0.8:
                        disp_width = Inches(4.5)
                    else:
                        disp_width = Inches(5.8)

                    p_img = doc.add_paragraph()
                    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    p_img.paragraph_format.space_before = Pt(6)
                    p_img.paragraph_format.space_after = Pt(2)
                    run_img = p_img.add_run()
                    run_img.add_picture(str(img_path), width=disp_width)
                    
                    p_cap = doc.add_paragraph()
                    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    p_cap.paragraph_format.space_after = Pt(8)
                    r_cap = p_cap.add_run(f"Hình {diagram_count}: Sơ đồ minh họa kiến trúc và quy trình hệ thống")
                    r_cap.italic = True
                    r_cap.font.name = 'Times New Roman'
                    r_cap.font.size = Pt(9.5)
                    r_cap.font.color.rgb = RGBColor(0x60, 0x60, 0x70)
                else:
                    p = doc.add_paragraph()
                    run = p.add_run(code_content)
                    run.font.name = 'Consolas'
                    run.font.size = Pt(9)
            else:
                mermaid_buffer.append(raw_line)
            continue

        # 2. Generic Code Blocks
        if stripped.startswith('```'):
            in_code = not in_code
            continue
        if in_code:
            p = doc.add_paragraph()
            p.paragraph_format.space_after = Pt(2)
            run = p.add_run(raw_line)
            run.font.name = 'Consolas'
            run.font.size = Pt(9.5)
            continue

        # 3. Markdown Tables
        if stripped.startswith('|') and stripped.endswith('|'):
            table_buffer.append(stripped)
            continue
        else:
            if table_buffer:
                # Render Table with formatted text in cells
                valid_rows = [r for r in table_buffer if not re.match(r'^\|(\s*:?-+:?\s*\|)+$', r)]
                if valid_rows:
                    cols_count = max(len([c for c in r.split('|')[1:-1]]) for r in valid_rows)
                    table = doc.add_table(rows=len(valid_rows), cols=cols_count)
                    table.alignment = WD_TABLE_ALIGNMENT.CENTER
                    
                    # Compute reasonable column widths (total ~ 6.2 inches)
                    col_width = Inches(6.2 / cols_count)
                    
                    for r_idx, r_str in enumerate(valid_rows):
                        cells_text = [c.strip() for c in r_str.split('|')[1:-1]]
                        for c_idx in range(cols_count):
                            cell = table.cell(r_idx, c_idx)
                            cell.width = col_width
                            raw_cell_val = cells_text[c_idx] if c_idx < len(cells_text) else ""
                            cell.text = ""
                            p = cell.paragraphs[0]
                            p.paragraph_format.space_before = Pt(3)
                            p.paragraph_format.space_after = Pt(3)
                            p.paragraph_format.line_spacing = 1.15
                            
                            set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
                            
                            if r_idx == 0:
                                # Header row: Bold white text on Navy background
                                add_formatted_text(p, raw_cell_val, default_color=RGBColor(0xFF, 0xFF, 0xFF), default_size=Pt(10))
                                set_cell_background(cell, '151B31')
                                for r in p.runs:
                                    r.bold = True
                            else:
                                add_formatted_text(p, raw_cell_val, default_color=RGBColor(0x22, 0x1F, 0x33), default_size=Pt(9.5))
                                if r_idx % 2 == 1:
                                    set_cell_background(cell, 'F9FAFB')
                                else:
                                    set_cell_background(cell, 'FFFFFF')
                    doc.add_paragraph().paragraph_format.space_after = Pt(6)
                table_buffer = []

        if not stripped:
            continue

        # 4. Headings
        if stripped.startswith('# '):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(16)
            p.paragraph_format.space_after = Pt(6)
            run = p.add_run(stripped[2:])
            run.bold = True
            run.font.name = 'Times New Roman'
            run.font.size = Pt(18)
            run.font.color.rgb = RGBColor(0x15, 0x1B, 0x31)
        elif stripped.startswith('## '):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(12)
            run = p.add_run(stripped[3:])
            run.bold = True
            run.font.name = 'Times New Roman'
            run.font.size = Pt(14)
            run.font.color.rgb = RGBColor(0x8E, 0x3F, 0x63)
        elif stripped.startswith('### '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(6)
            run = p.add_run(stripped[4:])
            run.bold = True
            run.font.name = 'Times New Roman'
            run.font.size = Pt(13)
            run.font.color.rgb = RGBColor(0x15, 0x1B, 0x31)
        elif stripped.startswith('#### '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(4)
            run = p.add_run(stripped[5:])
            run.bold = True
            run.font.name = 'Times New Roman'
            run.font.size = Pt(12)
            run.font.color.rgb = RGBColor(0x22, 0x1F, 0x33)
        elif stripped.startswith('##### '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(3)
            run = p.add_run(stripped[6:])
            run.bold = True
            run.font.name = 'Times New Roman'
            run.font.size = Pt(11)
            run.font.italic = True
            run.font.color.rgb = RGBColor(0x40, 0x40, 0x50)
        elif stripped == '---':
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(6)
            run = p.add_run('_________________________________________________________________________________')
            run.font.name = 'Times New Roman'
            run.font.size = Pt(9)
            run.font.color.rgb = RGBColor(0xCC, 0xCC, 0xD0)
            
        # 5. Bullet Lists & Nested List (e.g. Mục lục)
        elif stripped.startswith('- ') or stripped.startswith('* '):
            indent_level = len(raw_line) - len(raw_line.lstrip(' '))
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2.5)
            p.paragraph_format.line_spacing = 1.25
            
            # Indent based on depth (Nested table of contents or lists)
            if indent_level >= 4:
                p.paragraph_format.left_indent = Inches(0.45)
            elif indent_level >= 2:
                p.paragraph_format.left_indent = Inches(0.25)
            else:
                p.paragraph_format.left_indent = Inches(0.15)
                
            r_bullet = p.add_run("• ")
            r_bullet.bold = True
            r_bullet.font.name = 'Times New Roman'
            r_bullet.font.size = Pt(11)
            r_bullet.font.color.rgb = RGBColor(0x8E, 0x3F, 0x63)
            
            add_formatted_text(p, stripped[2:], default_size=Pt(11))
            
        # 6. Numbered Lists
        elif re.match(r'^\d+\.\s', stripped):
            prefix = re.match(r'^\d+\.\s', stripped).group(0)
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.line_spacing = 1.25
            p.paragraph_format.left_indent = Inches(0.25)
            
            r_num = p.add_run(prefix)
            r_num.bold = True
            r_num.font.name = 'Times New Roman'
            r_num.font.size = Pt(11)
            r_num.font.color.rgb = RGBColor(0x15, 0x1B, 0x31)
            
            add_formatted_text(p, stripped[len(prefix):], default_size=Pt(11))
            
        # 7. Normal Paragraphs
        else:
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.line_spacing = 1.25
            add_formatted_text(p, stripped, default_size=Pt(11))

    doc.save(docx_path)
    print(f"DOCX created successfully at: {docx_path}")

if __name__ == "__main__":
    src = Path("docs/Bao_Cao_KHKT_Website_Tam_Ly_THPT_Hoang_Hoa_Tham.md")
    dest = Path("docs/Bao_Cao_KHKT_Website_Tam_Ly_THPT_Hoang_Hoa_Tham.docx")
    convert_md_to_docx(src, dest)
