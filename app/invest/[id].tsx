import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ListItem, QUIZ_LIST } from "../../src/data/quiz";

const { height: SCREEN_H } = Dimensions.get("window");
const TOP_H = Math.round(SCREEN_H * 0.52);
const BOTTOM_H = SCREEN_H - TOP_H;

export default function QuizMiddleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const quiz: ListItem | undefined = useMemo(
    () => QUIZ_LIST.find((q) => q.id === String(id)),
    [id]
  );

  const [picked, setPicked] = useState<number | null>(null);

  if (!quiz) {
    return (
      <View style={styles.center}>
        <Text>문제를 찾을 수 없어요.</Text>
      </View>
    );
  }

  const options = [
    { idx: 1, text: quiz.number_one },
    { idx: 2, text: quiz.number_two },
    { idx: 3, text: quiz.number_three },
    { idx: 4, text: quiz.number_four },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: quiz.title,
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 18, fontWeight: "700" },
        }}
      />

      {/* 위(6) : content */}
      <View style={[styles.top, { height: TOP_H }]}>
        <View style={styles.contentCard}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 12 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.contentText}>{quiz.content}</Text>
          </ScrollView>
        </View>
      </View>

      {/* 아래(4) : question + 보기 4개 */}
      <View style={[styles.bottom, { height: BOTTOM_H }]}>
        <Text style={styles.questionText}>{quiz.question}</Text>

        {options.map((opt) => {
          const isPicked = picked === opt.idx;
          const isCorrectPick = isPicked && picked === quiz.answer;
          const isWrongPick = isPicked && picked !== quiz.answer;

          return (
            <TouchableOpacity
              key={opt.idx}
              activeOpacity={0.9}
              onPress={() => setPicked(opt.idx)}
              style={[
                styles.choiceBtn,
                isCorrectPick && styles.choiceBtnCorrect,
                isWrongPick && styles.choiceBtnWrong,
              ]}
            >
              <Text
                style={[
                  styles.choiceText,
                  (isCorrectPick || isWrongPick) && styles.choiceTextOnColored,
                ]}
              >
                {opt.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F3F4F6" },

    top: { paddingHorizontal: 16, paddingTop: 12 },
    bottom: { paddingHorizontal: 16, paddingTop: 12 },

    contentCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 16,
        ...Platform.select({
            ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
            android: { elevation: 5 },
        }),
    },
    contentTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8, color: "#111827" },
    contentText: { fontSize: 15, lineHeight: 22, color: "#374151" },

    questionText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 10,
    },
    choiceBtn: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        ...Platform.select({
            ios: { shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
            android: { elevation: 2 },
        }),
    },
    choiceBtnCorrect: { backgroundColor: "#22c55e", borderColor: "#16a34a" },
    choiceBtnWrong: { backgroundColor: "#ef4444", borderColor: "#dc2626" },
    choiceText: { fontSize: 15, color: "#111827" },
    choiceTextOnColored: { color: "#fff", fontWeight: "700" },

    center: { flex: 1, alignItems: "center", justifyContent: "center" },
});