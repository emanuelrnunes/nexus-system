import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet } from "react-native";

export default function ButtonIcon({ icon, ...rest }) {
  return (
    <TouchableOpacity style={styles.button} {...rest}>
      <MaterialIcons
        name={icon}
        size={32}
        color="#FFFFFF"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",

    right: 20,
    bottom: 90,

    width: 60,
    height: 60,
    borderRadius: 30,

    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",

    elevation: 8,
    zIndex: 999,
  },
});