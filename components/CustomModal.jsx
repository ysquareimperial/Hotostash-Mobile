import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { grey2 } from "./colors";
import CustomButton from "./CustomButton";
import CustomButton2 from "./CustomButton2";
import CustomButton3 from "./CustomButton3";

const CustomModal = ({
  modalText,
  modalExtraText,
  modalTitle,
  cancelText,
  okText,
  handleCancelPress,
  handleOkPress,
  loading,
  onRequestClose,
  modalVisible, // Receive modalVisible as a prop
  setModalVisible, // Receive setModalVisible to update state in the parent
  children,
  ...props
}) => {
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible} // Use modalVisible prop here
        onRequestClose={onRequestClose}
        {...props}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalText}>{modalText}</Text>
            <Text style={styles.modalExtraText}>{modalExtraText}</Text>
            {children}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              {cancelText && (
                <CustomButton3
                  title={cancelText}
                  handlePress={handleCancelPress}
                />
              )}
              <CustomButton
                title={okText}
                isLoading={loading}
                handlePress={handleOkPress} // Close modal on OK button press
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable> */}
    </View>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
  },
  modalView: {
    margin: 250,
    width: "80%",
    backgroundColor: "black",
    borderRadius: 5, // Rounded corners (if you want to keep this)
    padding: 14, // Padding inside the modal for better spacing
    // alignItems: "center",
    borderWidth: 1, // Add border width
    borderColor: grey2, // Set border color (black in this case)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    color: "white",
    // textAlign: "center",
  },
  modalExtraText: {
    color: "white",
    marginTop: 10,
    // textAlign: "center",
  },
  modalTitle: {
    marginBottom: 10,
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    // textAlign: "center",
  },
});
