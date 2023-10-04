"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Button,
  CircularProgress,
} from "@nextui-org/react";
import { argv0 } from "process";

interface Props {
  day: string;
  time: string[];
  activity: string;
  group: string;
  place: string;
  isLoading: boolean;
}

const START_TIME = 0;
const END_TIME = 1;
const indexToInsertSpace = 5;

export const CardEvent: React.FC<Props> = ({
  day,
  time,
  activity,
  group,
  place,
  isLoading,
}) => {
  return !isLoading ? (
    <Card
      className="w-[250px] h-[250px] bg-secondary text-white"
      isFooterBlurred
    >
      <CardHeader className="flex justify-between gap-3">
        <div className="flex">
          {time.map((t, key) => (
            <div key={key}>
              <p>{`${t}`}</p>
            </div>
          ))}
        </div>
        <p className="font-bold">{day}</p>
      </CardHeader>

      <Divider />
      <CardBody className="flex items-center mt-10">
        <p>{activity}</p>
      </CardBody>
      <Divider />
      <CardFooter className="gap-10 before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <Button
          className="text-tiny text-white bg-black/20"
          variant="flat"
          color="default"
          radius="lg"
          size="sm"
        >
          {group}
        </Button>
        <p className="text-tiny text-white/80">{place}</p>
      </CardFooter>
    </Card>
  ) : (
    <CircularProgress color="primary" />
  );
};
