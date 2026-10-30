import type { Metadata } from "next";
import { getHomePage } from "@/lib/data/home";

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = await getHomePage();
  return {
    title: { absolute: title },
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default function Home() {
  return <main id="main" />;
}
