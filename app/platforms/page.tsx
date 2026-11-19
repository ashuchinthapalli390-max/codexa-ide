import type { Metadata } from "next";
import { PlatformsPage } from "@/components/experience/PlatformsPage";

export const metadata: Metadata = {
  title: "Platforms",
  description: "CodeXa Studio IDE availability on Windows, macOS, Linux, Android and iOS, with release history.",
};

export default function Page() {
  return <PlatformsPage crumb="Platforms" />;
}
