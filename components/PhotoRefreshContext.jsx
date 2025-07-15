// PhotoRefreshContext.js
import { createContext, useContext, useState } from "react";

const PhotoRefreshContext = createContext();

export const usePhotoRefresh = () => useContext(PhotoRefreshContext);

export const PhotoRefreshProvider = ({ children }) => {
  const [refreshCount, setRefreshCount] = useState(0);

  const triggerRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <PhotoRefreshContext.Provider value={{ refreshCount, triggerRefresh }}>
      {children}
    </PhotoRefreshContext.Provider>
  );
};
