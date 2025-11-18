import { router, useNavigation } from "expo-router";
import React, { useState, useLayoutEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "../src/config/firebase";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"phone" | "code">("phone");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const formatPhoneNumber = (text: string) => {
    // 숫자만 추출
    const numbers = text.replace(/[^\d]/g, "");
    // 한국 전화번호 형식으로 포맷팅 (010-1234-5678)
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleSendCode = async () => {
    if (!phoneNumber || phoneNumber.replace(/[^\d]/g, "").length < 10) {
      Alert.alert("오류", "올바른 전화번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      // 숫자만 추출하고 국가 코드 추가 (한국: +82)
      const cleanPhone = phoneNumber.replace(/[^\d]/g, "");
      const formattedPhone = cleanPhone.startsWith("0")
        ? `+82${cleanPhone.slice(1)}`
        : `+82${cleanPhone}`;

      console.log("Sending SMS to:", formattedPhone);
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone);
      setConfirmationResult(confirmation);
      setStep("code");
      Alert.alert("성공", "인증 코드가 전송되었습니다.");
    } catch (error: any) {
      console.error("Phone auth error:", error);
      let errorMessage = "인증 코드 전송에 실패했습니다.";
      
      if (error.code === "auth/invalid-phone-number") {
        errorMessage = "올바른 전화번호 형식이 아닙니다.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "너무 많은 요청이 있었습니다. 나중에 다시 시도해주세요.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("오류", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert("오류", "6자리 인증 코드를 입력해주세요.");
      return;
    }

    if (!confirmationResult) {
      Alert.alert("오류", "인증 세션이 만료되었습니다. 다시 시도해주세요.");
      setStep("phone");
      return;
    }

    try {
      setLoading(true);
      await confirmationResult.confirm(verificationCode);
      
      // 로그인 성공 후 tabs로 이동
      Alert.alert("성공", "로그인되었습니다.");
      router.replace("/tabs");
    } catch (error: any) {
      console.error("Code verification error:", error);
      let errorMessage = "인증 코드가 올바르지 않습니다.";
      
      if (error.code === "auth/invalid-verification-code") {
        errorMessage = "인증 코드가 올바르지 않습니다.";
      } else if (error.code === "auth/code-expired") {
        errorMessage = "인증 코드가 만료되었습니다. 다시 요청해주세요.";
        setStep("phone");
        setConfirmationResult(null);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("오류", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setVerificationCode("");
    setConfirmationResult(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
          {step === "phone" ? (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="전화번호 (010-1234-5678)"
                  placeholderTextColor="#9CA3AF"
                  value={phoneNumber}
                  onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
                  keyboardType="phone-pad"
                  autoFocus
                  editable={!loading}
                />
              </View>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendCode}
                disabled={loading || !phoneNumber}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>인증 코드 전송</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToPhone}
                disabled={loading}
              >
                <Ionicons name="arrow-back" size={20} color="#111827" />
                <Text style={styles.backButtonText}>전화번호 변경</Text>
              </TouchableOpacity>
              
              <Text style={styles.codeLabel}>
                {phoneNumber}로 전송된{"\n"}6자리 인증 코드를 입력해주세요
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="인증 코드 6자리"
                  placeholderTextColor="#9CA3AF"
                  value={verificationCode}
                  onChangeText={(text) => setVerificationCode(text.replace(/[^\d]/g, "").slice(0, 6))}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                  editable={!loading}
                />
              </View>
              <TouchableOpacity
                style={[styles.button, (loading || verificationCode.length !== 6) && styles.buttonDisabled]}
                onPress={handleVerifyCode}
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>인증 완료</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    minHeight: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 14,
  },
  button: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginLeft: 4,
  },
  codeLabel: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 20,
  },
});
