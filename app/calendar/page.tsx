"use client";
import React, { useEffect, useReducer, useState } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";

import "react-datepicker/dist/react-datepicker.css";
import "@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css";

import { CardEvent, GroupSelector } from "../components";
import { Event } from "../interfaces/";
import { BASE_URL, gruposEstudiantiles } from "../constants";
import { Button, CircularProgress, Input } from "@nextui-org/react";
import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

type State = {
  activity: string;
  place: string;
};

type Action =
  | { type: "SET_ACTIVITY"; payload: string }
  | { type: "SET_PLACE"; payload: string };

type ValuePiece = Date | string | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const initialState: State = {
  activity: "",
  place: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ACTIVITY":
      return { ...state, activity: action.payload };
    case "SET_PLACE":
      return { ...state, place: action.payload };
    default:
      return state;
  }
}

export default function Calendar() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [value, onChange] = useState<Value>(["00:00", "00:00"]);
  const [error, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[] | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");

  useEffect(() => {
    supabase.auth.onAuthStateChange((_evt, session) => {
      if (session) {
        setIsSignedIn(true);
        const checkAdmin = async () => {
          const { data, error } = await supabase
            .from("admin email")
            .select("email")
            .limit(1);
          if (error) {
            console.error("Error fetching admin data", error);
            return;
          }
          if (session.user.email === data[0].email) {
            setIsAdmin(true);
          }
        };
        checkAdmin();
      }
    });
  }, []);

  const generateToken = async () => {
    const generatedToken = uuidv4().slice(0, 4);
    setToken(generatedToken);
    const { error } = await supabase.from("tokens").insert([
      {
        token: generatedToken,
      },
    ]);
    if (error) {
      console.log(error);
      return;
    }
  };

  const saveEvent = async () => {
    setLoading(true);
    try {
      const cardData = {
        day: `${startDate.getDate()} ${startDate.toLocaleString("default", {
          month: "short",
        })}`,
        time: value,
        activity: state.activity,
        group: selectedGroup,
        place: state.place,
      };

      const hasConflict = events?.some((event) => {
        return (
          event.day === cardData.day &&
          JSON.stringify(event.time) === JSON.stringify(cardData.time)
        );
      });

      if (hasConflict) {
        alert("Un evento ya existe con esa hora y dia, intenta nuevamente.");
        setLoading(false);
        return;
      }

      // If no conflicting event exists, save the new event
      const { error: saveError } = await supabase
        .from("events")
        .insert([cardData]);

      if (saveError) {
        console.error("Failed to save event on Events table", saveError);
        alert(`Failed to save event on Events table ${saveError.message}`);
        setLoading(false);
        return;
      }
      alert("Evento creado.");
      // Clear error message and reset the form
      setErrorMessage("");
      dispatch({ type: "SET_ACTIVITY", payload: "" });
      dispatch({ type: "SET_PLACE", payload: "" });
      setSelectedGroup("");
      setStartDate(new Date());
      onChange(["00:00", "00:00"]);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const save = async () => {
    if (isAdmin) {
      saveEvent();
    } else {
      const token = prompt("Token:");
      const { data, error } = await supabase
        .from("tokens")
        .select("token")
        .eq("token", token);
      if (error) {
        console.log(error);
        return;
      }
      if (data[0].token === token) {
        await saveEvent();
        await supabase.from("tokens").delete().eq("token", token);
      } else {
        alert("Token incorrecto");
        return;
      }
    }
  };

  // TODO: revalidate event data on fetching
  useEffect(() => {
    const getEvents = async () => {
      try {
        const { data: events, error } = await supabase.from("events").select("*");

        if (error) {
          console.error("Could not fetch events: ", error);
          setEvents([]);
          return;
        }
        if (events) {
          setEvents(events as Event[]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    getEvents();
    revalidatePath("/calendar");
  }, []);

  return (
    <main className="min-h-screen">
      <div className="flex flex-col md:flex-row container gap-5">
        {isSignedIn && (
          <section className="sticky basis-1/3 p-3 flex flex-col gap-5  items-center border-r border-secondary/20">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date as Date)}
              showIcon
              inline
            />
            {events && (
              <TimeRangePicker onChange={onChange} value={value} disableClock />
            )}
            <div className="w-[320px] flex flex-col gap-5">
              <Input
                type="text"
                placeholder="Actividad"
                value={state.activity}
                onValueChange={(value) =>
                  dispatch({ type: "SET_ACTIVITY", payload: value })
                }
              />
              <Input
                type="text"
                placeholder="Lugar"
                value={state.place}
                onValueChange={(value) =>
                  dispatch({ type: "SET_PLACE", payload: value })
                }
              />
              <GroupSelector
                groups={gruposEstudiantiles}
                setSelectedGroup={setSelectedGroup}
              />
            </div>

            {isAdmin && (
              <div className="flex flex-col gap-3">
                <Button
                  onClick={generateToken}
                  variant="ghost"
                  color="secondary"
                  size="md"
                >
                  Generar Token
                </Button>
                {token && (
                  <p className="self-center">
                    Token: <span className="font-bold">{token}</span>
                  </p>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>
            )}
            <Button
              onClick={save}
              variant="solid"
              color="primary"
              size="md"
              isLoading={loading}
            >
              Guardar
            </Button>
          </section>
        )}

        <section className="basis-auto px-3 py-1.5 grid grid-cols-1 md:grid-cols-3 gap-5 md:h-screen">
          {events ? (
            events.map((event, idx) => (
              <CardEvent
                key={idx}
                isLoading={!events}
                day={event.day}
                time={event.time}
                activity={event.activity}
                group={event.group}
                place={event.place}
              />
            ))
          ) : (
            <Image
              src="/not-found.svg"
              alt="not found"
              width={52}
              height={52}
            />
          )}
        </section>
      </div>
    </main>
  );
}
