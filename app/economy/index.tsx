import type { Href } from "expo-router";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { QUIZ_LIST } from "../../src/data/quiz";

export default function EconomyList() {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  // 경제, 회계, 경영 주제만 필터링
  const filteredData = QUIZ_LIST.filter(item => 
    item.subject === "경제" || item.subject === "회계" || item.subject === "경영"
  );

  // 선택된 레벨에 따라 추가 필터링
  const levelFilteredData = filteredData.filter(item => item.level === selectedLevel);

  const renderLevelTab = (level: number, label: string, color: string) => (
    <TouchableOpacity
      key={level}
      style={[
        styles.levelTab,
        { backgroundColor: selectedLevel === level ? color : "#F3F4F6" }
      ]}
      onPress={() => setSelectedLevel(level)}
    >
      <Text style={[
        styles.levelTabText,
        { color: selectedLevel === level ? "#FFFFFF" : "#6B7280" }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 제목 */}
      <Stack.Screen options={{ title: "경제의 정석" }} />

      {/* 난이도 탭 */}
      <View style={styles.tabContainer}>
        {renderLevelTab(1, "초급", "#10B981")}
        {renderLevelTab(2, "중급", "#F59E0B")}
        {renderLevelTab(3, "고급", "#EC4899")}
      </View>

      <FlatList
        data={levelFilteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              router.push({ pathname: "/economy/[id]", params: { id: item.id } } as Href)
            }
            style={styles.card}
          >
            {/* 제목과 별 아이콘 */}
            <View style={styles.row}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.starIcon}>☆</Text>
            </View>

            {/* 미리보기 */}
            <Text style={styles.preview} numberOfLines={2} ellipsizeMode="tail">
              {item.preview}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F0FDF4" // 연한 녹색 배경
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  levelTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  levelTabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    // 그림자
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  starIcon: {
    fontSize: 20,
    color: "#D1D5DB",
  },
  preview: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
});