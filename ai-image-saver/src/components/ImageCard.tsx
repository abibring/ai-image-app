import Image from "next/image";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";

interface ImageCardProps {
  image: {
    id: string;
    url: string;
    prompt: string;
    createdAt: string;
  };
  onDelete: () => void;
}

export function ImageCard({ image, onDelete }: ImageCardProps) {
  return (
    <Card className="flex flex-row">
      <CardContent className="p-2">
        <Image
          src={image.url}
          alt={image.prompt}
          width={300}
          height={300}
          className="rounded-lg min-w-[300px] min-h-[300px]"
        />
      </CardContent>
      <CardFooter className="flex justify-between w-full">
        <p className="text-sm max-w-[40vw]">{image.prompt}</p>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
