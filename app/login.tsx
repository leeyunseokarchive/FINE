import { router, useNavigation } from "expo-router";
import React, { useState, useLayoutEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { auth } from "../src/config/firebase";

// WebBrowser 인증 완료 후 닫기
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleGuestLogin = () => {
    router.replace("/tabs");
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      // Google OAuth 설정
      // 참고: Firebase Console > Authentication > Sign-in method > Google에서
      // Web 클라이언트 ID를 가져와서 EXPO_PUBLIC_GOOGLE_CLIENT_ID 환경변수로 설정하세요
      const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
      
      if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID") {
        Alert.alert(
          "설정 필요",
          "Google OAuth 클라이언트 ID가 설정되지 않았습니다.\n\n" +
          "설정 방법:\n" +
          "1. Firebase Console > Authentication > Sign-in method > Google 이동\n" +
          "2. '웹 클라이언트 ID' 복사\n" +
          "3. 프로젝트 루트에 .env 파일 생성 후 다음 추가:\n" +
          "   EXPO_PUBLIC_GOOGLE_CLIENT_ID=복사한_클라이언트_ID\n" +
          "4. 앱 재시작"
        );
        setLoading(false);
        return;
      }

      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "fine",
      });

      const discovery = {
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenEndpoint: "https://oauth2.googleapis.com/token",
        revocationEndpoint: "https://oauth2.googleapis.com/revoke",
      };

      const request = new AuthSession.AuthRequest({
        clientId,
        scopes: ["openid", "profile", "email"],
        responseType: AuthSession.ResponseType.Code,
        redirectUri,
        extraParams: {},
      });

      const result = await request.promptAsync(discovery);

      if (result.type === "success" && result.params.code) {
        // Authorization code를 id_token으로 교환 (PKCE 사용)
        
        // PKCE 파라미터 (AuthRequest가 자동 생성)
        const codeVerifier = request.codeVerifier;
        
        const tokenParams: Record<string, string> = {
          client_id: clientId!,
          code: result.params.code,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        };
        
        // PKCE 사용 시 code_verifier 추가
        if (codeVerifier) {
          tokenParams.code_verifier = codeVerifier;
        }
        
        const tokenResponse = await fetch(discovery.tokenEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(tokenParams).toString(),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.id_token) {
          throw new Error(tokenData.error_description || "Google 인증 토큰을 받지 못했습니다.");
        }

        const idToken = tokenData.id_token;

        // Firebase에 Google 인증 정보 전달
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);

        // 로그인 성공 후 tabs로 이동
        Alert.alert("성공", "로그인되었습니다.");
        router.replace("/tabs");
      } else {
        if (result.type !== "dismiss") {
          Alert.alert("오류", "Google 로그인이 취소되었습니다.");
        }
      }
    } catch (error: any) {
      console.error("Google sign in error:", error);
      let errorMessage = "Google 로그인에 실패했습니다.";
      
      if (error.code === "auth/account-exists-with-different-credential") {
        errorMessage = "이 이메일은 다른 인증 방법으로 이미 등록되어 있습니다.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "인증 정보가 유효하지 않습니다.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("오류", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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

        <View style={styles.formSection}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Google로 로그인</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestLogin}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.guestButtonText}>로그인 없이 이용하기</Text>
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
  formSection: {
    gap: 16,
  },
  button: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    flexDirection: "row",
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  guestButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
});
