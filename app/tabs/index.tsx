import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useGameState } from "../../src/stores/gameState";

// 홈화면
export default function HomeScreen() {
  const { money, happy } = useGameState();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/main-1.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Top Left UI */}
        <View style={styles.topLeftContainer}>
          {/* Heart and progress bar */}
          <View style={styles.card}>
            <Text style={styles.heartIcon}>♥</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${happy}%` }]} />
            </View>
            <Text style={styles.progressText}>{happy}/100</Text>
          </View>
          
          {/* Currency - money 값 표시 */}
          <View style={styles.card}>
            <Text style={styles.currencyText}>{money.toLocaleString()}</Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  // Top Left UI
  topLeftContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    gap: 12,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 12,
    minWidth: 120,
  },
  heartIcon: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#EC4899",
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  currencyText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
});