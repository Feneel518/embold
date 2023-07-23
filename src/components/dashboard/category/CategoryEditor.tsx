"use client";

import { FC, useEffect, useState } from "react";
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
import Select from "react-select";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategoryCreationRequest,
  CategoryValidator,
} from "@/lib/validators/Category";
import { toast } from "@/components/hooks/use-toast";
import { uploadToS3 } from "@/lib/s3";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpFromLine, Home } from "lucide-react";
import { category } from "@/types/Category";
import DeleteModal from "@/components/Modal/DeleteModal";

interface CategoryEditorProps {
  categories: category[];
  category: category | null;
}

const CategoryEditor: FC<CategoryEditorProps> = ({ categories, category }) => {
  const router = useRouter();

  let defaultValues = {};

  if (category) {
    defaultValues = {
      id: category.id,
      name: category.name,
      slug: "",
      image: category.image,
      parentId: category.parentId ?? "",
      showOnHome: category.showOnHome,
      isActive: category.isActive,
    };
  } else {
    defaultValues = {
      name: "",
      slug: "",
      image: "",
      parentId: "",
      showOnHome: false,
      isActive: false,
    };
  }

  // useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryCreationRequest>({
    resolver: zodResolver(CategoryValidator),
    defaultValues,
  });
  // useEffect to check for errors
  useEffect(() => {
    if (Object.keys(errors).length) {
      console.log(errors);

      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong.",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  const { isLoading, mutate: createCategory } = useMutation({
    mutationFn: async ({
      name,
      image,
      slug,
      parentId,
      showOnHome,
    }: CategoryCreationRequest) => {
      const payload: CategoryCreationRequest = category
        ? {
            id: category.id,
            name,
            image,
            slug,
            parentId,
            showOnHome,
            isActive,
          }
        : {
            name,
            image,
            slug,
            parentId,
            showOnHome,
            isActive,
          };
      let data;

      if (category) {
        console.log(payload);

        data = await axios.put("/api/dashboard/category/update", payload);
      } else if (!category) {
        console.log(payload);

        data = await axios.post("/api/dashboard/category/create", payload);
      }

      return data?.data as string;
    },
    // if error
    onError: (err) => {
      if (err instanceof AxiosError) {
        console.log(err);

        if (err.response?.status === 407) {
          return toast({
            title: "Could not update category.",
            description: "Category cannot be a parent ctegory of itself",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "Something went wrong.",
        description: "Your category was not added. Please try again.",
        variant: "destructive",
      });
    },
    // on success
    onSuccess: () => {
      router.push("/dashboard/categories");

      router.refresh();

      return toast({
        description: "New Category has been added",
      });
    },
  });

  // Submit handler
  const onSubmit = async (
    data: CategoryCreationRequest,
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    const key = await uploadToS3(e);

    const payload: CategoryCreationRequest = {
      name: data.name,
      image: key === null ? (category?.image as string) : key,
      parentId: parent,
      slug: data.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, ""),
      showOnHome: showHome,
      isActive: isActive,
    };

    createCategory(payload);
  };

  const [showHome, setShowHome] = useState<boolean>(
    category ? category.showOnHome : false
  );
  const [isActive, setIsActive] = useState<boolean>(
    category ? category.isActive : false
  );

  // select values
  const [parent, setParent] = useState<string>("");
  const handleParent = ({ value }: { value: string }) => {
    setParent(value);
  };

  return (
    <div className="">
      {/* @ts-ignore */}
      <form onSubmit={handleSubmit((data, e) => onSubmit(data, e))}>
        <div className="flex gap-20">
          <Card className="w-2/3">
            <CardHeader>
              <CardTitle>Add Category</CardTitle>
              <CardDescription>category information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    {...register("name")}
                    id="name"
                    placeholder="Enter category name"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="parentCategory">
                    Parent Category (if any)
                  </Label>
                  <Select
                    defaultValue={
                      category?.parentId
                        ? {
                            // @ts-ignore
                            label: category?.parent.name,
                            value: category?.parentId,
                          }
                        : ""
                    }
                    id="parentCategory"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        border: "1px solid hsl(240 5.9% 90%)",
                        height: "2.5rem",
                        boxShadow: state.isFocused ? "0" : "0",
                        "&:hover": {
                          border: "1px solid hsl(var(--input))",
                        },
                      }),
                    }}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary25: "#CDEAEC",
                      },
                    })}
                    options={categories.map((cate) => {
                      return { label: cate.name, value: cate.id };
                    })}
                    // @ts-ignore
                    onChange={handleParent}
                  ></Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="picture">Category Image</Label>
                  <Input
                    className="cursor-pointer"
                    accept="image/*"
                    id="picture"
                    type="file"
                    name="file"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/categories")}
              >
                Cancel
              </Button>
              <div className="flex gap-6 items-center">
                {category && (
                  <DeleteModal
                    name={category.name}
                    id={category.id}
                  ></DeleteModal>
                )}
                <Button className="w-40" isLoading={isLoading} type="submit">
                  {category ? "Update" : "Save"}
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/*  */}
          <Card className="">
            <CardHeader>
              <CardTitle>Additional Data</CardTitle>
              <CardDescription>Set to draft, if not changed</CardDescription>
            </CardHeader>
            {/* @ts-ignore */}
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Add to homepage?</Label>
                  <div
                    className={`cursor-pointer border border-input  h-10 px-3 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors ${
                      showHome
                        ? "bg-embold text-white hover:bg-embold"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setShowHome(!showHome)}
                  >
                    <Home className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="parentCategory">Publish?</Label>
                  <div
                    className={`cursor-pointer border border-input  h-10 px-3 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors ${
                      isActive
                        ? "bg-embold text-white hover:bg-embold"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setIsActive(!isActive)}
                  >
                    <ArrowUpFromLine className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CategoryEditor;
