import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/config/firebase";

type ContestCategory = "전체" | "신입/인턴" | "대외활동" | "기획/아이디어";

type Contest = {
  id: string;
  title: string;
  category: ContestCategory;
};

export default function ContentScreen() {
  const [activeTab, setActiveTab] = useState<ContestCategory>("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchContests = async () => {
        try {
          setIsLoading(true);
          const snapshot = await getDocs(collection(db, "contests"));
          if (!isActive) return;

          const items: Contest[] = snapshot.docs.map((doc) => {
            const data = doc.data() as { title?: string; category?: string };
            const category =
              (data.category as ContestCategory | undefined) ?? "신입/인턴";
            return {
              id: doc.id,
              title: data.title ?? "",
              category,
            };
          });
          setContests(items);
        } catch (error) {
          console.error("Failed to load contests from Firestore", error);
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      fetchContests();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const filteredContests = useMemo(() => {
    return contests.filter((contest) => {
      const matchesTab =
        activeTab === "전체"
          ? contest.category === "신입/인턴" || contest.category === "대외활동"
          : contest.category === activeTab;
      const matchesSearch = contest.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, contests]);

  const renderItem = ({ item }: { item: Contest }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/content/contentview" as never,
          params: { id: item.id } as never,
        })
      }
    >
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.cardCategory}>{item.category}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "공고" }} />

      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>공고</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.writeButton}
              onPress={() =>
                router.push({
                  pathname: "/content/new",
                })
              }
            >
              <Text style={styles.writeButtonText}>글쓰기</Text>
            </TouchableOpacity>
            <Ionicons name="search" size={20} color="#4B5563" />
          </View>
        </View>

        {/* Search Input */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="공모전, 인턴, 대외활동 검색"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {(["전체", "신입/인턴", "대외활동"] as ContestCategory[]).map(
            (tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabButton, isActive && styles.tabButtonActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabButtonText,
                      isActive && styles.tabButtonTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentWrapper}>
        <Text style={styles.sectionTitle}>
          {activeTab === "전체" ? "전체 공고" : activeTab}
        </Text>

        {isLoading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="small" color="#111827" />
          </View>
        ) : (
          <FlatList
            data={filteredContests}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>해당 조건의 공고가 없습니다.</Text>
            }
          />
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  writeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
  writeButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
  tabRow: {
    flexDirection: "row",
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#4F46E5",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabButtonTextActive: {
    color: "#4F46E5",
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  cardCategory: {
    fontSize: 12,
    color: "#6B7280",
  },
  loadingWrapper: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    paddingVertical: 24,
    textAlign: "center",
    fontSize: 14,
    color: "#9CA3AF",
  },
});


