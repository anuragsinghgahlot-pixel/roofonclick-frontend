"use client";

import * as React from "react";
import { redirect } from "next/navigation";

export default function RegisterPage() {
  React.useEffect(() => {
    redirect("/signup");
  }, []);

  return null;
}
