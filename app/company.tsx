import { View, Text, StyleSheet } from "react-native";

export default function Company() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>회사소개</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold" },
});