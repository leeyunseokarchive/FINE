import { router, Stack } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { QUIZ_LIST } from "../src/data/quiz";

// 전역 저장된 값들 (asset-add.tsx와 공유) - 예시 데이터 포함
let globalSavedAssetValues: { [key: string]: number } = {
  "13": 3, // 보통예금
  "14": 3, // 정기예금  
  "15": 5, // CMA/MMF
  "16": 2, // 국채
  "17": 4, // 회사채
  "18": 3, // 금융채
  "19": 6, // 국내주식
  "20": 4, // 해외주식
  "21": 7, // ETF
  "22": 5, // 공모펀드
  "23": 3, // 리츠
  "24": 2, // 대체상품
  "25": 1, // 선물거래
  "26": 1  // 전환사채
};

// 저장된 값을 가져오기 위한 함수
export const getSavedAssetValues = () => {
  return globalSavedAssetValues;
};

// 값을 저장하는 함수 (asset-add.tsx에서 호출될 예정)
export const updateSavedAssetValues = (values: { [key: string]: number }) => {
  globalSavedAssetValues = { ...values };
};

export default function AssetConfigScreen() {
  const handleBack = () => {
    router.push("/tabs/my");
  };

  const handleAnalyzeInvestment = () => {
    // 투자성향 분석 화면으로 이동 (향후 구현)
    console.log("투자성향 분석하기");
  };

  // 돈넛 차트 세그먼트 데이터 (기본값, 실제 비율은 계산됨)
  const chartSegments = [
    { color: "#FCD34D", label: "현금 및 예금", name: "Deposit", category: "현금 및 예금" },
    { color: "#7DD3FC", label: "채권", name: "Bond", category: "채권" },
    { color: "#34D399", label: "주식", name: "Stock", category: "주식" },
    { color: "#FB7185", label: "펀드, 기타 투자상품", name: "Fund", category: "펀드, 기타 투자상품" },
  ];

  // 저장된 자산 값들 가져오기
  const savedValues = getSavedAssetValues();

  // 각 카테고리별 총 값 계산 및 비율 계산
  const calculateCategoryTotal = useMemo(() => {
    const totals: { [key: string]: { current: number; max: number; percentage: number } } = {};
    
    // 먼저 모든 카테고리의 current 값을 계산
    chartSegments.forEach(segment => {
      const categoryAssets = QUIZ_LIST.filter(item => 
        item.subject === "투자상품" && item.subject2 === segment.category
      );
      
      const currentTotal = categoryAssets.reduce((sum, asset) => {
        // 기본값은 1이 아니라 실제 저장된 키가 있는지 확인
        const value = savedValues.hasOwnProperty(asset.id) ? savedValues[asset.id] : 1;
        return sum + value;
      }, 0);
      
      const maxTotal = categoryAssets.length * 10; // 각 항목당 최대 10
      
      totals[segment.category] = {
        current: currentTotal,
        max: maxTotal,
        percentage: 0 // 임시로 0 설정
      };
    });
    
    // 전체 합계 계산
    const totalCurrent = Object.values(totals).reduce((sum, item) => sum + item.current, 0);
    
    // 각 카테고리의 비율 계산 (소수점 절삭)
    chartSegments.forEach(segment => {
      const categoryData = totals[segment.category];
      if (totalCurrent > 0) {
        totals[segment.category].percentage = Math.floor((categoryData.current / totalCurrent) * 100);
      }
    });
    
    return totals;
  }, [savedValues, chartSegments]);

  const handleNavigateToAssetAdd = (category: string) => {
    router.push(`/asset-add?category=${encodeURIComponent(category)}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "자산 구성하기",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 18, fontWeight: "700" },
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          ),
        }} 
      />

      <View style={styles.content}>
        {/* 돈넛 차트와 범례 */}
        <View style={styles.chartSection}>
          {/* 돈넛 차트 */}
          <View style={styles.donutChart}>
            <View style={styles.segmentContainer}>
              {chartSegments.map((segment, index) => {
                const percentage = calculateCategoryTotal[segment.category]?.percentage || 0;
                return (
                  <View
                    key={segment.name}
                    style={[
                      styles.segment,
                      {
                        backgroundColor: segment.color,
                        flex: percentage / 100, // 비율에 따른 flex 값
                      },
                    ]}
                  />
                );
              })}
            </View>
            <View style={styles.centerCircle}>
              <Text style={styles.centerPercentage}>100%</Text>
            </View>
          </View>

          {/* 범례 */}
          <View style={styles.legend}>
            {chartSegments.map((segment) => (
              <View key={segment.name} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: segment.color }]} />
                <Text style={styles.legendText}>{segment.label}</Text>
                <Text style={styles.legendPercentage}>{calculateCategoryTotal[segment.category]?.percentage || 0}%</Text>
              </View>
            ))}
          </View>
        </View>


        {/* 자산 카드들 */}
        <View style={styles.assetsCards}>
          {chartSegments.map((asset) => (
            <TouchableOpacity 
              key={asset.name} 
              style={styles.assetCard}
              onPress={() => handleNavigateToAssetAdd(asset.category)}
            >
              <Text style={styles.assetLabel}>{asset.label}</Text>
              <View style={styles.progressRow}>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    {[1, 2, 3, 4, 5].map((segment, i) => (
                      <View 
                        key={i}
                        style={[
                          styles.progressSegment,
                          i === 0 && styles.progressSegmentActive
                        ]} 
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.progressText}>
                  {calculateCategoryTotal[asset.category]?.current || 0}/{calculateCategoryTotal[asset.category]?.max || 10}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 투자성향 분석하기 버튼 */}
        <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyzeInvestment}>
          <Text style={styles.analyzeButtonText}>투자성향 분석하기</Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  chartSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    justifyContent: "space-between",
  },
  donutChart: {
    width: 120,
    height: 120,
    position: "relative",
  },
  segmentContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
  },
  segment: {
    height: "100%",
    borderRadius: 0,
  },
  centerCircle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -30 }, { translateY: -15 }],
    width: 60,
    height: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  centerPercentage: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  legend: {
    flex: 1,
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  legendPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  assetsCards: {
    marginBottom: 24,
  },
  assetCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
    }),
  },
  assetLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBarContainer: {
    flex: 1,
    marginRight: 12,
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    paddingHorizontal: 2,
    alignItems: "center",
  },
  progressSegment: {
    width: 8,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
  },
  progressSegmentActive: {
    backgroundColor: "#EF4444",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  analyzeButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
    }),
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});
