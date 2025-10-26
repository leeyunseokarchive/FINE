import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { FOOD_LIST, FoodItem } from "../../src/data/food";
import { ACCESSORY_LIST, AccessoryItem } from "../../src/data/accessory";
import { useGameState } from "../../src/stores/gameState";

export default function CharacterScreen() {
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());
  const { money, subtractMoney } = useGameState();

  const handleSelectItem = (itemId: string) => {
    // 이미 선택된 아이템을 다시 클릭해도 해제되지 않음
    if (selectedItem === itemId) {
      return;
    }
    // 새로운 아이템을 선택하면 이전 선택 해제
    setSelectedItem(itemId);
  };

  const handlePurchaseItem = (item: FoodItem) => {
    if (item.price && money >= item.price) {
      subtractMoney(item.price);
      setPurchasedItems((prev) => new Set(prev).add(item.id));
      handleSelectItem(item.id);
    } else {
      // 돈이 부족한 경우 처리 (선택사항)
      console.log("돈이 부족합니다");
    }
  };

  const renderCategoryTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tabIcon, selectedCategory === "bed" && styles.tabIconActive]}
        onPress={() => setSelectedCategory("bed")}
      >
        <Text style={styles.tabEmoji}>🛏️</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tabIcon, selectedCategory === "food" && styles.tabIconActive]}
        onPress={() => setSelectedCategory("food")}
      >
        <Text style={styles.tabEmoji}>🍽️</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tabIcon, selectedCategory === "house" && styles.tabIconActive]}
        onPress={() => setSelectedCategory("house")}
      >
        <Text style={styles.tabEmoji}>🏠</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tabIcon, selectedCategory === "money" && styles.tabIconActive]}
        onPress={() => setSelectedCategory("money")}
      >
        <Text style={styles.tabEmoji}>💰</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItemList = () => {
    // 선택된 카테고리에 따라 다른 아이템 목록 표시
    let items: (FoodItem | AccessoryItem)[] = [];
    
    if (selectedCategory === "bed") {
      items = ACCESSORY_LIST;
    } else if (selectedCategory === "food") {
      items = FOOD_LIST;
    }
    // 다른 카테고리는 나중에 추가 가능
    
    if (items.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 없습니다</Text>
        </View>
      );
    }

    return items.map((item) => {
      const isSelected = selectedItem === item.id;
      const isPurchased = purchasedItems.has(item.id);
      const hasPrice = item.price !== undefined;

      return (
        <View key={item.id} style={styles.itemCard}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.explain}</Text>
          </View>
          <View style={styles.itemImagePlaceholder}>
            <Text style={styles.itemImageEmoji}>
              {selectedCategory === "bed" ? "🛏️" : "🍖"}
            </Text>
          </View>
          {isPurchased ? (
            <TouchableOpacity 
              style={[styles.selectButton, isSelected && styles.selectButtonSelected]}
              onPress={() => handleSelectItem(item.id)}
            >
              <Text style={[styles.selectButtonText, isSelected && styles.selectButtonTextSelected]}>선택</Text>
            </TouchableOpacity>
          ) : hasPrice ? (
            <TouchableOpacity 
              style={[styles.priceBadge, money < item.price! && styles.priceBadgeDisabled]}
              onPress={() => handlePurchaseItem(item)}
              disabled={money < item.price!}
            >
              <Text style={styles.priceText}>{item.price}</Text>
              <Text style={styles.priceEmoji}>🐟</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.selectButton, isSelected && styles.selectButtonSelected]}
              onPress={() => handleSelectItem(item.id)}
            >
              <Text style={[styles.selectButtonText, isSelected && styles.selectButtonTextSelected]}>선택</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      {renderCategoryTabs()}
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {renderItemList()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconActive: {
    backgroundColor: "#EC4899",
  },
  tabEmoji: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    gap: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: "#6B7280",
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  itemImageEmoji: {
    fontSize: 32,
  },
  priceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  priceBadgeDisabled: {
    opacity: 0.5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  priceEmoji: {
    fontSize: 16,
  },
  selectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#22C55E",
  },
  selectButtonSelected: {
    backgroundColor: "#86EFAC",
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  selectButtonTextSelected: {
    color: "#16A34A",
  },
  undoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  undoIcon: {
    fontSize: 20,
    color: "#6B7280",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
});

