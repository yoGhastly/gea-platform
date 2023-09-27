import React, { ReactNode } from "react";
import "../styles/post.css";

export const HeaderGradient = ({ children }: { children: ReactNode }) => {
  return (
    <header className="w-full pt-3 px-6 article-hero-bg">{children}</header>
  );
};
