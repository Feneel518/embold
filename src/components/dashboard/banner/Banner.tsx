"use client";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

import { FC, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

import { useForm } from "react-hook-form";
import {
  BannerCreationRequest,
  BannerValidator,
} from "@/lib/validators/Banner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import { uploadToS3 } from "@/lib/s3";
import Lists from "@/components/dashboard/List/Lists";

interface BannerProps {}

const Banner: FC<BannerProps> = ({}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BannerCreationRequest>({
    resolver: zodResolver(BannerValidator),
    defaultValues: {
      heading: "Get 200rs discount on every purchase",
      image: "",
    },
  });

  // useEffect to check for errors
  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong.",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  const { mutate: createBanner } = useMutation({
    mutationFn: async ({ heading, image }: BannerCreationRequest) => {
      const payload: BannerCreationRequest = {
        heading,
        image,
      };

      const { data } = await axios.post(
        "/api/dashboard/banner/create",
        payload
      );

      return data as string;
    },
    // if error
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 407) {
          return toast({
            title: "Could not update banner.",
            description: "try again later",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "Something went wrong.",
        description: "Your banner was not uploaded. Please try again.",
        variant: "destructive",
      });
    },
    // on success
    onSuccess: () => {
      router.push("/dashboard/home");

      router.refresh();

      return toast({
        description: "New Banner has been added",
      });
    },
  });

  const [isloading, setIsLoading] = useState<boolean>(false);

  const handleBanner = async (
    data: BannerCreationRequest,
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    setIsLoading(true);
    const key = await uploadToS3(e);
    setIsLoading(false);

    const payload: BannerCreationRequest = {
      heading: data.heading,
      image: key,
    };
    createBanner(payload);
  };

  return (
    <div>
      {" "}
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Banner</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Banner</CardTitle>
              <CardDescription>
                Make changes to your Banner here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <form
              action=""
              // @ts-ignore
              onSubmit={handleSubmit((data, e) => handleBanner(data, e))}
            >
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Banner Heading</Label>
                  <Input {...register("heading")} id="name" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="picture">Username</Label>
                  <Input
                    multiple
                    accept="image/*"
                    id="picture"
                    type="file"
                    name="file"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button isLoading={isloading}>Save changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* another tab */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Banner;
