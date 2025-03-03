import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

const UploadedFiles = ({
  image,
  onChange,
}: {
  image?: {
    url: string;
    type: "file_preview" | "uploaded";
  };
  onChange: (files: File[]) => void;
}) => {
  if (!image) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded files</CardTitle>
        <CardDescription>View the uploaded files here</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-max space-x-2.5">
          <div className="relative aspect-video w-64">
            {image.type == "file_preview" && (
              <div className="opacity-0 hover:opacity-100 bg-black/50 absolute inset-0 z-10 transition-all">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Button
                    onClick={() => onChange([])}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash size={24} />
                  </Button>
                </div>
              </div>
            )}
            <img
              src={image.url}
              alt="Product Image"
              loading="lazy"
              className="rounded-md object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadedFiles;
