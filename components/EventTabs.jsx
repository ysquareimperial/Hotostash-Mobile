import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { grey1, grey2, grey3, orange } from "./colors";
import EventPhotos from "./EventPhotos";
import EventParticipants from "../app/(tabs)/stashes/eventParticipants";
import Contribution from "../app/contribution/contribution";
import IV from "./IV";

export default function EventTabs({
  eventId,
  stashId,
  existingLink,
  event,
  eventParticipants,
  openDownloadSheet,
  openStashPhotosSheet,
  existingPublicLink,
  overallProgress,
  triggerCancelStash,
}) {
  const [activeItem, setActiveItem] = useState("photos");

  const handleTabItemClick = (itemName) => {
    setActiveItem(itemName);
  };
  console.log("Event ID in EventTabs:", eventId); // Add this to debug
  console.log("Stash ID in EventTabs:", stashId); // Add this to debug
  const confirmCancelStash = () => {
    Alert.alert(
      "Cancel stash",
      "Are you sure? These photos will not be stashed.",
      [
        {
          text: "No",
          style: "cancel",
          onPress: () => {
            console.log("❌ Cancel aborted by user.");
          },
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            triggerCancelStash(); // ✅ this calls the exposed function in StashPhotosBottomSheet
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <View style={{ flex: 1 }}>
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
        {["photos", "participants", "contribution", "Event card"].map((tab) => (
          <View
            key={tab}
            style={{
              borderBottomColor: activeItem === tab ? orange : "transparent",
              borderBottomWidth: activeItem === tab ? 2 : 0,
            }}
          >
            <TouchableOpacity
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
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

      {/* Stashing progress */}
      {/* progress bar */}
      {overallProgress > 0 && overallProgress < 100 && (
        <View>
          <View
            className="px-4"
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "",
              paddingTop: 8,
              paddingBottom: 8,
              borderBottomWidth: 1,
              borderBottomColor: grey2,
            }}
          >
            <View>
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Stashing photos...
              </Text>
            </View>
            <View>
              <TouchableOpacity
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                onPress={confirmCancelStash}
              >
                <Text style={{ color: orange, fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            className=""
            style={{
              borderColor: grey3,
              borderWidth: 1,
              width: `${overallProgress}%`,
            }}
          ></View>
        </View>
      )}

      {/* {overallProgress > 0 && (
        <View style={{ marginVertical: 10 }}>
          <Text style={{ color: "white", marginBottom: 5 }}>
            Uploading: {overallProgress}%
          </Text>
          <View
            style={{
              height: 10,
              backgroundColor: "#ccc",
              borderRadius: 5,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${overallProgress}%`,
                backgroundColor: "#00ff00",
              }}
            />
          </View>
        </View>
      )} */}

      {/* Tab Content */}
      <View>
        {activeItem === "photos" && (
          // <View style={{ flex: 1 }}>
          <EventPhotos
            eventId={eventId}
            eventParticipants={eventParticipants}
            existingLink={existingPublicLink}
            openDownloadSheet={openDownloadSheet}
            openStashPhotosSheet={openStashPhotosSheet}
          />
          // </View>
        )}
        {activeItem === "participants" && (
          <View>
            <EventParticipants
              eventId={eventId}
              stashId={stashId}
              existingLink={existingLink}
            />
          </View>
        )}
        {activeItem === "contribution" && (
          <View>
            <Contribution eventId={eventId} stashId={stashId} event={event} />
          </View>
        )}
        {activeItem === "Event card" && (
          <View>
            <IV eventId={eventId} />
            {/* Render IV Card component */}
          </View>
        )}
      </View>
    </View>
  );
}
