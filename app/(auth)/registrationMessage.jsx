import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/Hotostash PNG/77.png";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { Link, router } from "expo-router";
import { orange } from "../../components/colors";
import google from "../../assets/google.png";
import CustomButton2 from "../../components/CustomButton2";
import OrSeparator from "../../components/OrSeparator";
import CustomButton3 from "../../components/CustomButton3";

const registrationMessage = () => {
  return (
    <SafeAreaView style={{ backgroundColor: "#000000" }} className="h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <View className="items-center">
            <Image
              source={logo}
              className="w-[130px] h-[84px]"
              resizeMode="contain"
            />

            <Text
              style={{
                color: "white",
                fontSize: 24,
                marginBottom: 8,
                fontWeight: "bold",
              }}
            >
              Verify your email
            </Text>

            <Text style={{ color: "white", textAlign: "center" }}>
              Registration successful! Check your email{" "}
              <Text style={{ fontWeight: "bold", color: orange }}>
                {" "}
                inbox or spam
              </Text>{" "}
              for a confirmation link, the link will be valid for only 1 hour
              Welcome to Hotostash!
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <CustomButton3
                title={"Resend Link"}
                handlePress={() => router.replace("/resendMail")}
              />
              <CustomButton
                title={"Login"}
                handlePress={() => router.replace("/login")}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default registrationMessage;
