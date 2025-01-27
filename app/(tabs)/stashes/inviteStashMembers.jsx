import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React from "react";
import { grey1, grey2, grey3, orange } from "../../../components/colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function InviteStashMembers({
  sheetRef,
  snapPoints,
  handleSheetChange,
  handleClosePress,
  handleSubmit,
  stashName,
  loading,
  error,
  isOpen,
  enablePanDownToClose,
}) {
  return (
    <>
      {isOpen && (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={enablePanDownToClose}
          onChange={handleSheetChange}
        >
          <View style={{ flex: 1, backgroundColor: grey2 }}>
            <BottomSheetView className="px-4">
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Left-aligned text */}
                <Text
                  onPress={handleClosePress}
                  style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
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
                      fontSize: 18,
                    }}
                  >
                    Invite members
                  </Text>
                </View>
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text
                    onPress={handleSubmit}
                    style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                  >
                    Send
                  </Text>
                )}
              </View>

              <Text style={{ color: "white", marginTop: 20 }}>
                We'll email the invitation link to their registered email
                address. Ask them to check their{" "}
                <Text style={{ fontWeight: "bold", color: orange }}>
                  inbox or spam
                </Text>{" "}
                folder.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  borderTopWidth: 1,
                  borderColor: grey1,
                  alignItems: "center",
                  width: "100%",
                  marginTop: 20,
                }}
              >
                <Text style={{ fontWeight: "bold", color: grey3 }}>
                <AntDesign name="search1" size={24} color="grey" />
              
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
                  placeholder="Search by username or name"
                />
              </View>
              <Text style={{ color: "#DC3545", marginTop: 10 }}>{error}</Text>
            </BottomSheetView>
          </View>
        </BottomSheet>
      )}
    </>
  );
}
