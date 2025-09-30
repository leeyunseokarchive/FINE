import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="tabs" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: "내 프로필", presentation: "modal" }} />
      <Stack.Screen name="company" options={{ title: "회사소개", presentation: "modal" }} />
      <Stack.Screen name="economy" options={{ headerShown: false }} />
      <Stack.Screen name="invest" options={{ headerShown: false }} />
    </Stack>
  );
}