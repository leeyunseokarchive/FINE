import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { QUIZ_LIST } from "../../src/data/quiz";
import { useGameState } from "../../src/stores/gameState";

export default function QuizDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const quiz = useMemo(
    () => QUIZ_LIST.find((item) => item.id === params.id),
    [params.id]
  );
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { addMoney } = useGameState();

  if (!quiz) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>문제를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const options = [
    { key: 1, label: quiz.number_one },
    { key: 2, label: quiz.number_two },
    { key: 3, label: quiz.number_three },
    { key: 4, label: quiz.number_four },
  ];

  const handleChoice = (choice: number) => {
    if (isAnswered) {
      return;
    }
    setSelectedOption(choice);
    setIsAnswered(true);

    if (choice === quiz.answer) {
      addMoney(10);
      Alert.alert("정답!", "정답을 맞혀서 10코인을 획득했어요.");
    } else {
      Alert.alert("오답", "다시 한 번 내용을 복습해 볼까요?");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: quiz.title }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.preview}>{quiz.preview}</Text>
          <Text style={styles.contentText}>{quiz.content}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.question}>{quiz.question}</Text>
          {options.map((option) => {
            const isSelected = selectedOption === option.key;
            const isCorrect = quiz.answer === option.key;
            const showState = isAnswered && (isSelected || isCorrect);

            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.choiceButton,
                  isSelected && styles.choiceButtonSelected,
                  showState && isCorrect && styles.choiceButtonCorrect,
                  showState && isSelected && !isCorrect && styles.choiceButtonWrong,
                ]}
                activeOpacity={0.8}
                onPress={() => handleChoice(option.key)}
                disabled={isAnswered}
              >
                <Text
                  style={[
                    styles.choiceText,
                    (isSelected || showState) && styles.choiceTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  preview: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  contentText: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 22,
  },
  question: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  choiceButton: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  choiceButtonSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#DBEAFE",
  },
  choiceButtonCorrect: {
    borderColor: "#10B981",
    backgroundColor: "#D1FAE5",
  },
  choiceButtonWrong: {
    borderColor: "#EF4444",
    backgroundColor: "#FEE2E2",
  },
  choiceText: {
    fontSize: 15,
    color: "#1F2937",
  },
  choiceTextSelected: {
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
  },
});

