"use client";

// import { IKUpload, ImageKitContext } from "imagekitio-next";
import { IKUpload, IKContext } from "imagekitio-react";

import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import ImageKit from "imagekit-javascript"

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // chatgpt
  const authenticator = async () => {
    const res = await fetch("/api/imagekit-auth");
    if(!res.ok) throw new Error("Auth API failed");
    return await res.json();
    // const data =await res.json();
    // console.log("Auth data", data);
  };

  // console.log("PK: ", process.env.NEXT_PUBLIC_PUBLIC_KEY);
  // console.log("URL: ", process.env.NEXT_PUBLIC_URL_ENDPOINT);




  const onError = (err: { message: string }) => {
    setError(err.message);
    setUploading(false);
  };

  const handleSuccess = (response: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    onSuccess(response);
  };


  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentComplete));
    }
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video size must be less than 100MB");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or WebP)");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return false;
      }
    }
    return true;
  };

  return (

    <IKContext
      publicKey={process.env.NEXT_PUBLIC_PUBLIC_KEY!}
      urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT!}
      authenticator={authenticator}
    >

      <div className="space-y-2">
        <IKUpload
          fileName={fileType === "video" ? "video" : "image"}
          onError={onError}
          onSuccess={handleSuccess}
          onUploadStart={handleStartUpload}
          onUploadProgress={handleProgress}
          accept={fileType === "video" ? "video/*" : "image/*"}
          className="file-input file-input-bordered w-full"
          validateFile={validateFile}
          useUniqueFileName={true}
          folder={fileType === "video" ? "/videos" : "/images"}

        />

        {uploading && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Uploading...</span>
          </div>
        )}

        {error && <div className="text-error text-sm">{error}</div>}
      </div>
    </IKContext>
  );
}
