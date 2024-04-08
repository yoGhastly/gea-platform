"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@nextui-org/react";
import { supabase } from "../lib/supabase";
import { EmailInput, GroupSelector } from "../components";
import { BASE_URL, gruposEstudiantiles } from "../constants";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "../lib/useMediaQuery";

function RenderSignIn({ errorMessage }: { errorMessage: string }) {
  const [isLoading, setLoading] = useState(false);
  const [email, onEmailChange] = useState("");
  const { push } = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (evt, session) => {
      const { data, error } = await supabase
        .from("admin email")
        .select("email")
        .limit(1);
      if (!session) return;
      if (!data?.length) return;
      if (session.user.email !== data[0].email) {
        push("/");
      }
    });
  }, [push]);

  const registerAdmin = async ({ email }: { email: string }) => {
    try {
      setLoading(true);

      // Check if email exists in admin email table
      const { data: adminData, error: adminError } = await supabase
        .from("admin email")
        .select("email")
        .eq("email", email)
        .single();

      if (adminError) {
        console.error("Error fetching admin email:", adminError.message);
        setLoading(false);
        return;
      }

      if (!adminData) {
        // Email doesn't exist as an admin, alert the user and return
        alert("Email does not exist as an administrator.");
        setLoading(false);
        return;
      }

      // Sign in user with OTP
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${BASE_URL}/dashboard?logged=true`,
        },
      });

      if (signInError) {
        throw new Error("Error signing in with OTP: " + signInError.message);
      }

      // Insert admin email into the database
      const { error: insertError } = await supabase
        .from("admin_email")
        .insert([{ email }]);

      if (insertError) {
        throw new Error("Error inserting admin email: " + insertError.message);
      }

      // Redirect to verification page
      push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      console.error("Error registering admin:", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen">
      <div className="md:krid md:grid-cols-2">
        <div
          className="hidden md:relative max-w-4xl h-screen basis-3/4"
          style={{ background: `url(/doodles.svg)` }}
        ></div>
        <div className="max-w-md mt-10 md:mt-0 basis-1/5 flex flex-col gap-10 justify-center items-center m-auto">
          <h1 className="font-bold text-5xl">Admin</h1>
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
    "Please enter a valid email",
  );
  const isSm = useMediaQuery(480);

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
        <section className="flex flex-col md:flex-row items-center gap-10 px-5 md:px-24 py-6">
          <button
            onClick={showAddGroupInput}
            className="w-[150px] h-[150px] md:w-[300px] md:h-[300px] bg-primary/20 p-3 flex flex-col justify-center items-center rounded"
          >
            <Image
              src="/plus-circle.svg"
              alt="Icon Add"
              width={isSm ? 32 : 100}
              height={isSm ? 32 : 100}
            />
            <p>
              {showInput
                ? "Agregando Grupo Estudiantil"
                : "Agregar Grupo Estudiantil"}
            </p>
          </button>
          <div
            className={`${showInput
                ? "flex flex-col gap-5 w-[300px] md:max-w-2xl"
                : "hidden"
              }`}
          >
            <div className="flex flex-col md:flex-row gap-5 w-full">
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
                <GroupSelector
                  groups={gruposEstudiantiles}
                  setSelectedGroup={setGroupToAdd}
                />
              </div>
            </div>
            <p className={`${showInviteLink ? "block" : "hidden"}`}>
              {" "}
              Tu link de invitación para crear un perfil de Grupo Estudiantil:
            </p>
            <Link
              color="primary"
              className={`${showInviteLink ? "block" : "hidden"}`}
              size={`${isSm ? "sm" : "md"}`}
              showAnchorIcon
              isExternal
              href={`${BASE_URL}/create-profile?email=${encodeURIComponent(
                groupEmailToAdd,
              )}`}
            >
              {`${BASE_URL}/create-profile?email=${encodeURIComponent(groupEmailToAdd)}`}
            </Link>
          </div>
        </section>
      </div>
    </main>
  ) : (
    <RenderSignIn errorMessage={errorMessage} />
  );
}
