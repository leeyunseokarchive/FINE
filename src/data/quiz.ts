export type ListItem = {
  id: string;
  title: string;
  preview: string;
  content: string;
  question: string;
  number_one: string;
  number_two: string;
  number_three: string;
  number_four: string;
  answer: number;
  subject: string;
  level: number;
};

export const QUIZ_LIST: ListItem[] = [
  { 
    id: "1", 
    title: "수요와 공급의 법칙", 
    preview: "경제학의 기본 원리인 수요와 공급에 대해 알아보세요", 
    content: "수요와 공급은 시장 경제의 핵심 개념입니다. 가격이 어떻게 결정되는지 이해해보세요.",
    question: "가격이 상승할 때 수요는 어떻게 변하나요?",
    number_one: "증가한다",
    number_two: "감소한다", 
    number_three: "변화가 없다",
    number_four: "불규칙하게 변한다",
    answer: 2,
    subject: "경제",
    level: 1
  },
  { 
    id: "2", 
    title: "인플레이션의 원인", 
    preview: "물가 상승의 주요 원인들을 파악해보세요", 
    content: "인플레이션은 경제에서 중요한 현상입니다. 그 원인과 영향을 알아보세요.",
    question: "인플레이션의 가장 일반적인 원인은 무엇인가요?",
    number_one: "수요 증가",
    number_two: "공급 감소",
    number_three: "화폐 공급 증가",
    number_four: "모든 위의 것들",
    answer: 4,
    subject: "경제",
    level: 2
  },
  { 
    id: "3", 
    title: "회계의 기본 원리", 
    preview: "회계의 기본 개념과 원칙을 학습해보세요", 
    content: "회계는 기업의 재무 상태를 파악하는 중요한 도구입니다.",
    question: "회계에서 '차변'과 '대변'의 관계는 무엇인가요?",
    number_one: "차변 = 대변",
    number_two: "차변 > 대변",
    number_three: "차변 < 대변",
    number_four: "관계가 없다",
    answer: 1,
    subject: "회계",
    level: 1
  },
  { 
    id: "4", 
    title: "투자 위험 관리", 
    preview: "투자 시 위험을 줄이는 방법들을 알아보세요", 
    content: "투자에는 항상 위험이 따릅니다. 이를 관리하는 방법을 학습해보세요.",
    question: "투자 위험을 줄이는 가장 효과적인 방법은 무엇인가요?",
    number_one: "한 종목에만 투자",
    number_two: "포트폴리오 분산",
    number_three: "단기 투자",
    number_four: "고위험 자산 선택",
    answer: 2,
    subject: "지표",
    level: 2
  },
  { 
    id: "5", 
    title: "경영 전략의 종류", 
    preview: "다양한 경영 전략 유형을 이해해보세요", 
    content: "기업이 성공하기 위해 사용하는 다양한 전략들을 알아보세요.",
    question: "시장에서 새로운 제품이나 서비스를 제공하는 전략은 무엇인가요?",
    number_one: "차별화 전략",
    number_two: "원가 우위 전략",
    number_three: "집중화 전략",
    number_four: "혁신 전략",
    answer: 1,
    subject: "경영",
    level: 3
  },
  { 
    id: "6", 
    title: "금융 상품의 종류", 
    preview: "다양한 금융 상품과 그 특징을 파악해보세요", 
    content: "금융 시장에는 다양한 상품들이 있습니다. 각각의 특징을 알아보세요.",
    question: "예금과 적금의 가장 큰 차이점은 무엇인가요?",
    number_one: "이자율",
    number_two: "만기 기간",
    number_three: "입금 방식",
    number_four: "보장 범위",
    answer: 3,
    subject: "투자상품",
    level: 1
  },
  { 
    id: "7", 
    title: "분산투자의 효과", 
    preview: "분산투자가 포트폴리오에 미치는 영향을 이해해보세요", 
    content: "분산투자는 투자 위험을 줄이는 핵심 전략입니다. 다양한 자산에 투자하여 위험을 분산시키는 방법을 알아보세요.",
    question: "분산투자의 가장 큰 장점은 무엇인가요?",
    number_one: "수익률 증가",
    number_two: "투자 위험 감소",
    number_three: "거래 비용 절약",
    number_four: "세금 혜택",
    answer: 2,
    subject: "지표",
    level: 3
  }
];