import { StyleSheet, Text, Pressable } from "react-native";

const Button = ({ text, onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 50,
    elevation: 3,
    backgroundColor: "#1F4259",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});

export default Button;