'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function DemoCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);  // Pour gérer les erreurs de connexion


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/connexion/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirection directe sans manipulation du token
        window.location.href = data.account_type === "owner" ? "/owner" : "/user";
      }
    } catch (err) {
      setError("Une erreur s'est produite");
    }
  };

  return (
    <Card className="h-[380px] w-96 rounded-xl p-6 bg-white text-[#123B4D] ">
      <CardHeader>
        <CardTitle className="text-xl text-black font-bold">Login</CardTitle>
        <CardDescription className=""></CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex text-black flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="font-serif text-black p-2 border rounded-md bg-[#F8FAFC]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}  // Capture l'email
              />
            </div>
            <div className="flex flex-col text-black space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="font-serif text-black p-2 border rounded-md bg-[#F8FAFC]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}  // Capture le mot de passe
              />
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{typeof error === "string" ? error : "Une erreur s'est produite."}</p>}
          <CardFooter className="my-4 flex justify-center overflow-hidden">
            <Button
              type="submit"
              className="bg-[#F6C494] w-80 text-black font-bold mt-2 py-2 px-4 rounded-xl hover:bg-[#e76600]"
            >
              Log In
            </Button>
          </CardFooter>
        </form>
      </CardContent>
      <div className="flex text-[#2FBECA] justify-center mt-2">
        <Link href="/forgot" className="text-[#C6844B] hover:underline cursor-pointer">
          Forgot your password?
        </Link>
      </div>
    </Card>
  );
}
