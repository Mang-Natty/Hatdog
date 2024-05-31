import { View, Text, TextInput, StyleSheet } from "react-native";

const Input = ({
  label,
  outlined,
  placeholder,
  leftIcon,
  rightIcon,
  onChangeHandler,
  numLines,
  secure,
  validate,
  errorMessage,
}) => {
  const containerBorder = outlined ? styles.outline : styles.underLine;

  return (
    <View style={{ padding: 2, width: "50%" }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.container, containerBorder]}>
        <View style={{ marginLeft: 4, paddingRight: 8 }}>{leftIcon}</View>
        <TextInput
          secureTextEntry={secure}
          placeholder={
            placeholder ? placeholder : label ? `Enter ${label}` : ""
          }
          onChangeText={onChangeHandler}
          onEndEditing={validate}
          style={{ flex: 4 }}
          multiline={numLines > 1 ? true : false}
          numberOfLines={numLines}
        />
        <View style={{ paddingLeft: 8 }}>{rightIcon}</View>
      </View>
      <Text style={{ color: "red" }}>{errorMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: "Inter_400Regular",
    fontSize: 14,
    color: "darkgrey",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E4E2",
  },
  outline: {
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 50,
  },
  underLine: {
    borderBottomWidth: 2,
    borderBottomColor: "#DA70D6",
  },
});

export default Input;