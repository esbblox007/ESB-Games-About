import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SupportTicketClient from "@/components/SupportTicketClient";

export const metadata: Metadata = {
  title: "Private Support Ticket",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default async function SupportTicketPage({ params }: { params: Promise<{ accessToken: string }> }) {
  const { accessToken } = await params;
  return <PageShell><SupportTicketClient accessToken={accessToken} /></PageShell>;
}
