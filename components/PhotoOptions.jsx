import { Text, View, TouchableOpacity } from "react-native";
import { Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { grey1, grey2 } from "./colors"; // Adjust path

export const PhotoOptions = ({ handleDownload, handleShare }) => {
  return (
    <View
      className="px-4"
      style={{
        paddingTop: 12,
        paddingBottom: 40,
        // backgroundColor: "red",
        flexDirection: "row",
        justifyContent: "space-between",
        columnGap: 5,
        marginTop: 10,
        marginBottom: 5,
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: grey1,
          paddingHorizontal: 5,
          paddingVertical: 5,
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          borderRadius: 50,
          color: "white",
        }}
        onPress={handleDownload}
      >
        <View
          style={{
            backgroundColor: grey2,
            borderRadius: 50,
            paddingHorizontal: 5,
            paddingVertical: 5,
            width: 25,
            height: 25,
            alignItems: "center",
          }}
        >
          <Octicons name="download" size={16} style={{ color: "white" }} />
        </View>
        <Text style={{ color: "white", fontSize: 10, marginRight: 5 }}>
          Download
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: grey1,
          paddingHorizontal: 5,
          paddingVertical: 5,
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          borderRadius: 50,
          color: "white",
        }}
        onPress={handleShare}
      >
        <View
          style={{
            backgroundColor: grey2,
            borderRadius: 50,
            paddingHorizontal: 5,
            paddingVertical: 5,
            width: 25,
            height: 25,
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons name="share" size={16} color="white" />
        </View>
        <Text style={{ color: "white", fontSize: 10, marginRight: 5 }}>
          Share
        </Text>
      </TouchableOpacity>
    </View>
  );
};
