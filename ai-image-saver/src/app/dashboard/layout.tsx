"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { Header } from "@/components/Header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") return <div>Loading...</div>;

  if (!session) return <></>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-8">
        <Tabs>
          <div className="flex flex-row gap-4">
            <Link href="/dashboard">
              <Button variant="default">Generate</Button>
            </Link>
            <TabsList className="mb-8 border border-grey-300">
              <Link href="/dashboard/images">
                <TabsTrigger value="images">My Images</TabsTrigger>
              </Link>
              <Link href="/dashboard/albums">
                <TabsTrigger value="albums">My Albums</TabsTrigger>
              </Link>
            </TabsList>
          </div>
          {children}
        </Tabs>
      </main>
    </div>
  );
}
