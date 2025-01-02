import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { grey1, grey2, grey3 } from "./colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";

export default function CustomBottomSheet({
  sheetRef,
  snapPoints,
  handleSheetChange,
  handleClosePress,
  handleSubmit,
  form,
  handleChangeTitle,
  handleChangeDescription,
  loading,
  isOpen,
}) {
  return (
    <>
      {isOpen && (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={!loading ? true : false}
          onChange={handleSheetChange}
        >
          <View style={{ flex: 1, backgroundColor: grey2 }}>
            <BottomSheetView className="px-4">
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Left-aligned text */}
                <Text
                  onPress={handleClosePress}
                  style={{ color: "white", fontWeight: "bold" }}
                >
                  Cancel
                </Text>

                {/* Spacer to center the second text */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    Create stash
                  </Text>
                </View>
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading || !form.title}
                  >
                    <Text
                      style={{
                        color: !form.title ? grey1 : "white",
                        fontWeight: "bold",
                      }}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {/* <FormField2 /> */}

              <View style={{ marginTop: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderColor: grey1,
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: grey3 }}>
                    Stash title
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: "transparent",
                      width: "80%",
                      padding: 14,
                      borderRadius: 5,
                      color: "white",
                    }}
                    maxLength={50}
                    value={form.title}
                    onChangeText={handleChangeTitle}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderColor: grey1,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: grey3 }}>
                    Stash description
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: "transparent",
                      padding: 14,
                      // border: "none",
                      borderRadius: 5,
                      width: "80%",
                      color: "white",
                    }}
                    multiline
                    placeholder="(Optional)"
                    maxLength={200}
                    value={form.description}
                    onChangeText={handleChangeDescription}
                  />
                </View>
              </View>
            </BottomSheetView>
          </View>
        </BottomSheet>
      )}
    </>
  );
}
