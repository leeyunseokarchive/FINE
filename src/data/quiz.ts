export type ListItem = {
  id: string;
  title: string;
  content: string;
  question: string;
  number_one: string;
  number_two: string;
  number_three: string;
  number_four: string;
  answer: number;
};

export const QUIZ_LIST: ListItem[] = [
  {
    id: "1",
    title: "CPI",
    content: "CPI(소비자물가지수)는 가계가 구입하는 상품과 서비스의 평균 가격 변동을 측정하는 지표입니다.",
    question: "CPI가 상승한다는 것은 무엇을 의미하나요?",
    number_one: "소비자 물가가 하락했다",
    number_two: "소비자 물가가 상승했다",
    number_three: "환율이 상승했다",
    number_four: "금리가 하락했다",
    answer: 2
  },
  {
    id: "2",
    title: "Core CPI",
    content: "Core CPI는 에너지와 식품을 제외한 물가 변동을 측정해 기본 물가 추세를 파악하는 데 사용됩니다.",
    question: "Core CPI에서 제외되는 항목은 무엇인가요?",
    number_one: "의류와 주거",
    number_two: "에너지와 식품",
    number_three: "교육과 의료",
    number_four: "교통과 통신",
    answer: 2
  },
  {
    id: "3",
    title: "Core PCE",
    content: "Core PCE 물가 지수는 개인소비지출에서 식품과 에너지를 제외하고 측정하며 연준이 선호하는 물가 지표입니다.",
    question: "미 연준이 주로 참고하는 물가 지표는 무엇인가요?",
    number_one: "Core PCE",
    number_two: "Headline CPI",
    number_three: "PPI",
    number_four: "GDP 디플레이터",
    answer: 1
  },
  {
    id: "4",
    title: "NFP",
    content: "NFP(비농업부문 고용지표)는 농업을 제외한 산업에서 새롭게 창출되거나 감소한 일자리 수를 나타냅니다.",
    question: "NFP가 예상보다 크게 증가하면 시장에 어떤 영향이 있나요?",
    number_one: "경기 둔화 신호",
    number_two: "고용 시장이 강함을 의미",
    number_three: "물가 하락 신호",
    number_four: "무역 적자 확대",
    answer: 2
  },
  {
    id: "5",
    title: "실업률",
    content: "실업률은 경제활동인구 중 일자리를 갖지 못한 사람들의 비율로 노동시장의 온도를 보여줍니다.",
    question: "실업률이 낮아지는 것은 일반적으로 무엇을 의미하나요?",
    number_one: "노동 시장이 개선되고 있다",
    number_two: "물가가 급락하고 있다",
    number_three: "환율이 상승하고 있다",
    number_four: "무역수지가 악화되고 있다",
    answer: 1
  },
  {
    id: "6",
    title: "평균 시간당 임금",
    content: "평균 시간당 임금은 노동자들이 시간당 받는 보상의 평균으로 임금 인플레이션을 판단하는 데 쓰입니다.",
    question: "평균 시간당 임금이 빠르게 상승하면 어떤 우려가 생길 수 있나요?",
    number_one: "임금 하락 압력",
    number_two: "소비 감소",
    number_three: "임금발 인플레이션",
    number_four: "실업률 급락",
    answer: 3
  },
  {
    id: "7",
    title: "GDP",
    content: "GDP는 일정 기간 동안 한 국가에서 생산된 모든 재화와 서비스의 총가치를 의미합니다.",
    question: "GDP가 성장한다는 것은 무엇을 나타내나요?",
    number_one: "경제 규모가 축소되고 있다",
    number_two: "경제 활동이 확대되고 있다",
    number_three: "실업률이 상승하고 있다",
    number_four: "물가가 하락하고 있다",
    answer: 2
  },
  {
    id: "8",
    title: "ISM PMI",
    content: "ISM 제조업 PMI는 미국 제조업 경기를 조사해 50 이상이면 확장, 미만이면 위축을 의미합니다.",
    question: "ISM PMI가 50보다 높으면 무엇을 뜻하나요?",
    number_one: "제조업 위축",
    number_two: "제조업 확장",
    number_three: "물가 하락",
    number_four: "고용 감소",
    answer: 2
  },
  {
    id: "9",
    title: "Retail Sales",
    content: "소매판매지표는 소비자들의 상품 구매 활동을 측정해 소비 경기 흐름을 파악하는 자료입니다.",
    question: "Retail Sales가 증가하면 일반적으로 어떤 해석이 가능한가요?",
    number_one: "소비자 지출이 줄었다",
    number_two: "소비가 활발하다",
    number_three: "수출이 감소했다",
    number_four: "재고가 감소했다",
    answer: 2
  },
  {
    id: "10",
    title: "기준금리",
    content: "기준금리는 중앙은행이 시중은행에 적용하는 대표 금리로 다른 시장 금리를 결정하는 기준이 됩니다.",
    question: "기준금리를 인상하면 일반적으로 어떤 효과가 기대되나요?",
    number_one: "통화 완화",
    number_two: "물가 상승 압력 확대",
    number_three: "대출 비용 증가로 경기 둔화",
    number_four: "환율 하락",
    answer: 3
  },
];