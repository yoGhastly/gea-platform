'use client';
import { Button, Input } from "@nextui-org/react";
import React, { useMemo } from "react";

interface Props {
  value: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: string;
  buttonLabel: string;
  isLoading: boolean;
  disableButton: boolean;
  onClick: ({ email }: { email: string }) => void;
}

export const EmailInput: React.FC<Props> = ({
  value: email,
  setState: onEmailChange,
  errorMessage,
  buttonLabel,
  isLoading,
  disableButton,
  onClick,
}) => {
  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);
  return (
    <div className="flex flex-col gap-5">
      <Input
        type="email"
        label="Email"
        placeholder="Ingresa tu email de acceso"
        size="lg"
        isInvalid={isInvalid}
        color={isInvalid ? "danger" : "success"}
        errorMessage={isInvalid && errorMessage}
        isRequired
        value={email}
        onValueChange={onEmailChange}
      />

      <Button
        disabled={disableButton}
        variant="solid"
        color="secondary"
        size="lg"
        isLoading={isLoading}
        onClick={() => onClick({ email })}
      >
        {buttonLabel}
      </Button>
    </div>
  );
};
