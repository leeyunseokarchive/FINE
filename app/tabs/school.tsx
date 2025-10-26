import type { Href } from "expo-router";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// 학교 타입
type SchoolType = "초등학교" | "중학교" | "고등학교";
const SCHOOLS: SchoolType[] = ["초등학교", "중학교", "고등학교"];
const SCHOOL_PREFIX = "고양이";

export default function SchoolScreen() {
  const [schoolIndex, setSchoolIndex] = useState(0); // 0: 초등학교, 1: 중학교, 2: 고등학교
  
  const handlePrev = () => {
    setSchoolIndex((prev) => (prev > 0 ? prev - 1 : SCHOOLS.length - 1));
  };
  
  const handleNext = () => {
    setSchoolIndex((prev) => (prev < SCHOOLS.length - 1 ? prev + 1 : 0));
  };
  
  const handleSchoolPress = () => {
    // 학교 선택에 따라 경제 퀴즈 화면으로 이동 (난이도 파라미터 전달)
    const level = schoolIndex + 1; // 0→1, 1→2, 2→3
    router.push({ pathname: "/economy", params: { level: level.toString() } } as Href);
  };
  
  const currentSchool = SCHOOLS[schoolIndex];

  return (
    <View style={styles.container}>
      {/* 배경 이미지들을 세로로 이어붙이기 */}
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require("../../assets/images/school-1.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <ImageBackground
          source={require("../../assets/images/school-2.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <ImageBackground
          source={require("../../assets/images/school-3.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </View>
      
      {/* 상단 네비게이션 바 */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={handlePrev}>
          <Text style={styles.navButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.schoolNameButton} onPress={handleSchoolPress}>
          <Text style={styles.schoolName}>{SCHOOL_PREFIX} {currentSchool}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleNext}>
          <Text style={styles.navButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      
      {/* 콘텐츠 (이미지 위에 오버레이) */}
      <View style={styles.contentOverlay}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  // 배경 컨테이너 - 세 이미지를 세로로 쌓음, 상단 네비게이션 바를 제외
  backgroundContainer: {
    position: "absolute",
    top: 80, // 상단 네비게이션 바 높이만큼 아래로
    left: 0,
    right: 0,
    bottom: 68, // 하단 탭 바 높이만큼 위로
    zIndex: 0,
  },
  // 각 배경 이미지 - 남은 공간의 1/3씩 정확히 차지
  backgroundImage: {
    width: "100%",
    height: (SCREEN_HEIGHT - 80 - 68) / 3, // 상단 네비 + 하단 탭 바 제외한 높이를 3등분
  },
  // 상단 네비게이션 바
  navBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80, // 60에서 80으로 증가
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20, // 상단 패딩 추가로 중앙 정렬
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 4 },
    }),
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
  },
  schoolNameButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  schoolName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  // 콘텐츠 오버레이
  contentOverlay: {
    flex: 1,
    zIndex: 1,
    marginTop: 80, // 네비게이션 바 높이만큼 여백
  },
});

