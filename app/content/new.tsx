import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../src/config/firebase";

type ContestCategory = "신입/인턴" | "대외활동";

const CATEGORIES: ContestCategory[] = ["신입/인턴", "대외활동"];

export default function NewContestScreen() {
  const [category, setCategory] = useState<ContestCategory>("신입/인턴");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("제목 입력", "제목을 입력해 주세요.");
      return;
    }
    if (!content.trim()) {
      Alert.alert("내용 입력", "내용을 입력해 주세요.");
      return;
    }

    try {
      setSubmitting(true);
      const now = new Date().toISOString();

      await addDoc(collection(db, "contests"), {
        title: title.trim(),
        content: content.trim(),
        category,
        createdAt: now,
      });

      Alert.alert("등록 완료", "공고가 등록되었습니다.", [
        {
          text: "확인",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "공고 등록에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "공고 작성" }} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.label}>구분</Text>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryChip,
                  category === item && styles.categoryChipActive,
                ]}
                onPress={() => setCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    category === item && styles.categoryChipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.input}
            placeholder="제목을 입력해 주세요."
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>내용</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="내용을 입력해 주세요."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? "등록 중..." : "등록"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
  },
  categoryRow: {
    flexDirection: "row",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryChipActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  categoryChipText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
  textarea: {
    minHeight: 140,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#111827",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});


