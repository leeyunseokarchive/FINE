import type { Href } from "expo-router";
import { router, Stack } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { QUIZ_LIST } from "../../src/data/quiz";

export default function InvestList() {
  return (
    <View style={styles.container}>
      {/* 헤더 제목 */}
      <Stack.Screen options={{ title: "투자의 정석" }} />

      <FlatList
        data={useMemo(() => QUIZ_LIST.filter(i => i.subject === "투자" || i.subject === "투자상품" || i.subject === "지표"), [])}
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
            {/* 1행: 제목(좌) / 시간(우) */}
            <View style={styles.row}>
              <Text style={styles.title}>{item.title}</Text>
            </View>

            {/* 2행: 본문 미리보기 (2줄, 줄임표) */}
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
  container: { flex: 1, backgroundColor: "#F3F4F6" }, // 연회색 배경
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
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
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
  },
  preview: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
  },
});