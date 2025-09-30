import { Stack } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { EXPENSES } from "../../src/data/expense";

type ExpandMap = Record<string, boolean>;

const formatTimeNow = () => {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `오늘 ${hh}:${mm}`;
};

const formatKRW = (n: number) => {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n).toLocaleString("ko-KR");
  return `${sign}${abs}₩`;
};

export default function ExpenseScreen() {
  const [expanded, setExpanded] = useState<ExpandMap>({});
  const nowText = useMemo(() => formatTimeNow(), []); // 화면 켤 때의 현재 시각으로 고정

  // 합계(양의 지출 합계로 보여주기)
  const totalSpent = useMemo(
    () =>
      EXPENSES.reduce((sum, e) => sum + Math.abs(e.amount), 0).toLocaleString(
        "ko-KR"
      ),
    []
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
          headerTransparent: true,
        }}
      />

      {/* 상단 요약 타이틀 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>오늘의 지출 {totalSpent}₩</Text>
      </View>

      <FlatList
        data={EXPENSES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => {
          const isOpen = !!expanded[item.id];
          return (
            <View style={styles.card}>
              {/* 1행: 제목/금액 (좌) / 시간(우) */}
              <View style={styles.row}>
                <Text style={styles.title}>
                  {item.title} {formatKRW(item.amount)}
                </Text>
                <Text style={styles.time}>{nowText}</Text>
              </View>

              {/* 2행: 미리보기 (접기/더보기) */}
              <Text
                style={styles.preview}
                numberOfLines={isOpen ? 0 : 2}
                ellipsizeMode="tail"
              >
                {item.preview}
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  setExpanded((m) => ({ ...m, [item.id]: !isOpen }))
                }
                style={styles.toggleBtn}
              >
                <Text style={styles.toggleText}>{isOpen ? "접기" : "더보기"}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" }, // 연회색 배경

  header: {
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 6,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#111827" },

  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 5 },
    }),
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
  time: { marginLeft: 8, fontSize: 12, color: "#6B7280" },

  preview: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
  },

  toggleBtn: { marginTop: 10, alignItems: "center" },
  toggleText: { fontSize: 12, color: "#6B7280", fontWeight: "600" },
});
