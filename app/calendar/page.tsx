"use client";
import React, { useEffect, useReducer, useState } from "react";
import DatePicker from "react-datepicker";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";

import "react-datepicker/dist/react-datepicker.css";
import "@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css";

import { CardEvent, GroupSelector } from "../components";
import { Event } from "../interfaces/";
import { gruposEstudiantiles } from "../constants";
import { Button, Input } from "@nextui-org/react";
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

      // Check for conflicting events
      const hasConflict = events?.some((event) => {
        return (
          event.day === cardData.day && JSON.stringify(event.time) === JSON.stringify(cardData.time)
        );
      });

      if (hasConflict) {
        alert("Un evento ya existe con esa hora y dia, intenta nuevamente.");
        setLoading(false);
        return;
      }

      // If no conflicting event exists, save the new event
      const { error: saveError } = await supabase.from("events").insert([cardData]);

      if (saveError) {
        console.error("Failed to save event on Events table", saveError);
        alert(`Failed to save event on Events table ${saveError.message}`);
        setLoading(false);
        return;
      }
      alert('Evento creado.');
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

  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await fetch(`${window.origin}/api/events`, {
          method: 'GET',
        });
        const eventsData = await res.json();

        setEvents(eventsData.events);
      } catch (e) {
        console.error(e);
      }
    };
    getEvents();
  }, []);


  return (
    <main className="min-h-screen">
      <div className="flex container gap-5 h-screen">
        <section className="sticky basis-1/3 p-3 flex flex-col gap-5  items-center border-r border-secondary/20">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date as Date)}
            showIcon
            inline
          />
          {
            events && (
              <TimeRangePicker onChange={onChange} value={value} disableClock />
            )
          }
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

        <section className="basis-auto px-3 py-1.5 grid grid-cols-3 gap-5">
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
