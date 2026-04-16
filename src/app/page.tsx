import { redirect } from "next/navigation";

export default function RootPage() {
  // Since our layout and dashboard are in (dashboard) route group,
  // we can also use that group's page as the root.
  // But to be explicit and avoid any potential layout issues, 
  // we redirect to make sure the user enters the protected area.
  redirect("/dashboard");
}
