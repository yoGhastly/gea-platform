"use client";
import React, { useEffect, useState } from "react";
import { GroupSelector, ImageUpload } from "../components";
import { Button, Code, Input, Textarea } from "@nextui-org/react";
import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL, gruposEstudiantiles } from "../constants";

export default function CrearPost() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [postSaved, setIsPostSaved] = useState(false);
  const [showPostUrl, setShowPostUrl] = useState(false);
  const [postId, setPostId] = useState("");
  const [loading, setLoading] = useState(false);

  function getCurrentDateTime(): string {
    const currentDate = new Date();

    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Note: Months are zero-based
    const year = currentDate.getFullYear().toString();

    const hour = currentDate.getHours().toString().padStart(2, '0');
    const minute = currentDate.getMinutes().toString().padStart(2, '0');
    const second = currentDate.getSeconds().toString().padStart(2, '0');

    // Concatenate date and time components with underscores
    const formattedDateTime = `${day}_${month}_${year}-${hour}-${minute}-${second}`;

    return formattedDateTime;
  }

  const savePost = async () => {
    if (!selectedImage || !selectedGroup || !description || !title) {
      alert(`Todos los campos deben ser llenados`);
      return;
    }
    try {
      setLoading(true);
      const postId = uuidv4();
      setPostId(postId);
      const formattedDate = getCurrentDateTime();
      const filename = selectedImage?.name;
      const { error } = await supabase.storage
        .from("postImages")
        .upload(
          `images/${selectedGroup}_${formattedDate}/${selectedImage?.name}`,
          selectedImage as File
        );

      if (error) {
        console.error("Failed to save post image", error);
        alert("El archivo seleccionado no pudo ser guardado, intenta que el nombre no contenga espacios o caracteres especiales.");
        setLoading(false);
        return;
      }

      const data = {
        postId,
        date: formattedDate,
        image: filename,
        title,
        group: selectedGroup,
        description,
      };

      const res = await fetch(`${BASE_URL}/api/`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        console.warn("Could not save post", res.statusText);
        alert("No se pudo guardar el post, intenta nuevamente.");
      } else {
        setLoading(false);
        setIsPostSaved(true);
      }
    } catch (error) {
      alert("No se pudo guardar el post, intenta nuevamente.");
      console.error("Failed to save post", error);
    }
  };

  useEffect(() => {
    if (postSaved) {
      setShowPostUrl(true);
      return;
    }
  }, [postSaved]);

  return (
    <main className="min-h-screen">
      <div
        style={{ margin: "0 auto" }}
        className="flex flex-col justify-center items-center gap-10 min-h-screen"
      >
        <section className="flex flex-col md:flex-row gap-10">
          <ImageUpload
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            onSubmit={savePost}
          />
          <div className="flex flex-col gap-5">
            <GroupSelector
              groups={gruposEstudiantiles}
              setSelectedGroup={setSelectedGroup}
            />
            <Input
              label="Título"
              type="text"
              value={title}
              onValueChange={setTitle}
              color="secondary"
              variant="flat"
            />
            <Textarea
              isInvalid={!description.length}
              variant="bordered"
              label="Descripción"
              labelPlacement="outside"
              size="md"
              value={description}
              onValueChange={setDescription}
              errorMessage={
                description.length
                  ? ""
                  : "La descripción debe de ser al menos 255 caracteres de longitud."
              }
              className="max-w-xs"
            />
            <Button
              variant="solid"
              color="secondary"
              size="md"
              onClick={savePost}
              isLoading={loading}
            >
              Guardar Post
            </Button>
          </div>
        </section>
        <div className={`${showPostUrl ? "flex flex-col gap-2" : "hidden"}`}>
          <p>Listo! Tu Post se ha creado correctamente, este es su link:</p>
          <Code color="primary" as="a" href={`${BASE_URL}/blog/${encodeURI(postId)}`} target="_blank">
            {`${BASE_URL}/blog/${encodeURI(postId)}`}
          </Code>
        </div>
      </div>
    </main>
  );
}
