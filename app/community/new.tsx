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
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../src/config/firebase";

type CommunityCategory = "공지" | "자유" | "칼럼";

const CATEGORIES: CommunityCategory[] = ["공지", "자유", "칼럼"];

export default function NewCommunityPostScreen() {
  const [category, setCategory] = useState<CommunityCategory>("자유");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
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

      const docRef = await addDoc(collection(db, "communityPosts"), {
        category,
        title: title.trim(),
        author: author.trim() || "익명",
        content: content.trim(),
        createdAt: now,
        views: 0,
        likes: 0,
        comments: [],
      });

      Alert.alert("등록 완료", "게시글이 등록되었습니다.", [
        {
          text: "확인",
          onPress: () => {
            router.replace({
              pathname: "/community/[id]",
              params: { id: docRef.id },
            });
          },
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "게시글 등록에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "새 글 쓰기" }} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.label}>카테고리</Text>
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

          <Text style={styles.label}>작성자</Text>
          <TextInput
            style={styles.input}
            placeholder="닉네임 (미입력 시 익명)"
            value={author}
            onChangeText={setAuthor}
          />

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


