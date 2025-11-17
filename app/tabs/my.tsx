import { Stack, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../../src/config/firebase";

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  count: number | null;
  page?: string;
};

export default function MyScreen() {
  const [user, setUser] = useState<{
    displayName?: string | null;
    email?: string | null;
  } | null>(null);
  const [myPostsCount, setMyPostsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [savedContestsCount, setSavedContestsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUser({
            displayName: currentUser.displayName,
            email: currentUser.email,
          });

          // 내 게시글 수 계산
          const postsQuery = query(
            collection(db, "communityPosts"),
            where("author", "==", currentUser.email || "")
          );
          const postsSnapshot = await getDocs(postsQuery);
          setMyPostsCount(postsSnapshot.size);

          // 댓글 수 계산 (모든 게시글의 comments 배열에서 현재 사용자 댓글 찾기)
          const allPostsSnapshot = await getDocs(collection(db, "communityPosts"));
          let totalComments = 0;
          allPostsSnapshot.forEach((doc) => {
            const data = doc.data();
            if (Array.isArray(data.comments)) {
              const userComments = data.comments.filter(
                (comment: { author?: string }) =>
                  comment.author === currentUser.email
              );
              totalComments += userComments.length;
            }
          });
          setCommentsCount(totalComments);

          // 저장한 공고 수 (일단 0으로 설정, 나중에 savedContests 컬렉션 추가 가능)
          setSavedContestsCount(0);
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const menuItems: MenuItem[] = [
    {
      icon: "document-text-outline",
      label: "내 게시글",
      count: myPostsCount,
      page: "MyPosts",
    },
    {
      icon: "notifications-outline",
      label: "알림 설정",
      count: null,
      page: "NotificationSettings",
    },
    {
      icon: "help-circle-outline",
      label: "도움말",
      count: null,
      page: "Help",
    },
    {
      icon: "settings-outline",
      label: "설정",
      count: null,
      page: "Settings",
    },
  ];

  const handleLogout = async () => {
    Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            router.replace("/");
          } catch (error) {
            console.error("Logout error", error);
            Alert.alert("오류", "로그아웃에 실패했습니다.");
          }
        },
      },
    ]);
  };

  const handleMenuPress = (item: MenuItem) => {
    if (item.page) {
      // 나중에 페이지 라우팅 추가 가능
      Alert.alert("준비 중", `${item.label} 기능은 준비 중입니다.`);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "마이" }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#111827" />
        </View>
      </View>
    );
  }

  const userInitial = user?.displayName?.[0] || user?.email?.[0] || "U";

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "마이" }} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitial.toUpperCase()}</Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>
                  {user?.displayName || "사용자"}
                </Text>
                {/* 대학 배지 (나중에 사용자 데이터에 추가 가능) */}
              </View>
              <Text style={styles.email}>{user?.email || ""}</Text>
            </View>
          </View>

          {/* 학생 인증 버튼 (나중에 구현) */}
          <TouchableOpacity style={styles.verifyButton}>
            <Text style={styles.verifyButtonText}>학생 인증하기</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{myPostsCount}</Text>
            <Text style={styles.statLabel}>작성 글</Text>
          </View>
          <View style={[styles.statItem, styles.statItemBorder]}>
            <Text style={styles.statNumber}>{commentsCount}</Text>
            <Text style={styles.statLabel}>댓글</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{savedContestsCount}</Text>
            <Text style={styles.statLabel}>저장한 공고</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={20} color="#4B5563" />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.count !== null && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.count}</Text>
                  </View>
                )}
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color="#9CA3AF"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.logoutCard}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>로그아웃</Text>
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  settingsButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    marginBottom: 8,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginRight: 8,
  },
  email: {
    fontSize: 14,
    color: "#6B7280",
  },
  verifyButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statItemBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#E5E7EB",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#111827",
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  logoutCard: {
    backgroundColor: "#FFFFFF",
    marginTop: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
});
