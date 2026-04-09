"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  user: { id: string; name: string; email: string; role: string } | null;
  accessToken: string | null;
  setSession: (user: UserState["user"], accessToken: string) => void;
  clearSession: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setSession: (user, accessToken) => set({ user, accessToken }),
      clearSession: () => set({ user: null, accessToken: null }),
    }),
    { name: "cattleya-user" }
  )
);
