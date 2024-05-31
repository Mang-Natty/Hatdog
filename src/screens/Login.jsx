import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ImageBackground,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Input from "../components/Input";
import Button from "../components/Button";

const bgImage = require("../../assets/images/background/bg_blue.png");

export default function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [show, setShow] = useState();
  const [errors, setErrors] = useState();
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      const storedUser = userData ? JSON.parse(userData) : null;

      if (
        storedUser &&
        storedUser.username === values.username &&
        storedUser.password === values.password
      ) {
        navigation.navigate("Home");
      } else {
        setErrors({ ...errors, general: "Invalid username or password" });
      }
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  // Only use for when adding user
  const register = async () => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(values));
      console.log("user successfully created:", values);
    } catch (err) {
      console.error("Failed to save user data:", err);
    }
  };

  const fetchUsersData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData !== null) {
        console.log("All users data:", userData);
      } else {
        console.log("No data available");
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  const onChange = (text, field) => {
    setValues((prevVal) => ({ ...prevVal, [field]: text }));
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={bgImage}
          resizeMode="cover"
          style={styles.bgImage}
        >
          <SafeAreaView style={styles.container}>
            <Image
              source={require("../../assets/images/logo/main_logo.png")}
              style={styles.image}
            />
            <Input
              name="username"
              placeholder={"Enter Username"}
              outlined={true}
              leftIcon={
                <FontAwesome6 name="user" color={"#1F4259"} size={16} solid />
              }
              onChangeHandler={(text) => onChange(text, "username")}
              validate={() => {
                if (!values?.username) {
                  setErrors({
                    ...errors,
                    username: "Please enter your username",
                  });
                }
              }}
              errorMessage={errors?.username}
            />
            <Input
              name="password"
              placeholder={"Enter Password"}
              outlined={true}
              leftIcon={
                <FontAwesome6 name="lock" color={"#1F4259"} size={16} solid />
              }
              rightIcon={
                <Pressable
                  onPress={() =>
                    setShow({ ...show, password: !show?.password })
                  }
                >
                  {!show?.password ? (
                    <FontAwesome6
                      name="eye-slash"
                      color={"#1F4259"}
                      size={16}
                      solid
                    />
                  ) : (
                    <FontAwesome6
                      name="eye"
                      color={"#1F4259"}
                      size={16}
                      solid
                    />
                  )}
                </Pressable>
              }
              secure={!show?.password}
              onChangeHandler={(text) => onChange(text, "password")}
              validate={() => {
                if (!values?.password) {
                  setErrors({
                    ...errors,
                    password: "Please enter your password",
                  });
                }
              }}
              errorMessage={errors?.password}
            />
            <Button text={"CONFIRM"} onPress={handleLogin} />
          </SafeAreaView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    objectFit: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "60%",
    height: "auto",
    backgroundColor: "#ffffff",
    alignItems: "center",
    borderRadius: 25,
    padding: 12,
  },
  image: {
    height: 250,
    resizeMode: "contain",
  },
});