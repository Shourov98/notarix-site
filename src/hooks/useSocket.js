"use client";

import { useEffect } from "react";
import { subscribe } from "@/lib/socketClient";

export const useSocket = (event, handler) => {
  useEffect(() => {
    if (!event || typeof handler !== "function") {
      return undefined;
    }
    const unsubscribe = subscribe(event, handler);
    return unsubscribe;
  }, [event, handler]);
};