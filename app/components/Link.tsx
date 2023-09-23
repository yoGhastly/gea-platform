import React, { CSSProperties, ReactNode } from "react";
import Link from "next/link";


interface Props {
  href: string;
  style?: CSSProperties;
  className?: string;
  children: ReactNode
}

export const CustomLink: React.FC<Props> = ({ href, style, className, children }) => {
  return (
    <Link href={href} style={style} className={`hover:text-primary ${className}`}>{children}</Link>
  )
}
