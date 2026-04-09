"use client";

import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      autoConnect: false,
      transports: ["websocket"],
    });
  }
  return socket;
}

export function useSocket() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const instance = getSocket();
    const token = typeof window !== "undefined" ? window.localStorage.getItem("cattleya_access_token") : null;
    if (token) {
      instance.auth = { token };
      instance.connect();
    }
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    instance.on("connect", onConnect);
    instance.on("disconnect", onDisconnect);
    return () => {
      instance.off("connect", onConnect);
      instance.off("disconnect", onDisconnect);
    };
  }, []);

  return { socket: getSocket(), connected };
}
