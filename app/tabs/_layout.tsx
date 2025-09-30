// app/tabs/_layout.tsx
import React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Icon = ({
  name, color, size, focused, withBadge = false,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  focused: boolean;
  withBadge?: boolean;
}) => {
  if (withBadge && focused) {
    return (
      <View style={{
        width: 44, height: 44, borderRadius: 22,
        alignItems: "center", justifyContent: "center", backgroundColor: "#22c55e",
      }}>
        <Ionicons name={name} size={24} color="#fff" />
      </View>
    );
  }
  return <Ionicons name={name} size={size} color={color} />;
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600", marginTop: 4 },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#fff",
          borderTopWidth: 0,
          height: 88,
          paddingTop: 8,
          paddingBottom: 18,
          paddingHorizontal: 28,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 12,
          elevation: 16,
        },
      }}
    >
      {/* 파일명과 name 반드시 일치: app/tabs/expense.tsx */}
      <Tabs.Screen
        name="expense"
        options={{
          title: "Expense",
          tabBarLabel: "Expense", // ← 라벨 강제 지정
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name="receipt-outline" color={color} size={size} focused={focused} />
          ),
        }}
      />

      {/* 가운데 홈 */}
      <Tabs.Screen
        name="index" // app/tabs/index.tsx
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name="home-outline" color={color} size={size} focused={focused} withBadge />
          ),
        }}
      />

      {/* 오른쪽 맵 */}
      <Tabs.Screen
        name="map" // app/tabs/map.tsx
        options={{
          title: "Map",
          tabBarLabel: "Map",
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name="map-outline" color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
