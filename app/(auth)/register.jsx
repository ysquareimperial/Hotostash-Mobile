import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Button,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { grey1, grey3, orange } from "../../components/colors";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { Link, router } from "expo-router";
import CustomNextButton from "../../components/CustomNextButton";
import logo from "../../assets/Hotostash_PNG/77.png";
import CustomPrevButton from "../../components/CustomPrevButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { api } from "../../helpers/helpers";
import axios from "axios";
import { isLoading } from "expo-font";
import CustomModal from "../../components/CustomModal";

const Register = () => {
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    image:
      "https://res.cloudinary.com/dkwy56ghj/image/upload/v1726035316/ow1ywob5b1bynpb1fqg2.png",
    firstname: "",
    lastname: "",
    phone: "",
    dob: new Date(2000, 0, 1),
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const validateFirstStep = () => {
    if (!form.firstname || !form.lastname) {
      alert("Please fill in all fields");
      return;
    }
    console.log(JSON.stringify(form)); // Log form data as string

    nextStep();
  };

  const validateDob = () => {
    if (!form.dob) {
      alert("Please select your date of birth");
      return;
    }
    console.log(JSON.stringify(form)); // Log form data as string

    nextStep();
  };

  const validatePhoneEmail = () => {
    if (!form.phone) {
      alert("Phone number is required");
    } else if (form.phone.length < 10 || form.phone.length > 15) {
      // Adjust length as needed
      alert("Phone number must be between 10 and 15 digits.");
    } else if (!/^[0-9]*$/.test(form.phone)) {
      alert("Phone number is invalid. Please use digits only.");
    } else if (!form.email) {
      alert("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      alert("Email is invalid");
    } else {
      console.log(JSON.stringify(form)); // Log form data as string
      nextStep();
    }
  };

  const validateFinalStep = () => {
    if (!form.username) alert("Username is required");
    else if (form.username.length < 3) {
      alert("Username must be at least 3 characters long");
    } else if (!form.password) {
      alert("Password is required");
    } else if (form.password.length < 8) {
      alert("Password must be at least 8 characters long");
    } else if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
    } else {
      const { confirmPassword, ...formData } = form; // Remove confirmPassword
      console.log(formData); // Log form data without confirmPassword
      handleSubmit(formData); // Pass the form data without confirmPassword
    }
  };

  const handleSubmit = (formData) => {
    console.log(formData);
    setLoading(true);
    axios
      .post(`${api}mobile/create_user/`, {
        ...formData, // Pass the form data excluding confirmPassword
        dob: form.dob.toISOString().split("T")[0], // Use form.dob instead of dobWithoutTime
      })
      .then((response) => {
        console.log(response.data);
        console.log(response.status);
        if (response?.status === 200) {
          router.push({
            pathname: "/registrationMessage",
            params: { email: formData.email },
          });
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        const errorMessage =
          e.response?.data?.detail || "An unknown error occurred";
        console.log(errorMessage);
        setError(errorMessage);
        setModalVisible2(true);
        console.log(e.response);
        // alert(errorMessage);
      });
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#000000" }} className="h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // style={styles.container}
      >
        <ScrollView>
          <View className="w-full justify-center min-h-[85vh] px-4 my-6">
            <View className="items-center" style={{ marginBottom: 20 }}>
              <Image
                source={logo}
                className="w-[130px] h-[84px]"
                resizeMode="contain"
              />
            </View>
            {step === 1 && (
              <View>
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    marginBottom: 8,
                    fontWeight: "bold",
                  }}
                >
                  Personal Information
                </Text>
                <Text style={{ color: "grey", fontSize: 12, marginBottom: 16 }}>
                  Provide your real name to make it easier for family and
                  friends to find you on Hotostash.
                </Text>
                <FormField
                  title="Firstname"
                  value={form.firstname}
                  placeholder="Firstname"
                  handleChangeText={(value) =>
                    setForm({ ...form, firstname: value })
                  }
                />
                <FormField
                  title="Lastname"
                  value={form.lastname}
                  placeholder="Lastname"
                  handleChangeText={(value) =>
                    setForm({ ...form, lastname: value })
                  }
                  otherStyles="mt-5"
                />
                <View style={{ alignItems: "flex-end" }}>
                  <CustomNextButton
                    handlePress={validateFirstStep}
                    isLoading={loading}
                  />
                </View>
              </View>
            )}

            {step === 2 && (
              <View>
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    marginBottom: 8,
                    fontWeight: "bold",
                  }}
                >
                  What's your Birthday?
                </Text>
                <Text style={{ color: "grey", fontSize: 12, marginBottom: 16 }}>
                  Let us know your birthday so friends can celebrate with you.
                </Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <DateTimePicker
                      value={form.dob}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          // Resetting the time to 00:00:00 UTC to only keep the date
                          const newDate = new Date(selectedDate);
                          newDate.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC
                          setForm({ ...form, dob: newDate }); // Set the state with the date-only object
                        }
                      }}
                      themeVariant="dark"
                      minimumDate={new Date(1950, 0, 1)}
                      maximumDate={new Date(2010, 11, 31)}
                    />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    //   marginTop: 16,
                  }}
                >
                  <CustomPrevButton title="Back" handlePress={prevStep} />
                  <View style={{ alignItems: "flex-end" }}>
                    <CustomNextButton
                      handlePress={validateDob}
                      isLoading={loading}
                    />
                  </View>
                </View>
              </View>
            )}
            {step === 3 && (
              <View>
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    marginBottom: 8,
                    fontWeight: "bold",
                  }}
                >
                  Contact Information
                </Text>
                <Text style={{ color: "grey", fontSize: 12, marginBottom: 16 }}>
                  Provide your contact details to stay connected with friends
                  and receive important updates.
                </Text>
                <FormField
                  title="Phone"
                  value={form.phone}
                  placeholder="Phone"
                  handleChangeText={(value) =>
                    setForm({ ...form, phone: value })
                  }
                />
                <FormField
                  title="Email"
                  value={form.email}
                  placeholder="Email"
                  handleChangeText={(value) =>
                    setForm({ ...form, email: value })
                  }
                  otherStyles="mt-5"
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    //   marginTop: 16,
                  }}
                >
                  <CustomPrevButton title="Back" handlePress={prevStep} />
                  <View style={{ alignItems: "flex-end" }}>
                    <CustomNextButton
                      handlePress={validatePhoneEmail}
                      isLoading={loading}
                    />
                  </View>
                </View>
              </View>
            )}
            {step === 4 && (
              <View>
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    marginBottom: 8,
                    fontWeight: "bold",
                  }}
                >
                  Account Information
                </Text>
                <Text style={{ color: "grey", fontSize: 12, marginBottom: 16 }}>
                  Create a unique username and secure password for your account.
                </Text>
                <FormField
                  title="Username"
                  value={form.username}
                  placeholder="Username"
                  handleChangeText={(value) => {
                    // Apply regex transformations
                    const cleanedValue = value
                      .replace(/\s+/g, "") // Remove all whitespaces
                      .replace(/[^a-zA-Z0-9_]/g, "") // Remove all non-alphanumeric characters except underscores
                      .replace(
                        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FAFF}]/gu,
                        "" // Remove emojis
                      );

                    // Update state with the cleaned value
                    setForm({ ...form, username: cleanedValue });
                  }}
                />

                <View>
                  <TextInput
                    style={{
                      backgroundColor: grey1,
                      padding: 14,
                      border: "none",
                      borderRadius: 5,
                      color: "white",
                    }}
                    value={form.password}
                    className="mt-5"
                    placeholder={"Password"}
                    onChangeText={(value) =>
                      setForm({ ...form, password: value })
                    }
                    placeholderTextColor={grey3}
                    secureTextEntry={!showPassword}
                  />
                  <TextInput
                    style={{
                      backgroundColor: grey1,
                      padding: 14,
                      border: "none",
                      borderRadius: 5,
                      color: "white",
                    }}
                    value={form.confirmPassword}
                    className="mt-5"
                    placeholder={"Confirm password"}
                    onChangeText={(value) =>
                      setForm({ ...form, confirmPassword: value })
                    }
                    placeholderTextColor={grey3}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={{ color: "white", marginTop: 16 }}>
                      {showPassword ? "Hide password" : "Show password"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text
                    style={{
                      color: "white",

                      marginTop: 40,
                    }}
                  >
                    By clicking the "Check" button, you agree to our{" "}
                    <Link
                      href="https://www.hotostash.com/terms"
                      style={{ color: orange }}
                    >
                      Terms and Conditions,
                    </Link>{" "}
                    <Link
                      href="https://www.hotostash.com/privacy-policy"
                      style={{ color: orange }}
                    >
                      Privacy Policy.
                    </Link>{" "}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <CustomPrevButton title="Back" handlePress={prevStep} />
                  <View style={{ alignItems: "flex-end" }}>
                    {/* {!loading ? ( */}
                    <CustomNextButton
                      handlePress={validateFinalStep}
                      isLoading={loading}
                      title={loading ? "loader" : "final"}
                    />
                    {/* ) : ( */}
                    {/* <Text style={{ color: "white" }}>ffff</Text> */}
                    {/* )} */}
                  </View>
                </View>
              </View>
            )}
            <View style={{ marginTop: 20 }}>
              <Text style={{ color: "white", textAlign: "center" }}>
                Already have an account?{" "}
                <Link
                  href="/login"
                  style={{ color: orange, fontWeight: "bold" }}
                >
                  Log in
                </Link>
              </Text>
            </View>

            <CustomModal
              modalTitle={"Error"}
              modalText={error}
              okText={"OK"}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible2(false);
              }}
              loading={loading}
              handleOkPress={() => {
                setModalVisible2(false);
              }}
              modalVisible={modalVisible2} // Pass modalVisible as a prop
              setModalVisible={setModalVisible2} // Pass the setter function to update the state
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
