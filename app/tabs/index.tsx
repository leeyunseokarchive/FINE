import type { Href } from "expo-router";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions, //이미지 표시
  Platform, //플랫폼(안드로이드, iOS)
  SafeAreaView, //노치/상단바 영역 피하기
  ScrollView, //스크롤 가능한 컨테이너
  StyleSheet, //스타일 생성
  Text, //텍스트
  TouchableOpacity, //터치 가능한 뷰
  View
} from "react-native";

const { height: SCREEN_H } = Dimensions.get("window"); //height = SCREEN_H
const HERO_H = Math.round(SCREEN_H * 0.55); //파란 영역

// 카드 컴포넌트
type QuizCardProps = { title: string; subtitle: string; route?: Href }; //제목,부제,이동경로
function QuizCard({ title, subtitle, route }: QuizCardProps) {
  const onPress = () => {
    if (route) {
      router.push(route); //route가 있으면 해당 경로로 이동
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{title}</Text> 
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

// 홈화면
export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#7DD3FC" }}>
      <ScrollView contentContainerStyle={{ minHeight: SCREEN_H }}>
        <View style={[styles.hero, { height: HERO_H }]}>
          <TouchableOpacity 
          activeOpacity={0.9} 
          style={styles.levelCard}
          onPress={()=>router.push("/profile" as Href)}>
            <Text style={styles.level}>LV.20 금융 대통령</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.progressText}>70%</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 하단 시트 + 학습하기 섹션 */}
        <View style={styles.sheet}>
          <Text style={styles.learnTitle}>학습하기</Text>
          <View style={styles.quizContainer}>
            <QuizCard
              title="경제의 정석"
              subtitle="경제·경영·회계 퀴즈"
              route={"/economy" as Href}
            />
            <QuizCard
              title="투자의 정석"
              subtitle="투자·금융 자산 퀴즈"
              route={"/invest" as Href}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: "#7DD3FC",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 18,
  },
  levelCard: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 6 },
    }),
  },
  level: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    width: "70%",
    height: "100%",
    backgroundColor: "#EF4444",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  sheet: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -22,
    paddingTop: 20,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -4 },
      },
      android: { elevation: 10 },
    }),
  },
  learnTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },
  quizContainer: {
    paddingBottom: 28,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 3 },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111827",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
});