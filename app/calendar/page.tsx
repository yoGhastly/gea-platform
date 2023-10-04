"use client";
import React, { useEffect, useReducer, useState } from "react";
import DatePicker from "react-datepicker";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";

import "react-datepicker/dist/react-datepicker.css";
import "@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css";

import { CardEvent, GroupSelector } from "../components";
import { Event } from "../interfaces/";
import { gruposEstudiantiles } from "../constants";
import { Button, Card, CircularProgress, Input, Skeleton } from "@nextui-org/react";
import { supabase } from "../lib/supabase";

// Define the state type
type State = {
  activity: string;
  place: string;
};

// Define the action type
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
  const [value, onChange] = useState<Value>(["00:00", "00:00"]);
  const [error, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[] | null>(null);

  const saveEvent = async () => {
    // Access values from state
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

      const { error } = await supabase.from("events").insert([cardData]);

      if (error) {
        console.error("Failed to save event on Events table", error);
        setLoading(false);
        return;
      }
      setLoading(false);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const getEvents = async () => {
      const { data: eventsData, error } = await supabase
        .from("events")
        .select("*");
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      setEvents(eventsData);
    };
    getEvents();
  }, []);

  return (
    <main className="min-h-screen">
      <div className="flex container gap-5 h-screen">
        <section className="basis-1/3 p-3 flex flex-col gap-5  items-center border-r border-secondary/20">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date as Date)}
            showIcon
            inline
          />
          <TimeRangePicker onChange={onChange} value={value} disableClock />
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
          <Button
            onClick={saveEvent}
            variant="solid"
            color="secondary"
            size="md"
            isLoading={loading}
          >
            Guardar
          </Button>
        </section>

        <section className="basis-auto p-3 flex flex-grow gap-5">
          {
            events && (
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
            )
          }
        </section>
      </div>
    </main>
  );
}
