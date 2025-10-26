export type AccessoryItem = {
  id: string;
  title: string;
  explain: string;
  price?: number;
};

export const ACCESSORY_LIST: AccessoryItem[] = [
  { id: "a1", title: "안경", explain: "스타일리시한 안경이다" },
  { id: "a2", title: "목걸이", explain: "우아한 목걸이이다", price: 200 },
  { id: "a3", title: "팔찌", explain: "세련된 팔찌이다", price: 150 },
  { id: "a4", title: "귀걸이", explain: "고급스러운 귀걸이이다", price: 180 },
  { id: "a5", title: "모자", explain: "트렌디한 모자이다", price: 100 },
  { id: "a6", title: "장갑", explain: "따뜻한 장갑이다", price: 80 },
  { id: "a7", title: "스카프", explain: "부드러운 스카프이다", price: 120 },
  { id: "a8", title: "벨트", explain: "클래식한 벨트이다", price: 90 },
  { id: "a9", title: "손목시계", explain: "세련된 손목시계이다", price: 500 },
  { id: "a10", title: "선글라스", explain: "시크한 선글라스이다", price: 150 },
];

