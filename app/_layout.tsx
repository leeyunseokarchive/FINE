import { Stack } from "expo-router";
import AspectRatioView from '../components/AspectRatioView';

export default function RootLayout() {
  return (
    <AspectRatioView>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: "내 프로필", presentation: "modal" }} />
        <Stack.Screen name="company" options={{ title: "회사소개", presentation: "modal" }} />
        <Stack.Screen name="economy" options={{ headerShown: false }} />
        <Stack.Screen name="invest" options={{ headerShown: false }} />
        <Stack.Screen name="asset-config" options={{ headerShown: false }} />
        <Stack.Screen name="asset-add" options={{ headerShown: false }} />
      </Stack>
    </AspectRatioView>
  );
}