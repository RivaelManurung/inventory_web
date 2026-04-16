"use client";

import { useHeader } from "@/context/HeaderContext";
import { useEffect } from "react";

export default function HeaderTitle({ title }: { title: string }) {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  return null;
}
