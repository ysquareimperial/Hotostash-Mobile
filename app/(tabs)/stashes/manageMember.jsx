import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React from "react";
import { grey1, grey2, grey3 } from "../../../components/colors";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TextInput } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function ManageMember({
  sheetRef,
  snapPoints,
  handleSheetChange,
  handleClosePress,
  handleSubmit,
  handleSubmit2,
  stashName,
  loading1,
  loading2,
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
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior={loading1 || loading2 ? "none" : "close"} // closes sheet when background is pressed
            />
          )}
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
                  {/* <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    Leave "{stashName}"?
                  </Text> */}
                </View>
                {/* <TouchableOpacity onPress={handleClosePress}>
                  <View
                    // onPress={() => handleSnapPress(0)}
                    style={{
                      backgroundColor: grey1,
                      padding: 5,
                      borderRadius: 50,
                    }}
                  >
                    <AntDesign name="close" size={20} color="white" />
                  </View>
                </TouchableOpacity> */}
              </View>

              <TouchableOpacity
                onPress={() => handleSubmit()}
                disabled={loading1}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <View
                  style={{
                    backgroundColor: grey1,
                    marginTop: 10,
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        //   marginTop: 10,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                            // marginTop: 4,
                          }}
                        >
                          Make stash admin
                        </Text>
                      </View>
                      {loading1 ? (
                        <ActivityIndicator size={30} color="white" />
                      ) : (
                        <View
                          // onPress={() => handleSnapPress(0)}
                          style={{
                            backgroundColor: grey1,
                            padding: 5,
                            borderRadius: 50,
                          }}
                        >
                          {/* <AntDesign name="delete" size={20} color={"white"} /> */}
                          <MaterialIcons
                            name="admin-panel-settings"
                            size={20}
                            color={"white"}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {/* R E M O V E  F R O M  S T A S H */}
              <TouchableOpacity
                onPress={() => handleSubmit2()}
                disabled={loading2}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <View
                  style={{
                    backgroundColor: grey1,
                    marginTop: 10,
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        //   marginTop: 10,
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
                          Remove from stash
                        </Text>
                      </View>
                      {loading2 ? (
                        <ActivityIndicator size={30} color="#DC3545" />
                      ) : (
                        <View
                          // onPress={() => handleSnapPress(0)}
                          style={{
                            backgroundColor: grey1,
                            padding: 5,
                            borderRadius: 50,
                          }}
                        >
                          <AntDesign
                            name="delete"
                            size={20}
                            color={"#DC3545"}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <Text style={{ color: "#DC3545", marginTop: 10 }}>{error}</Text>
            </BottomSheetView>
          </View>
        </BottomSheet>
      )}
    </>
  );
}
