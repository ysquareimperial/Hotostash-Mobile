// app/linking.js
const linking = {
  prefixes: ["hotostash://", "https://www.hotostash.com"],
  config: {
    screens: {
      "(tabs)": {
        screens: {
          index: "",
          stashes: "stashes",
          events: "events",
          profile: "profile",
        },
      },
      joinEvent: "invite/event", // e.g. hotostash://invite/event?invite_id=V0vXY
      viewEvent: "public", // e.g. hotostash://public?e=for-the-bride&l=syJi5Ut
      // contribution: "contribute", // if you need contribution via deep link
      // Add more if needed
    },
  },
};

export default linking;