'use client';
import React from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const searchparams = useSearchParams();
  return (
    <main className="min-h-screen">
      <div style={{ margin: "0 auto" }} className="flex flex-col gap-5 justify-center items-center p-3 min-h-screen">
        <p className="text-xl text-center">Confirma tu inicio de sesión en tu bandeja de entrada o spam</p>
        <p className="text-primary">Tu correo: {searchparams.get('email')}</p>
      </div>
    </main>
  )
}
