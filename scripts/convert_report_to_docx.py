#!/usr/bin/env python3
"""
Trình chuyển đổi Markdown sang DOCX chuyên nghiệp cho báo cáo KHKT:
1. Phát hiện khối mã ```mermaid.
2. Dùng mermaid-cli (mmdc) kết xuất thành ảnh PNG chất lượng cao.
3. Chèn ảnh sơ đồ vào Word thay vì in raw text/code.
4. Xử lý ảnh chụp màn hình, bảng biểu, heading, list, typography A4 chuẩn học thuật.
"""

import os
import re
import subprocess
import hashlib
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'))

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_formatted_text(paragraph, text):
    pattern = re.compile(r'(\*\*.*?\*\*|\*.*?\*|`.*?`)')
    tokens = pattern.split(text)
    for token in tokens:
        if not token:
            continue
        if token.startswith('**') and token.endswith('**'):
            run = paragraph.add_run(token[2:-2])
            run.bold = True
        elif token.startswith('*') and token.endswith('*'):
            run = paragraph.add_run(token[1:-1])
            run.italic = True
        elif token.startswith('`') and token.endswith('`'):
            run = paragraph.add_run(token[1:-1])
            run.font.name = 'Courier New'
            run.font.size = Pt(10)
        else:
            paragraph.add_run(token)

def render_mermaid_to_png(mermaid_code, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    code_hash = hashlib.md5(mermaid_code.strip().encode('utf-8')).hexdigest()[:12]
    mmd_file = os.path.join(output_dir, f"chart_{code_hash}.mmd")
    png_file = os.path.join(output_dir, f"chart_{code_hash}.png")

    if not os.path.exists(png_file):
        with open(mmd_file, 'w', encoding='utf-8') as f:
            f.write(mermaid_code)

        # Chạy mmdc
        puppeteer_cfg = os.path.abspath('docs/puppeteer-config.json')
        cmd = [
            'npx', 'mmdc',
            '-p', puppeteer_cfg,
            '-i', mmd_file,
            '-o', png_file,
            '-b', 'white',
            '-s', '2' # scale 2x cho nét
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Lỗi render Mermaid: {res.stderr}")
            return None

    return png_file

def convert_md_to_docx(md_path, docx_path):
    print(f"Bắt đầu chuyển đổi: {md_path} -> {docx_path}")
    doc = Document()

    # Thiết lập kích thước trang A4 và lề
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(0.8)

    style_normal = doc.styles['Normal']
    font = style_normal.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    font.color.rgb = RGBColor(0x11, 0x18, 0x27)

    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    base_dir = os.path.dirname(os.path.abspath(md_path))
    mermaid_dir = os.path.join(base_dir, 'mermaid_rendered')

    in_table = False
    table_rows = []
    in_code_block = False
    code_block_lang = ''
    code_lines = []

    i = 0
    while i < len(lines):
        line = lines[i].rstrip('\r\n')
        stripped = line.strip()

        # Bắt đầu / kết thúc khối mã
        if stripped.startswith('```'):
            if in_code_block:
                in_code_block = False
                code_text = '\n'.join(code_lines)
                if code_block_lang == 'mermaid':
                    png_path = render_mermaid_to_png(code_text, mermaid_dir)
                    if png_path and os.path.exists(png_path):
                        p_img = doc.add_paragraph()
                        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
                        p_img.paragraph_format.space_before = Pt(8)
                        p_img.paragraph_format.space_after = Pt(6)
                        run_img = p_img.add_run()
                        run_img.add_picture(png_path, width=Inches(5.8))
                    else:
                        p = doc.add_paragraph()
                        p.paragraph_format.left_indent = Inches(0.3)
                        run = p.add_run(code_text)
                        run.font.name = 'Courier New'
                        run.font.size = Pt(9.5)
                else:
                    p = doc.add_paragraph()
                    p.paragraph_format.left_indent = Inches(0.3)
                    p.paragraph_format.space_before = Pt(4)
                    p.paragraph_format.space_after = Pt(6)
                    run = p.add_run(code_text)
                    run.font.name = 'Courier New'
                    run.font.size = Pt(9.5)
                    run.font.color.rgb = RGBColor(0x37, 0x41, 0x51)
                code_lines = []
                code_block_lang = ''
            else:
                in_code_block = True
                code_block_lang = stripped[3:].strip().lower()
                code_lines = []
            i += 1
            continue

        if in_code_block:
            code_lines.append(line)
            i += 1
            continue

        # Kết thúc bảng nếu dòng hiện tại không phải dòng bảng
        if in_table and (not stripped.startswith('|') or not stripped.endswith('|')):
            render_table(doc, table_rows)
            in_table = False
            table_rows = []

        if stripped in ('---', '***', '___'):
            i += 1
            continue

        if not stripped:
            i += 1
            continue

        # Bảng biểu
        if stripped.startswith('|') and stripped.endswith('|'):
            if re.match(r'^\|[\s\:\-\|]+\|$', stripped):
                i += 1
                continue
            cells = [c.strip() for c in stripped[1:-1].split('|')]
            table_rows.append(cells)
            in_table = True
            i += 1
            continue

        # Hình ảnh Markdown
        img_match = re.match(r'^!\[(.*?)\]\((.*?)\)$', stripped)
        if img_match:
            alt_text, img_rel_path = img_match.groups()
            full_img_path = os.path.normpath(os.path.join(base_dir, img_rel_path))
            if os.path.exists(full_img_path):
                p_img = doc.add_paragraph()
                p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p_img.paragraph_format.space_before = Pt(8)
                p_img.paragraph_format.space_after = Pt(2)
                run_img = p_img.add_run()
                run_img.add_picture(full_img_path, width=Inches(6.0))
            else:
                print(f"Cảnh báo: Không tìm thấy ảnh tại {full_img_path}")
            i += 1
            continue

        # Chú thích hình ảnh (*Hình...*)
        if stripped.startswith('*Hình') and stripped.endswith('*'):
            caption_text = stripped[1:-1]
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_before = Pt(2)
            p_cap.paragraph_format.space_after = Pt(10)
            run_cap = p_cap.add_run(caption_text)
            run_cap.italic = True
            run_cap.font.name = 'Times New Roman'
            run_cap.font.size = Pt(10.5)
            run_cap.font.color.rgb = RGBColor(0x4B, 0x55, 0x63)
            i += 1
            continue

        # Heading 1..5
        if stripped.startswith('# '):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(8)
            run = p.add_run(stripped[2:])
            run.bold = True
            run.font.name = 'Times New Roman'
            run.font.size = Pt(18)
            run.font.color.rgb = RGBColor(0x11, 0x18, 0x27)
        elif stripped.startswith('## '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(12)
            p.paragraph_format.space_after = Pt(6)
            run = p.add_run(stripped[3:])
            run.bold = True
            run.font.name = 'Times New Roman'
            run.font.size = Pt(15)
            run.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)
        elif stripped.startswith('### '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(4)
            run = p.add_run(stripped[4:])
            run.bold = True
            run.font.name = 'Times New Roman'
            run.font.size = Pt(13.5)
            run.font.color.rgb = RGBColor(0x37, 0x41, 0x51)
        elif stripped.startswith('#### '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(3)
            run = p.add_run(stripped[5:])
            run.bold = True
            run.font.name = 'Times New Roman'
            run.font.size = Pt(12.5)
        elif stripped.startswith('##### '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(2)
            run = p.add_run(stripped[6:])
            run.bold = True
            run.font.name = 'Times New Roman'
            run.font.size = Pt(12)

        # Danh sách đầu dòng
        elif stripped.startswith('- ') or stripped.startswith('* '):
            indent_level = (len(line) - len(line.lstrip())) // 2
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.2
            if indent_level > 0:
                p.paragraph_format.left_indent = Inches(0.25 * (indent_level + 1))
            add_formatted_text(p, stripped[2:])

        # Danh sách đánh số
        elif re.match(r'^\d+\.\s', stripped):
            match = re.match(r'^\d+\.\s', stripped)
            num_prefix = match.group(0)
            content = stripped[len(num_prefix):]
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.3)
            p.paragraph_format.first_line_indent = Inches(-0.3)
            p.paragraph_format.space_before = Pt(1.5)
            p.paragraph_format.space_after = Pt(1.5)
            p.paragraph_format.line_spacing = 1.25
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            run_num = p.add_run(num_prefix)
            run_num.bold = True
            add_formatted_text(p, content)

        # Đoạn văn thông thường
        else:
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.line_spacing = 1.25
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            add_formatted_text(p, stripped)

        i += 1

    if in_table:
        render_table(doc, table_rows)

    doc.save(docx_path)
    print(f"Hoàn thành tạo tệp Word: {docx_path}")

def render_table(doc, rows):
    if not rows:
        return
    num_cols = max(len(r) for r in rows)
    table = doc.add_table(rows=len(rows), cols=num_cols)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = True

    # Định dạng bảng chuẩn viền nhẹ nhàng, không để viền thô hay lỗi gạch ngang
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/>'
        f'<w:left w:val="none"/>'
        f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="E5E7EB"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

    for r_idx, row_data in enumerate(rows):
        is_header = (r_idx == 0)
        row = table.rows[r_idx]
        for c_idx, cell_value in enumerate(row_data):
            if c_idx < len(row.cells):
                cell = row.cells[c_idx]
                cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
                set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
                if is_header:
                    set_cell_background(cell, "F9FAFB")
                p = cell.paragraphs[0]
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(2)
                p.paragraph_format.line_spacing = 1.15
                add_formatted_text(p, cell_value)
                if is_header:
                    for run in p.runs:
                        run.bold = True
                        run.font.size = Pt(10)
                        run.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)
                else:
                    for run in p.runs:
                        run.font.size = Pt(9.5)

    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_before = Pt(2)
    p_spacer.paragraph_format.space_after = Pt(4)

if __name__ == '__main__':
    md = 'docs/Bao_Cao_KHKT_Website_Tam_Ly_THPT_Hoang_Hoa_Tham.md'
    out = 'docs/Bao_Cao_KHKT_Website_Tam_Ly_THPT_Hoang_Hoa_Tham.docx'
    convert_md_to_docx(md, out)
