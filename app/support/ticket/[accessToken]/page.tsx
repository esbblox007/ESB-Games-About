import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SupportTicketClient from "@/components/SupportTicketClient";
import SupportPrivateTicketNavigation from "@/components/SupportPrivateTicketNavigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Private Support Ticket",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default async function SupportTicketPage({ params }: { params: Promise<{ accessToken: string }> }) {
  const { accessToken } = await params;
  return <PageShell><SupportPrivateTicketNavigation /><SupportTicketClient accessToken={accessToken} /></PageShell>;
}
