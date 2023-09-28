"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Code, Input } from "@nextui-org/react";
import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { EmailInput, GroupSelector } from "../components";
import { gruposEstudiantiles } from "../constants";

function RenderSignIn({ errorMessage }: { errorMessage: string }) {
  const [isLoading, setLoading] = useState(false);
  const [email, onEmailChange] = useState("");

  const registerAdmin = async ({ email }: { email: string }) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: "http://localhost:3000/dashboard?logged=true",
      },
    });

    const { error: errorDbInsert } = await supabase.from("admin email").insert([
      {
        id: uuidv4(),
        email: email,
      },
    ]);

    setLoading(false);

    if (error && errorDbInsert) {
      console.log("error register admin", error);
      console.log("error register admin on db", errorDbInsert);
      return;
    }
  };
  return (
    <main className="min-h-screen">
      <div className="grid grid-cols-2">
        <div
          className="relative max-w-4xl h-screen basis-3/4"
          style={{ background: `url(/doodles.svg)` }}
        ></div>
        <div className="max-w-md basis-1/5 flex flex-col gap-10 justify-center items-center m-auto">
          <h1 className="font-bold text-5xl">Sign In</h1>
          <EmailInput
            value={email}
            setState={onEmailChange}
            isLoading={isLoading}
            disableButton={isLoading}
            errorMessage={errorMessage}
            buttonLabel="Sign In"
            onClick={registerAdmin}
          />
        </div>
      </div>
    </main>
  );
}

export default function Dashboard() {
  const [groupEmailToAdd, setGroupEmailToAdd] = useState("");
  const [groupToAdd, setGroupToAdd] = useState("");
  const [isEmailLogged, setIsEmailLogged] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);
  const [showInviteLink, setShowInviteLink] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [errorMessage, _setErrorMessage] = useState(
    "Please enter a valid email"
  );

  const showAddGroupInput = () => {
    setShowInput(true);
  };

  const registerGroup = async ({ email: groupEmail }: { email: string }) => {
    setLoading(true);

    const { data } = await supabase
      .from("emailGroups")
      .select("*")
      .eq("email", groupEmail);

    if (data?.length) {
      console.log(data);
      setLoading(false);
      alert("Email ya existe, intenta con uno nuevo");
      return;
    }


    const { error } = await supabase.from("emailGroups").insert([
      {
        email: groupEmail,
        group: groupToAdd,
      },
    ]);
    alert("Grupo Registrado");
    setLoading(false);
    setDisableButton(true);
    setShowInviteLink(true);
    if (error) {
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange((_evt, session) => {
      if (session) {
        setIsEmailLogged(true);
      }
    });
  }, []);

  return isEmailLogged ? (
    <main className="min-h-screen">
      <div style={{ margin: "0 auto" }}>
        <section className="flex items-center gap-10 md:px-24 py-6">
          <button
            onClick={showAddGroupInput}
            className="w-[300px] h-[300px] bg-primary/20 p-3 flex flex-col justify-center items-center rounded"
          >
            <Image
              src="/plus-circle.svg"
              alt="Icon Add"
              width={100}
              height={100}
            />
            <p>
              {showInput
                ? "Agregando Grupo Estudiantil"
                : "Agregar Grupo Estudiantil"}
            </p>
          </button>
          <div className={`${showInput ? "flex flex-col gap-5 max-w-xl" : "hidden"}`}>
            <div className="flex gap-5 w-full">
              <EmailInput
                value={groupEmailToAdd}
                setState={setGroupEmailToAdd}
                isLoading={isLoading}
                onClick={() => registerGroup({ email: groupEmailToAdd })}
                buttonLabel="Generar invitación"
                disableButton={disableButton}
                errorMessage={errorMessage}
              />
              <div className={`${showInviteLink ? "hidden" : ""}`}>
                <GroupSelector groups={gruposEstudiantiles} setSelectedGroup={setGroupToAdd} />
              </div>
            </div>
            <p className={`${showInviteLink ? "block" : "hidden"}`}>
              {" "}
              Tu link de invitación para crear un perfil de Grupo Estudiantil:
            </p>
            <Code color="primary" className={`${showInviteLink ? "block" : "hidden"}`}>
              {`http://localhost:3000/create-profile?email=${encodeURIComponent(groupEmailToAdd)}`}
            </Code>
          </div>
        </section>
      </div>
    </main>
  ) : (
    <RenderSignIn errorMessage={errorMessage} />
  );
}
