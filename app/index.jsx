import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/Hotostash PNG/77.png";
import sc from "../assets/sc.png";
import CustomButton from "../components/CustomButton";
import { Redirect, router } from "expo-router";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";
export default function App() {
  const { user } = useUser();

  if (user && user?.id) {
    // Redirect to /stashes if a user is logged in
    return <Redirect href="/stashes/stashes" />;
  }
  
  

  return (
    <SafeAreaView className="h-full" style={{ backgroundColor: "#000000" }}>
      {/* <ScrollView contentContainerStyle={{ height: "100%" }}> */} 
      <View
        className="w-full justify-center items-center px-4"
        style={{ height: "100%" }}
      >
        {/* <View className="w-full justify-center items-center min-h-[85vh] px-4"> */}
        <Image
          source={logo}
          className="w-[130px] h-[84px]"
          resizeMode="contain"
        />
        <Image
          source={sc}
          className="w-[260px] h-[214px]"
          resizeMode="contain"
        />
        <View className="relative mt-5">
          <Text className="text-3xl text-white font-pbold text-center">
            Your treasure foreva!
          </Text>
        </View>
        <Text className="text-lg font-pregular text-gray-100 mt-2 text-center">
          Create events, invite friends and family, contribute funds, and stash
          event memories forever
        </Text>
        <CustomButton
          title="Join Hotostash today!"
          handlePress={() => router.push("/(auth)/login")}
          containerStyles="w-full mt-7"
        />
      </View>
      {/* </ScrollView> */}
      <StatusBar backgroundColor="#000000" style="light" />
    </SafeAreaView>
  );
}
