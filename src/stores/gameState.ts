import { create } from "zustand";

interface GameState {
  money: number;
  setMoney: (money: number) => void;
  addMoney: (amount: number) => void;
  subtractMoney: (amount: number) => void;
  
  happy: number; // 0~100 범위
  setHappy: (happy: number) => void;
  addHappy: (amount: number) => void;
  subtractHappy: (amount: number) => void;
  
  // 다른 게임 변수들도 여기에 추가 가능
  // level: number;
  // experience: number;
  // health: number;
}

export const useGameState = create<GameState>((set) => ({
  money: 10000, // 초기값 10000
  setMoney: (money) => set({ money }),
  addMoney: (amount) => set((state) => ({ money: state.money + amount })),
  subtractMoney: (amount) => set((state) => ({ 
    money: Math.max(0, state.money - amount) 
  })),
  
  happy: 50, // 초기값 50 (범위: 0~100)
  setHappy: (happy) => set({ happy: Math.max(0, Math.min(100, happy)) }),
  addHappy: (amount) => set((state) => ({ 
    happy: Math.min(100, state.happy + amount) 
  })),
  subtractHappy: (amount) => set((state) => ({ 
    happy: Math.max(0, state.happy - amount) 
  })),
}));

