import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { grey2, orange } from "./colors";
import EventPhotos from "./EventPhotos";
import EventParticipants from "../app/(tabs)/stashes/eventParticipants";

export default function EventTabs({ eventId }) {
  const [activeItem, setActiveItem] = useState("photos");

  const handleTabItemClick = (itemName) => {
    setActiveItem(itemName);
  };
  console.log("Event ID in EventTabs:", eventId); // Add this to debug

  return (
    <View>
      {/* Tab Navigation */}
      <View
        className="px-4"
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
          borderBottomColor: grey2,
          borderBottomWidth: 1,
        }}
      >
        {["photos", "participants", "contribution", "ivcard"].map((tab) => (
          <View
            key={tab}
            style={{
              borderBottomColor: activeItem === tab ? orange : "transparent",
              borderBottomWidth: activeItem === tab ? 2 : 0,
            }}
          >
            <TouchableOpacity
              style={{ marginBottom: 10, padding: 10 }}
              onPress={() => handleTabItemClick(tab)}
            >
              <Text style={{ color: activeItem === tab ? "white" : "grey" }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Tab Content */}
      <View>
        {activeItem === "photos" && (
          // <View style={{ flex: 1 }}>
          <EventPhotos eventId={eventId} />
          // </View>
        )}
        {activeItem === "participants" && (
          <View>
            <EventParticipants eventId={eventId} />
          </View>
        )}
        {activeItem === "contribution" && (
          <View>
            <Text style={{ color: "white" }}>Contribution Details</Text>
            {/* Add a payment or contribution details component */}
          </View>
        )}
        {activeItem === "ivcard" && (
          <View>
            <Text style={{ color: "white" }}>
              Invitation Card for the Event
            </Text>
            {/* Render IV Card component */}
          </View>
        )}
      </View>
    </View>
  );
}
