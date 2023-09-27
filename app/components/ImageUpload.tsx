'use client';
import React, { SetStateAction } from 'react';
import { Button } from '@nextui-org/react';
import { useState, ChangeEvent, FormEvent } from 'react';

interface ImageUploadProps {
  onSubmit: (image: File) => void;
  selectedImage: File | null;
  setSelectedImage: React.Dispatch<SetStateAction<File | null>>;
}

export const ImageUpload = ({ onSubmit, selectedImage, setSelectedImage }: ImageUploadProps) => {

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("file selected", file);
      setSelectedImage(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedImage) {
      onSubmit(selectedImage);
    }
  };

  return (
    <div className="w-full max-w-[370px] h-[300px] border-2 border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-5">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="imageInput" // Use this for the label
        />
        <label
          htmlFor="imageInput"
          className="w-full h-48 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
        >
          {selectedImage ? (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Uploaded"
              className="max-w-full max-h-full"
            />
          ) : (
            <span className="text-gray-400">Seleccionar Imágen</span>
          )}
        </label>
      </form>
    </div>
  );
}

export default ImageUpload;
