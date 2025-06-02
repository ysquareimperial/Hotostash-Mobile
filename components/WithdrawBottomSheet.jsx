import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { grey1, grey2, grey3 } from "./colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";
import CustomButton from "./CustomButton";

export default function WithdrawBottomSheet({
  sheetRef,
  snapPoints,
  handleSheetChange,
  handleClosePress,
  handleSubmit,
  formData = {},
  handleChangeAccountNumber,
  handleChangeAccountName,
  handleChangeAmount,
  handleChangeBankName,
  loading,
  isOpen,
  bottomSheetTitle,
  errors,
}) {
  const isButtonDisabled =
    !formData.account_name ||
    !formData.account_number ||
    !formData.amount ||
    !formData.bank_name;

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
          enablePanDownToClose={!loading}
          onChange={handleSheetChange}
        >
          <BottomSheetView style={{ flex: 1, backgroundColor: grey2 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
              <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
              >
                <ScrollView
                  contentContainerStyle={{ padding: 16 }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Withdraw funds
                  </Text>
                  <Text style={{ marginTop: 5, color: "grey" }}>
                    Initiate a withdrawal to transfer your contributions.
                  </Text>

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
                        Account number
                      </Text>
                      <TextInput
                        style={{
                          backgroundColor: "transparent",
                          width: "80%",
                          padding: 14,
                          borderRadius: 5,
                          color: "white",
                        }}
                        onSubmitEditing={Keyboard.dismiss}
                        maxLength={45}
                        value={formData.account_number}
                        onChangeText={handleChangeAccountNumber}
                      />
                    </View>
                    {errors.account_number && (
                      <Text style={{ color: "#DC3545", fontSize: 12 }}>
                        {errors.account_number}
                      </Text>
                    )}

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
                        Account Name
                      </Text>
                      <TextInput
                        style={{
                          backgroundColor: "transparent",
                          width: "80%",
                          padding: 14,
                          borderRadius: 5,
                          color: "white",
                        }}
                        onSubmitEditing={Keyboard.dismiss}
                        maxLength={45}
                        value={formData.account_name}
                        onChangeText={handleChangeAccountName}
                      />
                    </View>
                    {errors.account_name && (
                      <Text style={{ color: "#DC3545", fontSize: 12 }}>
                        {errors.account_name}
                      </Text>
                    )}

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
                        Bank Name
                      </Text>
                      <TextInput
                        style={{
                          backgroundColor: "transparent",
                          width: "80%",
                          padding: 14,
                          borderRadius: 5,
                          color: "white",
                        }}
                        onSubmitEditing={Keyboard.dismiss}
                        maxLength={45}
                        value={formData.bank_name}
                        onChangeText={handleChangeBankName}
                      />
                    </View>
                    {errors.bank_name && (
                      <Text style={{ color: "#DC3545", fontSize: 12 }}>
                        {errors.bank_name}
                      </Text>
                    )}

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
                        Amount
                      </Text>
                      <TextInput
                        style={{
                          backgroundColor: "transparent",
                          width: "80%",
                          padding: 14,
                          borderRadius: 5,
                          color: "white",
                        }}
                        onSubmitEditing={Keyboard.dismiss}
                        maxLength={45}
                        value={formData.amount}
                        onChangeText={handleChangeAmount}
                      />
                    </View>
                    {errors.amount && (
                      <Text style={{ color: "#DC3545", fontSize: 12 }}>
                        {errors.amount}
                      </Text>
                    )}

                    <View style={{ flexDirection: "row" }}>
                      <CustomButton
                        title={
                          loading ? (
                            <ActivityIndicator size="small" color="white" />
                          ) : (
                            "Send request"
                          )
                        }
                        handlePress={handleSubmit}
                        isLoading={loading || isButtonDisabled}
                      />
                    </View>
                  </View>
                </ScrollView>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </BottomSheetView>
        </BottomSheet>
      )}
    </>
  );
}
