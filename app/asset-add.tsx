import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { QUIZ_LIST } from "../src/data/quiz";
import { updateSavedAssetValues, getSavedAssetValues } from "./asset-config";

// 전역 저장소 (asset-config.tsx와 공유)
let savedAssetValues: { [key: string]: number } = {};

export default function AssetAddScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  
  const handleBack = () => {
    router.push("/asset-config");
  };

  const handleSave = () => {
    // 현재 값들을 저장소에 저장
    Object.assign(savedAssetValues, assetValues);
    // asset-config.tsx의 전역 저장소도 업데이트
    updateSavedAssetValues(savedAssetValues);
    console.log("저장된 값들:", savedAssetValues);
    router.push("/asset-config");
  };

  // subject2가 일치하는 항목들 필터링
  const filteredAssets = useMemo(() => 
    QUIZ_LIST.filter(item => 
      item.subject === "투자상품" && item.subject2 === category
    ), 
    [category]
  );

  // 각 자산 항목별 값 상태 관리 (저장된 값이 있으면 불러오기)
  const [assetValues, setAssetValues] = useState<{ [key: string]: number }>(() => {
    const savedValues = getSavedAssetValues(); // 올바른 저장된 값들 가져오기
    const initialValues: { [key: string]: number } = {};
    filteredAssets.forEach(asset => {
      initialValues[asset.id] = savedValues[asset.id] || 1; // 저장된 값이 있으면 사용, 없으면 기본값 1
    });
    return initialValues;
  });

  // 값 변경 핸들러
  const handleValueChange = (assetId: string, value: number) => {
    setAssetValues(prev => ({
      ...prev,
      [assetId]: value
    }));
  };

  // 카테고리별 타이틀 메핑
  const getCategoryTitle = (category: string) => {
    const titleMap: { [key: string]: string } = {
      "현금 및 예금": "현금 및 예금",
      "채권": "채권", 
      "주식": "주식",
      "펀드, 기타 투자상품": "기타 투자상품"
    };
    return titleMap[category] || "자산 추가하기";
  };

  return (
    <View style={styles.container}>
       <Stack.Screen 
         options={{ 
           title: getCategoryTitle(category),
           headerTitleAlign: "center",
           headerTitleStyle: { fontSize: 18, fontWeight: "700" },
           headerLeft: () => (
             <TouchableOpacity onPress={handleBack} style={styles.backButton}>
               <Text style={styles.backIcon}>←</Text>
             </TouchableOpacity>
           ),
           headerRight: () => (
             <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
               <Text style={styles.saveButtonText}>저장</Text>
             </TouchableOpacity>
           ),
         }} 
       />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredAssets.map((asset) => (
          <View key={asset.id} style={styles.assetCard}>
            <View style={styles.cardHeader}>
              <View style={styles.titleSection}>
                <Text style={styles.assetTitle}>{asset.title}</Text>
                <TouchableOpacity 
                  style={styles.detailButton}
                  onPress={() => router.push(`/invest/${asset.id}`)}
                >
                  <Text style={styles.detailButtonText}>자세히보기</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.valueText}>{assetValues[asset.id]}</Text>
            </View>
            
            <View style={styles.sliderContainer}>

              <View style={styles.sliderTrack}>
                <View style={styles.sliderButtons}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.sliderButton,
                        assetValues[asset.id] === num && styles.sliderButtonActive
                      ]}
                      onPress={() => handleValueChange(asset.id, num)}
                    >
                      <Text style={[
                        styles.sliderButtonText,
                        assetValues[asset.id] === num && styles.sliderButtonTextActive
                      ]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  assetCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 3 },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  assetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginRight: 12,
  },
  detailButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  valueText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3B82F6",
    backgroundColor: "#EBF4FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    minWidth: 20,
    textAlign: "center",
    marginHorizontal: 8,
  },
  sliderTrack: {
    flex: 1,
    marginHorizontal: 8,
  },
  sliderButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sliderButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  sliderButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  sliderButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  sliderButtonTextActive: {
    color: "#FFFFFF",
  },
});
