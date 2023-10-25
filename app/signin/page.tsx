"use client";
import React, { useState } from "react";
import { EmailInput } from "../components";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../constants";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const registerUserEmail = async () => {
    if (email.trim() === "") {
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.from("emailGroups").select("*");

      if (error) {
        console.error(error);
        return;
      }

      if (data[0].email === email) {
        const { error } = await supabase.auth.signInWithOtp({
          email: email, options: {
            emailRedirectTo: `${BASE_URL}/profile?=${encodeURIComponent(data[0].group)}`,
          }
        });

        if (error) {
          console.error('Failed to send sign in email', error);
        }
        push(`/verify?email=${encodeURIComponent(email)}`)
      } else {
        alert('Email no existe');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen">
      <div style={{ margin: "0 auto" }} className="flex flex-col gap-5 justify-center items-center max-w-md min-h-screen">
        <p className="text-xl font-bold">Ingresa tu email de acceso</p>
        <EmailInput
          value={email}
          setState={setEmail}
          errorMessage="Please enter a valid email"
          buttonLabel="Sign In"
          isLoading={loading}
          disableButton={loading}
          onClick={registerUserEmail}
        />
      </div>
    </main>
  );
}
