import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

type CommunityComment = {
  id: string;
  author: string;
  content: string;
  createdAt?: string;
};

type CommunityPostDetail = {
  id: string;
  category: string;
  title: string;
  author: string;
  createdAt?: string;
  views: number;
  likes: number;
  content: string;
  comments: CommunityComment[];
};

const resolveApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  if (Platform.OS === "android") {
    return "http://10.0.2.2:4000";
  }
  return "http://localhost:4000";
};

const API_BASE_URL = resolveApiBaseUrl();

const formatDateTime = (value?: string) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}`;
};

const Avatar = ({ name }: { name: string }) => (
  <View style={styles.avatar}>
    <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
  </View>
);

export default function CommunityDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<CommunityPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/community/${params.id}`);
        if (!response.ok) {
          throw new Error("게시글을 불러오지 못했습니다.");
        }
        const data: CommunityPostDetail = await response.json();
        setPost(data);
      } catch (err) {
        console.error(err);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color="#111827" />
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || "게시글을 찾을 수 없습니다."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "커뮤니티" }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.postCard}>
          <Text style={styles.categoryBadge}>{post.category}</Text>
          <Text style={styles.detailTitle}>
            {post.title} <Text style={styles.commentCount}>[{post.comments.length}]</Text>
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {post.author} · {formatDateTime(post.createdAt)}
            </Text>
            <View style={styles.metaStats}>
              <Text style={styles.metaStat}>👁 {post.views}</Text>
              <Text style={styles.metaStat}>👍 {post.likes}</Text>
            </View>
          </View>

          <Text style={styles.postBody}>{post.content}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>추천 0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>스크랩</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>공유</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>신고</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.commentSection}>
          <Text style={styles.commentHeader}>댓글 {post.comments.length}</Text>
          {post.comments.map((comment) => (
            <View key={comment.id} style={styles.commentRow}>
              <Avatar name={comment.author} />
              <View style={styles.commentBody}>
                <View style={styles.commentMetaRow}>
                  <Text style={styles.commentAuthor}>{comment.author}</Text>
                  <Text style={styles.commentTime}>{formatDateTime(comment.createdAt)}</Text>
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
                <View style={styles.commentActionRow}>
                  <Text style={styles.commentAction}>추천 0</Text>
                  <Text style={styles.commentAction}>답글 작성</Text>
                  <Text style={styles.commentAction}>신고</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.commentInputCard}>
          <Text style={styles.commentInputLabel}>댓글 쓰기</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 남겨보세요."
            placeholderTextColor="#9CA3AF"
            editable={false}
          />
          <View style={styles.commentInputActions}>
            <TouchableOpacity style={styles.commentActionButton}>
              <Text style={styles.commentActionButtonText}>등록</Text>
            </TouchableOpacity>
          </View>
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
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 15,
    color: "#DC2626",
  },
  postCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    fontSize: 13,
    color: "#F97316",
    fontWeight: "700",
    marginBottom: 6,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  commentCount: {
    fontSize: 16,
    color: "#DC2626",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  metaText: {
    fontSize: 13,
    color: "#6B7280",
  },
  metaStats: {
    flexDirection: "row",
    gap: 12,
  },
  metaStat: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  postBody: {
    fontSize: 15,
    color: "#1F2937",
    lineHeight: 22,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  commentSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  commentHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  commentRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  commentBody: {
    flex: 1,
  },
  commentMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  commentTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  commentContent: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
    marginBottom: 6,
  },
  commentActionRow: {
    flexDirection: "row",
    gap: 12,
  },
  commentAction: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  commentInputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  commentInputLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    color: "#111827",
  },
  commentInputActions: {
    alignItems: "flex-end",
  },
  commentActionButton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  commentActionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
});

