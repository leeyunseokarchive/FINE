import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/config/firebase";

type ContestDetail = {
  title: string;
  content?: string;
  category?: string;
  createdAt?: string;
};

const formatDateTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}`;
};

export default function ContentViewScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<ContestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!params.id) return;
      try {
        setLoading(true);
        setError(null);
        const ref = doc(db, "contests", params.id as string);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setError("공고를 찾을 수 없습니다.");
          return;
        }
        const raw = snap.data() as ContestDetail;
        setData(raw);
      } catch (e) {
        console.error(e);
        setError("공고를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [params.id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color="#111827" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || "공고를 찾을 수 없습니다."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "공고" }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {data.category && (
            <Text style={styles.categoryBadge}>{data.category}</Text>
          )}
          <Text style={styles.title}>{data.title}</Text>
          {data.createdAt && (
            <Text style={styles.meta}>{formatDateTime(data.createdAt)}</Text>
          )}
          <Text style={styles.body}>{data.content || "내용이 없습니다."}</Text>
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
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  errorText: {
    fontSize: 15,
    color: "#DC2626",
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
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    color: "#4F46E5",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  meta: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  body: {
    fontSize: 15,
    color: "#1F2937",
    lineHeight: 22,
  },
});


