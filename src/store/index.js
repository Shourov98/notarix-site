import { configureStore } from "@reduxjs/toolkit";
import { sitePortalReducer } from "./sitePortalSlice";

export const store = configureStore({
  reducer: {
    sitePortal: sitePortalReducer,
  },
});
