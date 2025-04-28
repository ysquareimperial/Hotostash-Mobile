import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React from "react";
import { grey1, grey2, grey3 } from "../../../components/colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TextInput } from "react-native-gesture-handler";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function ManageParticipant({
  sheetRef,
  snapPoints,
  handleSheetChange,
  handleClosePress,
  handleSubmit1,
  handleSubmit2,
  handleSubmit3,
  stashName,
  loading1,
  loading2,
  loading3,
  error,
  isOpen,
}) {
  return (
    <>
      {isOpen && (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={!(loading1 || loading2 || loading3)}
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
                onPress={() => handleSubmit1()}
                disabled={loading1}
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
                          Make event organizer
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

              <TouchableOpacity
                onPress={() => handleSubmit2()}
                disabled={loading2}
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
                          Make photo uploader
                        </Text>
                      </View>
                      {loading2 ? (
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
                          <MaterialCommunityIcons
                            name="file-image-plus-outline"
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
                onPress={() => handleSubmit3()}
                disabled={loading3}
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
                          Remove
                        </Text>
                      </View>
                      {loading3 ? (
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
