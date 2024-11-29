"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("email", { email, callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Sign in with Email
          </Button>
        </form>
        <div className="mt-4">
          <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full mb-2"
          >
            Sign in with Google
          </Button>
          <Button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full"
          >
            Sign in with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}
