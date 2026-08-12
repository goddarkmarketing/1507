import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

/** Static-export root → default locale (no middleware on GitHub Pages). */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}/`);
}
