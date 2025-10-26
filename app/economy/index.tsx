import type { Href } from "expo-router";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { QUIZ_LIST } from "../../src/data/quiz";

export default function EconomyList() {
  const params = useLocalSearchParams();

  // 주제 필터링 없이 모든 퀴즈 가져오기
  // URL 파라미터 또는 기본값으로 난이도만 필터링
  const levelFromParams = params.level ? parseInt(params.level as string, 10) : 1;
  const levelFilteredData = QUIZ_LIST.filter(item => item.level === levelFromParams);

  return (
    <View style={styles.container}>
      {/* 헤더 제목 */}
      <Stack.Screen options={{ title: "교과목" }} />

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