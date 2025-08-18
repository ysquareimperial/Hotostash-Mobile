import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "",
    image: "",
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    about: "",
    created_at: "",
    dob: "",
    location: "",
    phone: "",
  });

  //Refresh flag
  const [refreshPageA, setRefreshPageA] = useState(false);
  const [eventEdited, setEventEdited] = useState(false);
  const [leftEvent, setLeftEvent] = useState(false);

  // Retrieve user data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser)); // Load user from AsyncStorage
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  // Update AsyncStorage whenever the user changes
  const saveUser = async (userData) => {
    try {
      setUser(userData); // Update context
      await AsyncStorage.setItem("user", JSON.stringify(userData)); // Persist to AsyncStorage
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        saveUser,
        refreshPageA,
        setRefreshPageA,
        eventEdited,
        setEventEdited,
        leftEvent,
        setLeftEvent,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
