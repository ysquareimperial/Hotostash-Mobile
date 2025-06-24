import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { grey1, grey2, grey3 } from "./colors";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";
import ToggleSwitch from "./ToggleSwitch";
import CustomButton from "./CustomButton";

export default function DownloadAllPhotosBottomSheet({
  sheetRef,
  snapPoints,
  handleSheetChange,
  handleClosePress,
  handleSubmit,
  loading,
  isOpen,
  bottomSheetTitle,
}) {
  return (
    <>
      {isOpen && (
        <BottomSheet
          handleIndicatorStyle={{
            backgroundColor: "white",
          }}
          backgroundStyle={{ backgroundColor: grey2 }}
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={!loading ? true : false}
          onChange={handleSheetChange}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior={loading ? "none" : "close"} // closes sheet when background is pressed
            />
          )}
        >
          <View style={{ flex: 1, backgroundColor: grey2 }}>
            <BottomSheetView className="px-4">
              {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  onPress={() => {
                    Keyboard.dismiss();
                    handleClosePress();
                  }}
                  style={{ color: "white", fontWeight: "bold" }}
                >
                  Cancel
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    {bottomSheetTitle}
                  </Text>
                </View>
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                )}
              </View> */}
              <View>
                <Text style={{ color: "white", marginTop: 20 }}>
                  Build with AI Kano Build with AI Kano Build with AI Kano
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    marginTop: 10,
                    fontWeight: "bold",
                  }}
                >
                  Download all photos
                </Text>
                <Text style={{ color: "grey", marginTop: 20 }}>
                  Choose download size.
                </Text>
                <View
                  style={{
                    paddingBottom: 10,
                    marginTop: 10,
                    // alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: "white" }}>
                    High resolution
                  </Text>

                  <View style={{ marginTop: 5 }}>
                    <ToggleSwitch />
                  </View>
                </View>
                <View
                  style={{
                    // paddingBottom: 10,
                    marginTop: 5,
                    // alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: "white" }}>
                    Web size
                  </Text>

                  <View style={{ marginTop: 5 }}>
                    <ToggleSwitch />
                  </View>
                </View>

                <Text style={{ color: "grey", marginTop: 20 }}>
                  Photos will be downloaded as a ZIP file.
                </Text>
                <View>
                  <CustomButton title={"Start download"} />
                </View>
              </View>
            </BottomSheetView>
          </View>
        </BottomSheet>
      )}
    </>
  );
}
