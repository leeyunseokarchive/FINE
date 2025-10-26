export type FoodItem = {
  id: string;
  title: string;
  explain: string;
  price?: number;
};

export const FOOD_LIST: FoodItem[] = [
  { id: "f1", title: "밥", explain: "정성스럽게 짓은 밥이다" },
  { id: "f2", title: "국수", explain: "시원한 국수 요리다", price: 50 },
  { id: "f3", title: "피자", explain: "치즈가 가득한 피자다", price: 100 },
  { id: "f4", title: "햄버거", explain: "통통한 햄버거다", price: 80 },
  { id: "f5", title: "치킨", explain: "바삭한 치킨이다", price: 150 },
  { id: "f6", title: "라면", explain: "뜨끈한 라면이다", price: 30 },
  { id: "f7", title: "김치찌개", explain: "얼큰한 김치찌개다", price: 60 },
  { id: "f8", title: "비빔밥", explain: "영양만점 비빔밥이다", price: 70 },
  { id: "f9", title: "떡볶이", explain: "매콤한 떡볶이다", price: 40 },
  { id: "f10", title: "순두부찌개", explain: "부드러운 순두부찌개다", price: 55 },
];

