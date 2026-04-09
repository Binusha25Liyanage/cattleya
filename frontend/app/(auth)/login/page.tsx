"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { saveAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form
        className="w-full space-y-4 rounded-3xl border border-gold/20 bg-white p-8 shadow-glow"
        onSubmit={async (event) => {
          event.preventDefault();
          const response = await api.post("/auth/login", { email, password });
          saveAccessToken(response.data.data.accessToken);
          toast.success("Welcome back");
          router.push(searchParams.get("next") || "/");
        }}
      >
        <h1 className="font-heading text-3xl">Login</h1>
        <Input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <Button className="w-full" type="submit">Sign in</Button>
      </form>
    </div>
  );
}
