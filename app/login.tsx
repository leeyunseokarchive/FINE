import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../src/config/firebase";

// WebBrowser 완료 후 인증 세션 정리
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "153902197035-fa2bukhhigeu3sq158fjjd6l57qsbogf.apps.googleusercontent.com",
    androidClientId: "153902197035-k213b9lpu95nk395nt4224al051abdni.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID", // iOS용 (선택사항)
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      if (id_token) {
        handleGoogleSignIn(id_token);
      } else {
        console.error("No id_token in response", response);
        Alert.alert("로그인 오류", "인증 토큰을 받지 못했습니다.");
        setLoading(false);
      }
    } else if (response?.type === "error") {
      console.error("Google auth error", response.error);
      Alert.alert(
        "로그인 오류",
        response.error?.message || "구글 로그인에 실패했습니다."
      );
      setLoading(false);
    } else if (response?.type === "cancel") {
      console.log("User cancelled login");
      setLoading(false);
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken: string) => {
    try {
      setLoading(true);
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
      
      // 로그인 성공 후 tabs로 이동
      router.replace("/tabs");
    } catch (error: any) {
      console.error("Google sign in error", error);
      Alert.alert("로그인 오류", error.message || "구글 로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await promptAsync();
      if (!result) {
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Google login prompt error", error);
      Alert.alert(
        "오류",
        error?.message || "구글 로그인을 시작할 수 없습니다."
      );
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.content}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>FINE</Text>
          </View>
          <Text style={styles.title}>FINE에 오신 것을 환영합니다</Text>
          <Text style={styles.subtitle}>
            금융 지식을 쌓고 커뮤니티와 함께 성장하세요
          </Text>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={handleGoogleLogin}
            disabled={loading || !request}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color="#FFFFFF" />
                <Text style={styles.googleButtonText}>구글로 계속하기</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  buttonSection: {
    gap: 12,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#4285F4",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

