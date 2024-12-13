"use client";
import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { InsufficientCreditsModal } from "../InSufficientCreditsModal";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  aspectRatioOptions,
  creditFee,
  defaultValues,
  transformationTypes,
} from "@/constants";
import CustomField from "./CustomField";
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils";
import { updateCredits } from "@/lib/actions/users.actions";
import MediaUploader from "./MediaUploader";
import TransFormedImage from "./TransFormedImage";
import { getCldImageUrl } from "next-cloudinary";
import { addImage, updateImage } from "@/lib/actions/image.actions";
import { useRouter } from "next/navigation";

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

export default function TransformationForm({
  action,
  data = null,
  type,
  userId,
  creditBalance,
  config = null,
}: TransformationFormProps) {
  const transformationtype = transformationTypes[type as TransformationTypeKey];
  const [image, setImage] = useState(data);
  const router = useRouter();
  const [transformations, settransformations] =
    useState<Transformations | null>(null);
  const [IsSubmitting, setISSubmitting] = useState(false);
  const [IsTransfroming, setIstransforming] = useState(false);
  const [transformationConfig, settransformationConfig] = useState(config);
  const [ispending, startTransition] = useTransition();
  const initialValues =
    data && action === "Update"
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setISSubmitting(true);
    if (data || image) {
      const TransformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig,
      });
      const imagedata = {
        title: values.title,
        publicId: values.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureURL: image?.secureUrl,
        transformationURL: TransformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
      };
      console.log(values);
      if (action === "Add") {
        try {
          const newImage = await addImage({
            image: imagedata,
            userId: userId,
            path: "/",
          });
          if (newImage) {
            form.reset();
            setImage(data);
            router.push(`/transformations/${newImage._id}`);
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (action === "Update") {
        try {
          const newImage = await updateImage({
            image: { ...imagedata, _id: data._id },
            userId: userId,
            path: `/transformations/${data._id}`,
          });
          if (newImage) {
            router.push(`/transformations/${data._id}`);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    setISSubmitting(false);
  }

  const OnSelectFieldHandler = (
    value: string,
    OnChange: (value: string) => void
  ) => {
    const Imagesize = aspectRatioOptions[value as AspectRatioKey];
    setImage((prev: any) => ({
      ...prev,
      aspectRatio: Imagesize.aspectRatio,
      width: Imagesize.width,
      height: Imagesize.height,
    }));
    settransformations(transformationtype.config);
    return OnChange(value);
  };

  const OnInputFieldChangeHandler = (
    fieldName: string,
    value: string,
    type: string,
    handler: (value: string) => void
  ) => {
    debounce(() => {
      settransformations((prev: any) => ({
        ...prev,
        [type]: {
          ...prev?.[type],
          [fieldName === "prompt" ? "prompt" : "to"]: value,
        },
      }));
      handler(value);
      return;
    }, 1000)();
  };

  //TODO implement update credits
  const onTransformHandler = async () => {
    setIstransforming(true);
    settransformationConfig(
      deepMergeObjects(transformations, transformationConfig)
    );
    settransformations(null);
    startTransition(() => {
      updateCredits(userId, -1);
    });
  };

  useEffect(() => {
    if (image && (type === "restore" || type === "removeBackground")) {
      settransformations(transformationtype.config);
    }
  }, [image, transformationtype.config, type]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          render={({ field }) => <Input {...field} className="input-field" />}
        />

        {type === "fill" && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className="w-full"
            render={({ field }) => (
              <Select
                onValueChange={(value) =>
                  OnSelectFieldHandler(value, field.onChange)
                }
              >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className="select-item">
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {(type === "remove" || type === "recolor") && (
          <div className="prompt-field">
            <CustomField
              control={form.control}
              name="prompt"
              formLabel={
                type === "remove" ? "Object to remove" : "Object to recolor"
              }
              className="w-full"
              render={({ field }) => (
                <Input
                  onChange={(e) =>
                    OnInputFieldChangeHandler(
                      "prompt",
                      e.target.value,
                      type,
                      field.onChange
                    )
                  }
                />
              )}
            />
            {type === "recolor" && (
              <CustomField
                control={form.control}
                name="color"
                formLabel={"Replacement Color"}
                className="w-full"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChange={(e) =>
                      OnInputFieldChangeHandler(
                        "color",
                        e.target.value,
                        "recolor",
                        field.onChange
                      )
                    }
                  />
                )}
              />
            )}
          </div>
        )}
        <div className="media-uploader-field">
          <CustomField
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            )}
          />
          <TransFormedImage
            image={image}
            type={type}
            title={form.getValues("title")}
            isTransforming={IsTransfroming}
            setIsTransforming={setIstransforming}
            transformationConfig={transformationConfig}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            className="submit-button capitalize"
            disabled={IsTransfroming || transformations === null}
            onClick={onTransformHandler}
          >
            {IsTransfroming ? "Transforming..." : "Apply Transformation"}
          </Button>{" "}
          <Button
            type="submit"
            className="submit-button capitalize"
            disabled={IsSubmitting}
          >
            {IsSubmitting ? "Submitting" : "Save Image"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
