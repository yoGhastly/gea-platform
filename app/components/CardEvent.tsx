"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  CircularProgress,
} from "@nextui-org/react";

interface Props {
  day: string;
  time: string[];
  activity: string;
  group: string;
  place: string;
  isLoading: boolean;
}

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
      className="w-full h-24 md:w-[250px] md:h-[250px] bg-secondary/90 text-white"
      isFooterBlurred
    >
      <CardHeader className="flex justify-between gap-3 sm:px-4 sm:py-4">
        <div className="flex">
          <p className="text-gray">{time.join(" ")}</p>
        </div>
        <p className="font-bold">{day}</p>
      </CardHeader>

      <Divider />
      <CardBody className="flex flex-row md:flex-col justify-between md:justify-start md:items-center -mt-5 md:mt-10 overflow-hidden">
        <p className="font-extrabold md:font-normal">{activity}</p>
        <p className="block md:hidden">{place}</p>
      </CardBody>
      <Divider />
      <CardFooter className="hidden md:flex gap-10 before:bg-white/10 border-white/20 border-1 md:overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
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
