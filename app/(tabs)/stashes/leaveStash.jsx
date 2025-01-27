import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React from "react";
import { grey1, grey2 } from "../../../components/colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function LeaveStash({
  sheetRef,
  snapPoints,
  handleSheetChange,
  handleClosePress,
  handleSubmit,
  stashName,
  loading,
  error,
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
                    Leave "{stashName}"?
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
              <Text
                style={{ color: "white", fontWeight: "bold", marginTop: 20 }}
              >
                Are you sure tou want to leave this stash?
              </Text>
              <Text style={{ color: "white", marginTop: 5 }}>
                Leaving this stash means you won't be able to access any events
                or pictures in the stash.
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: grey1,
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "#DC3545",
                      fontWeight: "bold",
                      textAlign: "center",
                      // marginTop: 4,
                    }}
                  >
                    Leave stash
                  </Text>
                </View>
                {loading ? (
                  <ActivityIndicator size={30} color="#DC3545" />
                ) : (
                  <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                    <View
                      style={{
                        backgroundColor: grey1,
                        padding: 5,
                        borderRadius: 50,
                      }}
                    >
                      <AntDesign name="logout" size={20} color={"#DC3545"} />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={{ color: "#DC3545", marginTop: 10 }}>{error}</Text>
            </BottomSheetView>
          </View>
        </BottomSheet>
      )}
    </>
  );
}
