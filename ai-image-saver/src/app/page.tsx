import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <h1 className="text-4xl font-bold mb-4">AI Image Generator</h1>
      <p className="text-xl mb-8">
        Create, save, and organize AI-generated images
      </p>
      <Link href="/dashboard">
        <Button size="lg">Generate Your First Image</Button>
      </Link>
    </div>
  );
}
