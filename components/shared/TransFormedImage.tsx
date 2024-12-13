import React from "react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { dataUrl, debounce, getImageSize } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import { useToast } from "@/hooks/use-toast";
export default function TransFormedImage({
  image,
  type,
  title,
  transformationConfig,
  isTransforming,
  setIsTransforming,
  hasDownload = true,
}: TransformedImageProps) {
  const downloadHanlder = () => {};
  const { toast } = useToast();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="h3-bold text-dark-600">Transformed</h3>
        {hasDownload && (
          <button className="download-btn" onClick={downloadHanlder}>
            <Image
              src={"/assets/icons/download.svg"}
              alt="download"
              width={24}
              height={24}
              className="pb-[6px]"
            />
            Download
          </button>
        )}
      </div>

      {image?.publicId && transformationConfig ? (
        <div className="relative">
          <CldImage
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            alt={title}
            src={image?.publicId}
            sizes={"(max-width: 767px) 100vw,50vw"}
            onError={(e) => {
              toast({
                title: "Can't Transform Image",
                description: `Problem might be due to transparent image in generative fill So please upload Another Image`,
                duration: 5000,
                className: "error-toast",
              });
              debounce(() => {
                setIsTransforming && setIsTransforming(false);
              }, 8000)();
            }}
            onLoad={() => {
              console.log("running");
              setIsTransforming && setIsTransforming(false);
            }}
            placeholder={dataUrl as PlaceholderValue}
            className="media-uploader_cldImage"
            {...transformationConfig}
          />
          {isTransforming && (
            <div className="transforming-loader">
              <Image
                src={"/assets/icons/spinner.svg"}
                alt="Transforming.."
                width={50}
                height={50}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="transformed-placeholder">Transformed Image</div>
      )}
    </div>
  );
}
