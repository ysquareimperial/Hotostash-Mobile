import { View, Text, FlatList, ScrollView } from "react-native";
import React from "react";
import { useUser } from "../../context/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
const Stashes = () => {
  const { user } = useUser();
  return (
    <SafeAreaView style={{ backgroundColor: "#000000" }} className="h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          {/* <View>
        <Text>Stashes</Text>
        <Text>{user.firstname}</Text>
        <Text>{user.lastname}</Text>
        <Text>{user.image}</Text>
        <Text>{user.about}</Text>
      </View> */}
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

export default Stashes;
