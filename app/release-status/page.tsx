import type { Metadata } from "next";
import { PlatformsPage } from "@/components/experience/PlatformsPage";

export const metadata: Metadata = {
  title: "Release Status",
  description: "Live build status, versions and checksums for each CodeXa Studio IDE platform.",
};

export default function Page() {
  return <PlatformsPage crumb="Release status" />;
}
