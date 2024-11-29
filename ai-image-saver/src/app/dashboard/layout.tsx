"use client";

import { Header } from "@/components/Header";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [value, setValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs>
          {/* <TabsTrigger
            onChange={(e) => setValue((e.target as HTMLButtonElement).value)}
            value={value}
            defaultValue="generate"
            className="w-full"
          /> */}
          <TabsList className="mb-8">
            <Link href="/dashboard">
              <TabsTrigger value="generate">Generate</TabsTrigger>
            </Link>
            <Link href="/dashboard/images">
              <TabsTrigger value="images">My Images</TabsTrigger>
            </Link>
            <Link href="/dashboard/albums">
              <TabsTrigger value="albums">My Albums</TabsTrigger>
            </Link>
          </TabsList>
          {children}
        </Tabs>
      </main>
    </div>
  );
}
