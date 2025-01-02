import { View, Text, FlatList, ScrollView } from "react-native";
import React from "react";
import { useUser } from "../../context/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
const Events = () => {
  const { user } = useUser();
  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={{ backgroundColor: "#000000" }}
      className="h-full"
    >
      <ScrollView>
        <View
          className="w-full min-h-[85vh] px-4 my-6"
          style={{ backgroundColor: "" }}
        >
          <View>
            <Text
              className="text-white"
              style={{ fontSize: 30, fontWeight: "900" }}
            >
              Hires
            </Text>
          </View>
          {/* <FlatList
            data={[{ id: 1 }]}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <Text style={{ color: "white" }}>{item.id}</Text>
            )}
          /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Events;
