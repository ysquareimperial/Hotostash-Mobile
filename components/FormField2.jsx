import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { grey1, grey3 } from "./colors";

const FormField2 = ({
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
                <Text style={{ color: "white", marginTop: 16 }}>
                  {showPassword ? "Hide password" : "Show password"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={{ color: "white", marginTop: 16 }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default FormField2;
