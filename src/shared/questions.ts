import type {
  ScreeningQuestion,
  ScreeningTopicMeta,
  QuestionOption,
} from "./types.js";

export const LIKERT_OPTIONS: QuestionOption[] = [
  { label: "Không xảy ra", value: 0 },
  { label: "Thỉnh thoảng", value: 1 },
  { label: "Thường xuyên", value: 2 },
  { label: "Hầu như luôn luôn", value: 3 },
];

export const SCREENING_TOPICS: ScreeningTopicMeta[] = [
  {
    id: "stress",
    title: "Căng thẳng & Áp lực",
    description:
      "Đánh giá mức độ áp lực từ học tập, kỳ vọng gia đình và nhịp sống hàng ngày.",
    icon: "Brain",
  },
  {
    id: "depression",
    title: "Tâm trạng & Cảm xúc tiêu cực",
    description:
      "Sàng lọc các biểu hiện u uất, mất hứng thú hoặc giảm năng lượng kéo dài.",
    icon: "CloudRain",
  },
  {
    id: "anxiety",
    title: "Lo âu & Căng thẳng thần kinh",
    description:
      "Đánh giá tình trạng hồi hộp, lo sợ vô cớ hoặc căng thẳng cơ thể.",
    icon: "AlertCircle",
  },
  {
    id: "focus",
    title: "Khả năng tập trung",
    description: "Sàng lọc khó khăn trong việc chú ý, hoàn thành công việc.",
    icon: "Target",
  },
  {
    id: "hyperactivity",
    title: "Năng lượng & Bồn chồn",
    description:
      "Đánh giá sự bồn chồn, khó ngồi yên hoặc xu hướng hành động bốc đồng.",
    icon: "Zap",
  },
  {
    id: "social",
    title: "Mối quan hệ xã hội & Bạn bè",
    description:
      "Sàng lọc áp lực đồng lứa, cảm giác cô đơn hoặc xung đột bạn bè.",
    icon: "Users",
  },
  {
    id: "study",
    title: "Áp lực học tập & Thi cử",
    description:
      "Đánh giá mức độ quá tải bài vở, sợ thi cử và động cơ học tập.",
    icon: "BookOpen",
  },
  {
    id: "career",
    title: "Định hướng tương lai & Nghề nghiệp",
    description:
      "Đánh giá sự hoang mang về chọn ngành, chọn trường và dự định tương lai.",
    icon: "Compass",
  },
];

export const SCREENING_QUESTIONS: ScreeningQuestion[] = [
  // 1. Stress (10 câu, max 30)
  {
    id: "stress_01",
    topic: "stress",
    text: "Bạn cảm thấy dễ bị kích động hoặc bực bội vì những chuyện nhỏ?",
  },
  {
    id: "stress_02",
    topic: "stress",
    text: "Bạn thấy mình phản ứng quá đà trước các tình huống áp lực?",
  },
  {
    id: "stress_03",
    topic: "stress",
    text: "Bạn khó thư giãn hoặc thả lỏng cơ thể sau giờ học?",
  },
  {
    id: "stress_04",
    topic: "stress",
    text: "Bạn cảm thấy mình đang tốn quá nhiều năng lượng thần kinh cho bài vở?",
  },
  {
    id: "stress_05",
    topic: "stress",
    text: "Bạn dễ mất kiên nhẫn khi mọi việc không theo ý muốn?",
  },
  {
    id: "stress_06",
    topic: "stress",
    text: "Bạn cảm thấy áp lực từ sự kỳ vọng của bố mẹ hoặc thầy cô?",
  },
  {
    id: "stress_07",
    topic: "stress",
    text: "Bạn hay bị đau đầu, đau vai gáy hoặc căng cơ sau ngày học?",
  },
  {
    id: "stress_08",
    topic: "stress",
    text: "Bạn cảm thấy như mình đang phải gánh vác quá nhiều trách nhiệm?",
  },
  {
    id: "stress_09",
    topic: "stress",
    text: "Bạn gặp khó khăn trong việc cân bằng giữa học tập và nghỉ ngơi?",
  },
  {
    id: "stress_10",
    topic: "stress",
    text: "Bạn thấy mình luôn ở trong trạng thái căng thẳng, lo sợ trễ hạn?",
  },

  // 2. Depression (10 câu, max 30) - Có red flag
  {
    id: "dep_01",
    topic: "depression",
    text: "Bạn cảm thấy không có gì để trông chờ vào tương lai?",
  },
  {
    id: "dep_02",
    topic: "depression",
    text: "Bạn mất hứng thú với các sở thích vốn từng rất yêu thích?",
  },
  {
    id: "dep_03",
    topic: "depression",
    text: "Bạn cảm thấy buồn bã, nản lòng hoặc chán nản kéo dài?",
  },
  {
    id: "dep_04",
    topic: "depression",
    text: "Bạn thấy mình thiếu năng lượng hoặc luôn mệt mỏi?",
  },
  {
    id: "dep_05",
    topic: "depression",
    text: "Bạn cảm thấy bản thân vô giá trị hoặc làm người khác thất vọng?",
  },
  {
    id: "dep_06",
    topic: "depression",
    text: "Bạn hay có cảm giác tội lỗi bâng quơ?",
  },
  {
    id: "dep_07",
    topic: "depression",
    text: "Bạn cảm thấy cuộc sống hiện tại thật vô nghĩa?",
  },
  {
    id: "dep_08",
    topic: "depression",
    text: "Bạn muốn thu mình lại, tránh né giao tiếp với gia đình và bạn bè?",
  },
  {
    id: "dep_09",
    topic: "depression",
    text: "Bạn gặp khó khăn nghiêm trọng về giấc ngủ (mất ngủ hoặc ngủ quá nhiều)?",
  },
  {
    id: "dep_10",
    topic: "depression",
    text: "Bạn từng có suy nghĩ rằng mình không muốn tiếp tục sống hoặc muốn làm tổn thương bản thân?",
    redFlag: true,
  },

  // 3. Anxiety (10 câu, max 30) - Có red flag
  {
    id: "anx_01",
    topic: "anxiety",
    text: "Bạn bị khô miệng hoặc tim đập nhanh mà không phải do vận động?",
  },
  {
    id: "anx_02",
    topic: "anxiety",
    text: "Bạn cảm thấy khó thở hoặc hụt hơi khi lo lắng?",
  },
  {
    id: "anx_03",
    topic: "anxiety",
    text: "Bạn bị run tay hoặc cảm giác bủn rủn chân tay?",
  },
  {
    id: "anx_04",
    topic: "anxiety",
    text: "Bạn hay lo sợ những điều tồi tệ nhất sẽ xảy ra?",
  },
  {
    id: "anx_05",
    topic: "anxiety",
    text: "Bạn cảm thấy hoảng sợ hoặc hoảng loạn trong các tình huống đông người?",
  },
  {
    id: "anx_06",
    topic: "anxiety",
    text: "Bạn cảm thấy bất an, hồi hộp trước mỗi giờ kiểm tra?",
  },
  {
    id: "anx_07",
    topic: "anxiety",
    text: "Bạn hay bị ốm vặt, đau bụng hoặc buồn nôn khi gặp chuyện căng thẳng?",
  },
  {
    id: "anx_08",
    topic: "anxiety",
    text: "Bạn thấy mình dễ bị giật mình hoặc giật thót trước tiếng động?",
  },
  {
    id: "anx_09",
    topic: "anxiety",
    text: "Bạn cảm thấy lo âu đến mức không thể kiểm soát suy nghĩ của mình?",
  },
  {
    id: "anx_10",
    topic: "anxiety",
    text: "Bạn từng có cơn hoảng sợ dữ dội khiến bạn cảm thấy mất kiểm soát hoàn toàn?",
    redFlag: true,
  },

  // 4. Focus (10 câu, max 30)
  {
    id: "foc_01",
    topic: "focus",
    text: "Bạn dễ bị phân tâm bởi tiếng động hoặc suy nghĩ tản mạn khi ngồi học?",
  },
  {
    id: "foc_02",
    topic: "focus",
    text: "Bạn gặp khó khăn trong việc ghi nhớ lời dặn của thầy cô hoặc bài học?",
  },
  {
    id: "foc_03",
    topic: "focus",
    text: "Bạn thường xuyên bỏ dở bài tập giữa chừng mà chuyển sang việc khác?",
  },
  {
    id: "foc_04",
    topic: "focus",
    text: "Bạn thấy mình hay để quên sách vở, đồ dùng học tập?",
  },
  {
    id: "foc_05",
    topic: "focus",
    text: "Bạn gặp khó khăn trong việc sắp xếp thứ tự ưu tiên khi có nhiều bài tập?",
  },
  {
    id: "foc_06",
    topic: "focus",
    text: "Bạn mất nhiều thời gian hơn bạn bè để hoàn thành cùng một lượng bài vở?",
  },
  {
    id: "foc_07",
    topic: "focus",
    text: "Bạn thường xuyên đọc xong một đoạn sách nhưng không nhớ vừa đọc gì?",
  },
  {
    id: "foc_08",
    topic: "focus",
    text: "Bạn thấy mình rất khó lắng nghe trọn vẹn một bài giảng dài?",
  },
  {
    id: "foc_09",
    topic: "focus",
    text: "Bạn hay trì hoãn bắt đầu học vì cảm thấy không biết tập trung từ đâu?",
  },
  {
    id: "foc_10",
    topic: "focus",
    text: "Bạn thấy trí nhớ ngắn hạn của mình kém hơn so với trước đây?",
  },

  // 5. Hyperactivity (10 câu, max 30)
  {
    id: "hyp_01",
    topic: "hyperactivity",
    text: "Bạn thấy khó ngồi yên một chỗ trong các tiết học kéo dài?",
  },
  {
    id: "hyp_02",
    topic: "hyperactivity",
    text: "Bạn hay ngọ nguậy tay chân hoặc quay bút liên tục?",
  },
  {
    id: "hyp_03",
    topic: "hyperactivity",
    text: "Bạn hay nói chèn ngang người khác khi họ chưa nói xong?",
  },
  {
    id: "hyp_04",
    topic: "hyperactivity",
    text: "Bạn thấy khó chờ đợi đến lượt mình trong các hoạt động nhóm?",
  },
  {
    id: "hyp_05",
    topic: "hyperactivity",
    text: "Bạn hay đưa ra quyết định vội vàng mà không suy nghĩ kỹ hậu quả?",
  },
  {
    id: "hyp_06",
    topic: "hyperactivity",
    text: "Bạn thấy trong người lúc nào cũng như có động cơ thúc giục phải hoạt động?",
  },
  {
    id: "hyp_07",
    topic: "hyperactivity",
    text: "Bạn dễ nổi giận bộc phát rồi nhanh chóng hối hận?",
  },
  {
    id: "hyp_08",
    topic: "hyperactivity",
    text: "Bạn thấy mình thích những trò chơi/hoạt động mạo hiểm mà thiếu cẩn trọng?",
  },
  {
    id: "hyp_09",
    topic: "hyperactivity",
    text: "Bạn gặp khó khăn khi thực hiện các công việc đòi hỏi sự tỉ mỉ, kiên nhẫn?",
  },
  {
    id: "hyp_10",
    topic: "hyperactivity",
    text: "Bạn hay thay đổi kế hoạch hoặc sở thích một cách quá đột ngột?",
  },

  // 6. Social (10 câu, max 30)
  {
    id: "soc_01",
    topic: "social",
    text: "Bạn cảm thấy khó kết bạn hoặc hòa nhập với tập thể lớp?",
  },
  {
    id: "soc_02",
    topic: "social",
    text: "Bạn thấy mình bị lạc lõng ngay cả khi đứng giữa nhóm bạn?",
  },
  {
    id: "soc_03",
    topic: "social",
    text: "Bạn hay có cảm giác bạn bè đang bàn tán hoặc xa lánh mình?",
  },
  {
    id: "soc_04",
    topic: "social",
    text: "Bạn gặp khó khăn trong việc bày tỏ quan điểm trước đám đông?",
  },
  {
    id: "soc_05",
    topic: "social",
    text: "Bạn cảm thấy lo sợ bị tẩy chay hoặc bị trêu chọc trên mạng / ở trường?",
  },
  {
    id: "soc_06",
    topic: "social",
    text: "Bạn hay xảy ra xích mích, hiểu lầm với bạn thân?",
  },
  {
    id: "soc_07",
    topic: "social",
    text: "Bạn thấy áp lực khi phải bắt chước phong cách/hành vi của nhóm bạn để được chấp nhận?",
  },
  {
    id: "soc_08",
    topic: "social",
    text: "Bạn không có ai để tâm sự chân thành khi gặp rắc rối?",
  },
  {
    id: "soc_09",
    topic: "social",
    text: "Bạn hay cảm thấy căng thẳng mỗi khi phải làm việc nhóm?",
  },
  {
    id: "soc_10",
    topic: "social",
    text: "Bạn thấy mình dễ bị tổn thương trước những lời nhận xét của người khác?",
  },

  // 7. Study (10 câu, max 30)
  {
    id: "std_01",
    topic: "study",
    text: "Bạn thấy quá tải trước lượng bài tập và lịch học thêm dày đặc?",
  },
  {
    id: "std_02",
    topic: "study",
    text: "Bạn sợ mỗi khi đến giờ kiểm tra hoặc trả bài?",
  },
  {
    id: "std_03",
    topic: "study",
    text: "Bạn cảm thấy mất động lực học tập, học chỉ vì đối phó?",
  },
  {
    id: "std_04",
    topic: "study",
    text: "Bạn thấy kết quả học tập không tương xứng với nỗ lực bỏ ra?",
  },
  {
    id: "std_05",
    topic: "study",
    text: "Bạn gặp áp lực nặng nề từ thành tích của các bạn cùng lớp?",
  },
  {
    id: "std_06",
    topic: "study",
    text: "Bạn bị ám ảnh bởi điểm số và sợ làm bố mẹ thất vọng?",
  },
  {
    id: "std_07",
    topic: "study",
    text: "Bạn cảm thấy mệt mỏi thiếp đi mỗi khi mở sách vở ra học?",
  },
  {
    id: "std_08",
    topic: "study",
    text: "Bạn thấy phương pháp học hiện tại của mình hoàn toàn không hiệu quả?",
  },
  {
    id: "std_09",
    topic: "study",
    text: "Bạn thường xuyên thức quá khuya để làm bài tập mà vẫn không hết việc?",
  },
  {
    id: "std_10",
    topic: "study",
    text: "Bạn cảm thấy mình muốn bỏ cuộc trước kỳ thi quan trọng sắp tới?",
  },

  // 8. Career (10 câu, max 30)
  {
    id: "car_01",
    topic: "career",
    text: "Bạn cảm thấy mơ hồ, không biết mình thích hay hợp với ngành nghề nào?",
  },
  {
    id: "car_02",
    topic: "career",
    text: "Bạn gặp xung đột giữa mong muốn của bản thân và định hướng của gia đình?",
  },
  {
    id: "car_03",
    topic: "career",
    text: "Bạn cảm thấy lo lắng khi thấy bạn bè xung quanh đã chọn xong trường/ngành?",
  },
  {
    id: "car_04",
    topic: "career",
    text: "Bạn thiếu thông tin tin cậy về các ngành nghề và cơ hội việc làm tương lai?",
  },
  {
    id: "car_05",
    topic: "career",
    text: "Bạn sợ rằng mình sẽ đưa ra quyết định chọn trường sai lầm?",
  },
  {
    id: "car_06",
    topic: "career",
    text: "Bạn cảm thấy áp lực tài chính gia đình ảnh hưởng đến việc chọn trường?",
  },
  {
    id: "car_07",
    topic: "career",
    text: "Bạn chưa từng được thực hiện bài trắc nghiệm hay tư vấn hướng nghiệp bài bản?",
  },
  {
    id: "car_08",
    topic: "career",
    text: "Bạn thấy mình có quá nhiều sở thích nhưng không cái nào thực sự nổi trội?",
  },
  {
    id: "car_09",
    topic: "career",
    text: "Bạn cảm thấy hoang mang trước những thay đổi nhanh chóng của thị trường lao động?",
  },
  {
    id: "car_10",
    topic: "career",
    text: "Bạn thiếu tự tin vào năng lực của mình để trúng tuyển vào nguyện vọng mong muốn?",
  },
];
