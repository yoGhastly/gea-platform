"use client";
import React, { useEffect, useReducer, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button, CircularProgress, Input, Textarea } from "@nextui-org/react";
import { GroupSelector, ImageUpload } from "../components";
import { gruposEstudiantiles } from "../constants";
import { supabase } from "../lib/supabase";
import { careers } from "../constants/grupos";

interface FormState {
  group: string;
  bio: string;
  groupImage: File | null;
  presidentName: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "SET_IMAGE"; image: File };

const initialState: FormState = {
  group: "",
  bio: "",
  groupImage: null,
  presidentName: "",
  instagramUrl: "",
  facebookUrl: "",
  twitterUrl: "",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_IMAGE":
      return { ...state, groupImage: action.image };
    default:
      return state;
  }
}

export default function CreateProfile() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [selectedGroupValue, setSelectedGroup] = useState(""); // Add selectedGroup state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isGroupSaved, setIsGroupSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    group,
    bio,
    groupImage,
    presidentName,
    instagramUrl,
    facebookUrl,
    twitterUrl,
  } = state;

  const searchParams = useSearchParams();
  const isEditMode = searchParams.has("edit");
  const { push } = useRouter();

  useEffect(() => {
    if (!searchParams.has("email")) {
      push("/");
      return;
    }
  }, [searchParams, push]);

  const handleImageSubmit = async (image: File) => {
    dispatch({ type: "SET_IMAGE", image });
  };

  const handleGuardarClick = async () => {
    // Create an object with the data to be saved
    setLoading(true);


    if (!selectedImage) {
      console.error("Group image is not defined.");
      setLoading(false);
      return;
    }

    const data = {
      group: selectedGroupValue,
      groupImage: selectedImage?.name,
      presidentName,
      bio,
      instagramUrl,
      facebookUrl,
      twitterUrl,
    };

    const { data: groupsData, error: groupsError } = await supabase.from("groups").select("*").eq('group', selectedGroupValue);
    const groups = groupsData;
    console.log(groups);
    const hasConflict = groups?.map((group: FormState) => group.group === selectedGroupValue);

    if (hasConflict) {
      alert(`Ya existe un perfil para ${selectedGroupValue}`);
      setLoading(false);
      return;
    }

    const { error: errorImage } = await supabase.storage
      .from("profileImages")
      .upload(
        `logos/${selectedGroupValue}/${selectedImage.name}`,
        selectedImage as File
      ); // Cast selectedImage to FileBody
    if (errorImage) {
      console.error("Image error", errorImage);
      setLoading(false);
      return;
    }


    // Save the data to Supabase
    const { data: savedData, error } = await supabase
      .from("groups") // Replace with your table name
      .upsert([data]); // Upsert the data

    if (error) {
      console.error("Error saving data:", error);
    } else {
      console.log("Data saved successfully:", savedData);
      setIsGroupSaved(true);
    }

    setLoading(false);
  };

  const handleFieldChange = (field: keyof FormState, value: string) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const editProfile = async () => {
    setLoading(true);

    if (!selectedImage) {
      console.error("Group image is not defined.");
      setLoading(false);
      return;
    }

    const { error: errorImage } = await supabase.storage
      .from("profileImages")
      .upload(
        `logos/${selectedGroupValue}/${selectedImage.name}`,
        selectedImage as File
      ); // Cast selectedImage to FileBody

    if (errorImage) {
      console.error("Image error", errorImage);
      setLoading(false);
      return;
    }
    const updatedData = {
      group: selectedGroupValue,
      groupImage: selectedImage?.name,
      presidentName,
      bio,
      instagramUrl,
      facebookUrl,
      twitterUrl,
    };

    // Update the data in Supabase
    const { data: updatedProfileData, error } = await supabase
      .from("groups")
      .update(updatedData)
      .eq('group', selectedGroupValue);

    if (error) {
      console.error("Error updating data:", error);
      setLoading(false);
    } else {
      console.log("Data updated successfully:", updatedProfileData);
      setIsGroupSaved(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isGroupSaved) return;
    push(`/profile?group=${selectedGroupValue}`);
  }, [isGroupSaved, push, selectedGroupValue]);

  return searchParams.has("email") ? (
    <main className="min-h-screen p-6">
      <div
        style={{ margin: "0 auto" }}
        className="max-w-3xl flex-grow justify-center items-center md:items-start md:flex gap-10"
      >
        <ImageUpload
          onSubmit={handleImageSubmit}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        <section className="mt-5 md:mt-0">
          <form className="flex flex-col gap-8">
            <GroupSelector
              groups={gruposEstudiantiles}
              setSelectedGroup={setSelectedGroup}
            />
            <Input
              type="text"
              placeholder="Nombre presidente"
              variant="bordered"
              value={presidentName}
              onChange={(e) =>
                handleFieldChange("presidentName", e.target.value)
              }
            />
            <Textarea
              isInvalid={!bio.length}
              variant="bordered"
              label="Description"
              labelPlacement="outside"
              value={bio}
              onValueChange={(value) => handleFieldChange("bio", value)}
              placeholder="Somos un grupo estudiantil que..."
              errorMessage={
                bio.length
                  ? ""
                  : "La descripción debe de ser al menos 255 caracteres de longitud."
              }
              className="max-w-xs"
            />
            {[
              { label: "Instagram", url: "https://instagram.com/" },
              { label: "Facebook", url: "https://www.facebook.com/" },
              { label: "X (Twitter)", url: "https://twitter.com/" },
            ].map((social, idx) => (
              <Input
                key={idx}
                type="url"
                label={`${social.label} URL`}
                placeholder="grupoEstudiantil"
                color="secondary"
                labelPlacement="outside"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">
                      {social.url}
                    </span>
                  </div>
                }
                value={
                  social.label === "Instagram"
                    ? instagramUrl
                    : social.label === "Facebook"
                      ? facebookUrl
                      : twitterUrl
                }
                onChange={(e) =>
                  handleFieldChange(
                    social.label === "Instagram"
                      ? "instagramUrl"
                      : social.label === "Facebook"
                        ? "facebookUrl"
                        : "twitterUrl",
                    e.target.value
                  )
                }
              />
            ))}
            <Button
              variant="solid"
              color="primary"
              onClick={!isEditMode ? handleGuardarClick : editProfile}
              disabled={loading}
              isLoading={loading}
            >
              Guardar
            </Button>
          </form>
        </section>
      </div>
    </main>
  ) : (
    <main className="min-h-screen flex justify-center items-center">
      <CircularProgress color="primary" />
    </main>
  );
}
