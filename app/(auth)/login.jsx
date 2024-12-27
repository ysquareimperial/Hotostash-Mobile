import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import { api } from "../../helpers/helpers";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import CustomModal from "../../components/CustomModal";
import { Link, router } from "expo-router";
import logo from "../../assets/Hotostash PNG/77.png";
import google from "../../assets/google.png";
import { orange } from "../../components/colors";
import OrSeparator from "../../components/OrSeparator";
import CustomButton2 from "../../components/CustomButton2";
import { useUser } from "../../context/UserContext";
import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

// WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const [userInfo, setUserInfo] = useState(null);
  const { saveUser } = useUser(); // Get saveUser from context
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible2, setModalVisible2] = useState(false);
  const isButtonDisabled = !form.username || !form.password;
  const formData = new URLSearchParams();
  formData.append("username", form.username);
  formData.append("password", form.password);

  //C O N T I N U E  W I T H  G O O G L E
  // Dynamically determine environment
  // const isDevelopment = process.env.NODE_ENV === "development";

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   androidClientId:
  //     "624550916436-fe5inf1rl5cr6naef052991qlcs8n1k3.apps.googleusercontent.com",
  //   iosClientId:
  //     "624550916436-cii74emo59u9renvhlp3jbhft6du2p48.apps.googleusercontent.com",
  //   scopes: ["profile", "email", "openid"],
  //   redirectUri: isDevelopment
  //     ? makeRedirectUri({ useProxy: true }) // Use Expo proxy during development
  //     : makeRedirectUri({ useProxy: false }), // Use native URI in production
  // });

  // Debugging: Log the redirect URI to ensure it matches the expected format
  // console.log("Redirect URI:", request?.redirectUri);

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { authentication } = response;
  //     handleUserAuthentication(authentication.accessToken);
  //   }
  // }, [response]);

  // const handleUserAuthentication = async (token) => {
  //   try {
  //     const userGoogle = await AsyncStorage.getItem("@user");
  //     if (!userGoogle && token) {
  //       await getUserInfo(token); // Fetch and store user info
  //     } else {
  //       setUserInfo(JSON.parse(userGoogle)); // Load user info from AsyncStorage
  //     }
  //   } catch (error) {
  //     console.error("Error authenticating user:", error);
  //   }
  // };

  // Function to fetch Google user info
  // const getUserInfo = async (token) => {
  //   if (!token) return;
  //   try {
  //     const response = await fetch(
  //       "https://www.googleapis.com/userinfo/v2/me",
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     const user = await response.json();
  //     await AsyncStorage.setItem("@user", JSON.stringify(user)); // Cache user info locally
  //     setUserInfo(user);
  //   } catch (error) {
  //     console.error("Error fetching user info:", error);
  //   }
  // };

  GoogleSignin.configure({
    webClientId:
      "370729507727-r3f6ia0q8ilejvdvm2jhtlbdhn9crjmb.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
    scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
    iosClientId:
      "370729507727-ksbpi3glglvvo8dvgk22gjg88681ncs8.apps.googleusercontent.com", // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  });
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${api}login_user`, formData);
      setLoading(false);
      if (response.status === 200) {
        const token = response?.data?.access_token;
        console.log(token);

        if (token) {
          await AsyncStorage.setItem("authToken", token); // Save token to AsyncStorage
          fetchUserProfile(token);
        } else {
          setError("Token not found. Please try again.");
        }
      } else {
        setError(response?.data?.detail || "Login failed. Please try again.");
      }
    } catch (e) {
      setLoading(false);
      const errorMessage =
        e.response?.data?.detail || "An unknown error occurred";
      console.error(errorMessage);
      setError(errorMessage);
      setModalVisible2(true);
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const profileResponse = await axios.get(`${api}users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(profileResponse.data);
      const {
        id,
        image,
        firstname,
        lastname,
        username,
        email,
        about,
        created_at,
        dob,
        location,
        phone,
      } = profileResponse.data;

      const userData = {
        id,
        image,
        firstname,
        lastname,
        username,
        email,
        about,
        created_at,
        dob,
        location,
        phone,
      };
      console.log(userData);

      saveUser(userData); // Update UserContext and AsyncStorage
      console.log("User profile saved successfully!");
      router.replace("/stashes");
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to fetch user profile.");
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#000000" }} className="h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // style={styles.container}
      >
        <ScrollView>
          <View className="w-full justify-center min-h-[85vh] px-4 my-6">
            <View className="items-center">
              <Image
                source={logo}
                className="w-[130px] h-[84px]"
                resizeMode="contain"
              />
            </View>

            <Text>{JSON.stringify(userInfo)}</Text>
            <FormField
              placeholder={"Username/Phone/Email"}
              title="Email"
              value={form.username}
              handleChangeText={(text) =>
                setForm({ ...form, username: text.trim() })
              }
              otherStyles="mt-7"
              keyboardType="email-address"
            />
            <FormField
              placeholder={"Password"}
              title="Password"
              value={form.password}
              handleChangeText={(text) => setForm({ ...form, password: text })}
              otherStyles="mt-5"
            />
            <CustomButton
              title={
                loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  "Log in"
                )
              }
              handlePress={handleSubmit}
              isLoading={loading || isButtonDisabled}
            />
            <OrSeparator />
            {/* <CustomButton2
              handlePress={() => promptAsync()}
              logo={google}
              title={`Sign in with google`}
            /> */}
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
            />
            <View
              style={{
                marginTop: 30,
                display: "flex",
                flexDirection: "row",
                gap: 4,
              }}
            >
              {userInfo && (
                <>
                  <Text>Welcome, {userInfo.name}!</Text>
                  <Text>Email: {userInfo.email}</Text>
                </>
              )}
              <Text style={{ color: "white" }}>Don't have an account?</Text>

              <Link
                href="/register"
                style={{ color: orange, fontWeight: "bold" }}
              >
                Create new account
              </Link>
            </View>
            <CustomModal
              modalTitle={"Login failed"}
              modalText={error}
              okText={"OK"}
              handleOkPress={() => setModalVisible2(false)}
              onRequestClose={() => setModalVisible2(false)}
              loading={loading}
              modalVisible={modalVisible2}
              // setModalVisible={setModalVisible2}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
