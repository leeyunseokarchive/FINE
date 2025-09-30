import { Stack } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "내 프로필",
          headerTitleAlign: "center",
          presentation: "modal", // 탭 위로 뜨는 느낌 (원하면 제거)
        }}
      />
      <View style={styles.card}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>홍길동</Text>
        <Text style={styles.sub}>LV.23 햄버거의 왕 🍔</Text>
        <View style={{ height: 12 }} />
        <Text style={styles.row}>최근 지출 카테고리: 외식</Text>
        <Text style={styles.row}>이번 주 퀴즈 진행: 3/10</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6", padding: 16 },
  card: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: "800", color: "#111827" },
  sub: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  row: { fontSize: 14, color: "#374151", marginTop: 4 },
});