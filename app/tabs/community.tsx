import { Stack, router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/config/firebase";

type CommunityCategory = "전체" | "공지" | "자유" | "칼럼";

type CommunityPost = {
  id: string;
  category: CommunityCategory | string;
  title: string;
  replies: number;
  author?: string;
  createdAt?: string;
};

export default function CommunityScreen() {
  const [selectedCategory, setSelectedCategory] =
    useState<CommunityCategory>("전체");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchPosts = async () => {
        try {
          setLoading(true);
          setError(null);
          const snapshot = await getDocs(collection(db, "communityPosts"));
          if (!isActive) return;

          const data: CommunityPost[] = snapshot.docs.map((doc) => {
            const raw = doc.data() as {
              category?: CommunityCategory | string;
              title?: string;
              author?: string;
              createdAt?: string;
              comments?: unknown[];
            };

            return {
              id: doc.id,
              category: raw.category ?? "자유",
              title: raw.title ?? "",
              replies: Array.isArray(raw.comments) ? raw.comments.length : 0,
              author: raw.author,
              createdAt: raw.createdAt,
            };
          });
          setPosts(data);
        } catch (err) {
          console.error(err);
          setError("커뮤니티 목록을 불러오는 중 오류가 발생했습니다.");
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchPosts();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "전체") {
      return posts;
    }
    return posts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory, posts]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "커뮤니티" }} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>커뮤니티</Text>
        <TouchableOpacity
          style={styles.writeButton}
          onPress={() =>
            router.push({
              pathname: "/community/new",
            })
          }
        >
          <Text style={styles.writeButtonText}>글쓰기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {(["전체", "공지", "자유", "칼럼"] as CommunityCategory[]).map(
          (category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.tabButton,
                selectedCategory === category && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  selectedCategory === category && styles.tabButtonTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "전체" ? "전체" : selectedCategory}
          </Text>
          {loading ? (
            <ActivityIndicator size="small" color="#111827" style={{ marginVertical: 20 }} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              {filteredPosts.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.postRow}
                  onPress={() =>
                    router.push({
                      pathname: "/community/[id]",
                      params: { id: post.id },
                    })
                  }
                >
                  <View style={styles.postTopRow}>
                    <Text style={styles.categoryTag}>{post.category}</Text>
                    <Text style={styles.postMeta}>[{post.replies}]</Text>
                  </View>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postSubMeta}>
                    {post.author || "익명"} · {formatRelativeDate(post.createdAt)}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const formatRelativeDate = (value?: string) => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  writeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
  writeButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#111827",
  },
  tabButtonText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  tabButtonTextActive: {
    color: "#111827",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  postRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  postTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  categoryTag: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F97316",
  },
  postTitle: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
    marginBottom: 4,
  },
  postMeta: {
    marginLeft: 8,
    fontSize: 13,
    color: "#DC2626",
    fontWeight: "600",
  },
  postSubMeta: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
    textAlign: "center",
    marginVertical: 20,
  },
});

