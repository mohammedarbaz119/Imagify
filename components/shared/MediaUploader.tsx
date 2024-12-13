"use client";

import { useToast } from "@/hooks/use-toast";

import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

type MediaUploaderprops = {
  onValueChange: (value: string) => void;
  publicId: string;
  image: any;
  type: string;
  setImage: React.Dispatch<any>;
};
const MediaUploader = ({
  onValueChange,
  publicId,
  image,
  type,
  setImage,
}: MediaUploaderprops) => {
  const { toast } = useToast();

  const onUploadSuccessHandler = (result: any) => {
    setImage((prev: any) => ({
      ...prev,
      publicId: result?.info.public_id,
      width: result?.info.width,
      height: result?.info.height,
      secureUrl: result?.info.secure_url,
    }));
    onValueChange(result?.info.public_id);
    toast({
      title: "Image Uploaded Successfuly",
      description: "1 credit was deducted from your account",
      duration: 5000,
      className: "success-toast",
    });
  };

  const onUploadErrorHandler = (result: any) => {
    toast({
      title: "Something went wrong while Uploading ",
      description: "Please Try again",
      duration: 5000,
      className: "error-toast",
    });
  };

  return (
    <CldUploadWidget
      uploadPreset="next_imagify"
      options={{
        resourceType: "image",
        multiple: false,
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ widget, open, cloudinary }) => {
        return (
          <div className="flex flex-col gap-4">
            <h3 className="h3-bold text-dark-500">Original</h3>
            {publicId ? (
              <>
                <div className="cursor-pointer overflow-hidden rounded-[10px]">
                  <CldImage
                    width={getImageSize(type, image, "width")}
                    height={getImageSize(type, image, "height")}
                    alt="Uploaded IMage"
                    src={publicId}
                    sizes={"(max-width: 767px) 100vw,50vw"}
                    placeholder={dataUrl as PlaceholderValue}
                    className="media-uploader_cldImage"
                  />
                </div>
                <Button
                  onClick={() => {
                    setImage(null);
                    onValueChange("");
                  }}
                >
                  Remove Image
                </Button>
              </>
            ) : (
              <div className="media-uploader_cta" onClick={() => open()}>
                <div className="media-uploader_cta-image">
                  <Image
                    src={"/assets/icons/add.svg"}
                    alt="Ad Image"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="p-14-medium">Upload Image</p>
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default MediaUploader;
