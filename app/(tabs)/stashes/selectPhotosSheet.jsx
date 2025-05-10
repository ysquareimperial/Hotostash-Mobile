import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React from "react";
import { grey1, grey2, grey3 } from "../../../components/colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SelectPhotosSheet({
  sheetRef,
  snapPoints,
  handleSheetChange,
  handleClosePress,
  handleSubmit,
  stashName,
  loading,
  error,
  isOpen,
  selectPhotos,
  children,
}) {
  return (
    <>
      {isOpen && (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={!loading ? true : false}
          onChange={handleSheetChange}
          handleIndicatorStyle={{
            backgroundColor: "white",
          }}
          backgroundStyle={{ backgroundColor: grey2 }}
        >
          <View style={{ flex: 1, backgroundColor: grey2 }}>
            <BottomSheetView className="px-4">
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    Stash event photos
                  </Text>
                </View>
                <TouchableOpacity onPress={handleClosePress}>
                  <View
                    style={{
                      backgroundColor: grey1,
                      padding: 5,
                      borderRadius: 50,
                    }}
                  >
                    <AntDesign name="close" size={20} color="white" />
                  </View>
                </TouchableOpacity>
                {/* )} */}
              </View>
              <View style={{ width: "90%" }}>
                <Text style={{ color: "grey", marginTop: 5, fontSize: 12 }}>
                  Stashed photos are visible to all participants. Organizers can
                  also share them publicly.
                </Text>
              </View>
              <TouchableOpacity
                style={{ alignItems: "center", marginTop: 20 }}
                onPress={selectPhotos}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: grey1,
                    borderRadius: 50,
                    width: 50,
                    height: 50,
                  }}
                >
                  <Ionicons name="images-outline" size={24} color="white" />
                </View>
                <Text style={{ marginTop: 10, color: "white" }}>
                  Select photos
                </Text>
              </TouchableOpacity>
              {children}
              <Text style={{ color: "#DC3545", marginTop: 10 }}>{error}</Text>
            </BottomSheetView>
          </View>
        </BottomSheet>
      )}
    </>
  );
}
