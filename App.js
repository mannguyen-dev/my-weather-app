import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View } from "react-native";
import HomeScreen from "./screens/HomeScreen";

export default function App() {
    return (
        <View className="flex-1 bg-white">
            <StatusBar style="auto" />
            <HomeScreen />
        </View>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//         alignItems: "center",
//         justifyContent: "center",
//     },
// });
