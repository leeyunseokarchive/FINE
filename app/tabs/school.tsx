import type { Href } from "expo-router";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { QUIZ_LIST } from "../../src/data/quiz";

export default function SchoolScreen() {
  const [activeTab, setActiveTab] = useState<"지표" | "종목">("지표");

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "학교" }} />

      <View style={styles.overlay}>
        {/* 상단 탭: 지표 | 종목 */}
        <View style={styles.topTabs}>
          <TouchableOpacity
            style={[styles.topTab, activeTab === "지표" && styles.topTabActive]}
            onPress={() => setActiveTab("지표")}
          >
            <Text
              style={[
                styles.topTabText,
                activeTab === "지표" && styles.topTabTextActive,
              ]}
            >
              지표
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.topTab, activeTab === "종목" && styles.topTabActive]}
            onPress={() => setActiveTab("종목")}
          >
            <Text
              style={[
                styles.topTabText,
                activeTab === "종목" && styles.topTabTextActive,
              ]}
            >
              종목
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "지표" ? (
          <FlatList
            data={QUIZ_LIST}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  router.push(
                    { pathname: "/quiz/[id]", params: { id: item.id } } as Href
                  )
                }
                style={styles.card}
              >
                <Text style={styles.title}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.emptyStocks}>
            <Text style={styles.emptyStocksText}>
              종목 관련 콘텐츠는 준비 중입니다.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: "#FFFFFF",
  },
  topTabs: {
    flexDirection: "row",
    marginBottom: 12,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    padding: 4,
  },
  topTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
  },
  topTabActive: {
    backgroundColor: "#FFFFFF",
  },
  topTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  topTabTextActive: {
    color: "#111827",
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  emptyStocks: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStocksText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
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
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
});

