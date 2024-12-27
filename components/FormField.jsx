import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { grey1, grey3 } from "./colors";
import { Link } from "expo-router";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <View>
        <TextInput
          style={{
            backgroundColor: grey1,
            padding: 14,
            border: "none",
            borderRadius: 5,
            color: "white",
          }}
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          placeholderTextColor={grey3}
          secureTextEntry={
            (title === "Password" && !showPassword) ||
            (title === "Confirm Password" && !showPassword)
          }
        />
        <View>
          {(title === "Password" || title === "Confirm Password") && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text
                  style={{ color: "white", marginTop: 16, fontWeight: "bold" }}
                >
                  {showPassword ? "Hide password" : "Show password"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Link
                  href="/forgotPassword"
                  style={{ color: "white", marginTop: 16, fontWeight: "bold" }}
                >
                  Forgot password?
                </Link>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default FormField;
