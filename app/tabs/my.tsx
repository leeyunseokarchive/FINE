import { router, Stack } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { QUIZ_LIST } from "../../src/data/quiz";

export default function MyScreen() {
  // 지표만 필터링 (subject가 "지표"인 항목들)
  const indicatorItems = useMemo(() => 
    QUIZ_LIST.filter(item => item.subject === "지표"), 
    []
  );

  const handleAssetConfig = () => {
    router.push("/asset-config");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "나의 자산",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 18, fontWeight: "700" }
        }} 
      />

      {/* 고정 헤더 섹션 */}
      <View style={styles.fixedSection}>
        {/* 상단 안정추구형 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.circleContainer}>
            <View style={styles.semicircle} />
          </View>
          
          <Text style={styles.profileTitle}>안정추구형</Text>
          <Text style={styles.profileDescription}>
            안정투자형은 위험을 최소화하고 원금 보전을 중시하는 투자 유형입니다.
          </Text>
        </View>

        {/* 자산구성하기 버튼 */}
        <TouchableOpacity style={styles.addButton} onPress={handleAssetConfig}>
          <Text style={styles.addButtonText}>자산구성하기</Text>
        </TouchableOpacity>
      </View>

      {/* 스크롤 가능한 섹션 */}
      <ScrollView 
        style={styles.scrollSection}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 투자상품 카드 */}
        <View style={styles.productCard}>
          <View style={styles.productContent}>
            <Text style={styles.productText}>KB증권 공모주 청약 시, 청약한도 150% 우대혜택을 제공하는</Text>
            <Text style={styles.productText}>KB증권 공모주 1.5배 정기예금</Text>
          </View>
          <View style={styles.toggleContainer}>
            <View style={[styles.triangle, { width: 0, height: 0, borderWidth: 8 }]} />
            <View style={styles.toggle}>
              <View style={styles.toggleCircle} />
            </View>
          </View>
        </View>

        {/* 동적으로 생성되는 지표 카드들 */}
        {indicatorItems.map((item, index) => (
          <View key={item.id} style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>{item.title}</Text>
              <TouchableOpacity onPress={() => router.push(`/invest/${item.id}`)}>
                <Text style={styles.detailButton}>자세히보기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.progressRow}>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  {[1, 2, 3, 4, 5].map((segment, i) => (
                    <View 
                      key={i}
                      style={[
                        styles.progressSegment,
                        i < item.level && styles.progressSegmentActive
                      ]} 
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.progressText}>{item.level}/3</Text>
            </View>
          </View>
        ))}

        {/* 자산 구성하기 버튼 */}
        <TouchableOpacity style={styles.configureButton} onPress={handleAssetConfig}>
          <Text style={styles.configureButtonText}>자산 구성하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  fixedSection: {
    padding: 20,
    paddingBottom: 10,
  },
  scrollSection: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 50,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 4 },
    }),
  },
  circleContainer: {
    marginBottom: 16,
  },
  semicircle: {
    width: 100,
    height: 50,
    backgroundColor: "#3B82F6",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  profileDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  addButtonIcon: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  productContent: {
    flex: 1,
    marginRight: 12,
  },
  productText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  toggleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  triangle: {
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#9CA3AF",
    marginBottom: 4,
  },
  toggle: {
    width: 32,
    height: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleCircle: {
    width: 12,
    height: 12,
    backgroundColor: "#22C55E",
    borderRadius: 6,
    alignSelf: "flex-end",
  },
  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  detailButton: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBarContainer: {
    flex: 1,
    position: "relative",
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
  configureButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 8,
  },
  configureButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});