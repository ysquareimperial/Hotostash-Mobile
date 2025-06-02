import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { grey2 } from "./colors";

export default function BottomDrawer({
  sheetRef,
  snapPoints,
  enablePanDownToClose,
  handleSheetChange,
  cancelText,
  handleClosePress,
  loading,
  handleSubmit,
  saveText,
  bottomSheetTitle,
  children,
}) {
  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={enablePanDownToClose}
      onChange={handleSheetChange}
      handleIndicatorStyle={{
        backgroundColor: "white",
      }}
      backgroundStyle={{ backgroundColor: grey2 }}
    >
      <View style={{ flex: 1, backgroundColor: grey2 }}>
        <BottomSheetView className="px-4">
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Left-aligned text */}
            <Text
              onPress={handleClosePress}
              style={{
                color: "white",
                fontWeight: "bold",
                // fontSize: 18
              }}
            >
              {cancelText}
            </Text>

            {/* Spacer to center the second text */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: 4,
                  // fontSize: 18,
                }}
              >
                {bottomSheetTitle}
              </Text>
            </View>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                onPress={handleSubmit}
                style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
              >
                {saveText}
              </Text>
            )}
          </View>
          <View>{children}</View>
        </BottomSheetView>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({});
