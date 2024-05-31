import { useEffect, useState } from "react";
import { View, Animated } from "react-native";

const ExpandableView = ({ expanded = false, children }) => {
  const [width] = useState(new Animated.Value(expanded ? 150 : 250));

  useEffect(() => {
    Animated.timing(width, {
      toValue: !expanded ? 150 : 250,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [expanded, width]);

  return (
    <Animated.View style={{ width }}>
      <View style={{ padding: 16, alignItems: "center" }}>{children}</View>
    </Animated.View>
  );
};

export default ExpandableView;