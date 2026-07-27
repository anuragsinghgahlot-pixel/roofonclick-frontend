import { redirect } from "next/navigation";

export default function MyPropertiesRedirectPage() {
  redirect("/owner/dashboard");
}
