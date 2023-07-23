"use client";

import {
  FC,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/hooks/use-toast";
import { uploadMultipleToS3, uploadToS3 } from "@/lib/s3";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpFromLine, Home, X } from "lucide-react";
import { category } from "@/types/Category";
import type EditorJS from "@editorjs/editorjs";
import { Switch } from "@/components/ui/switch";
import { ProductCreationRequest } from "@/lib/validators/Product";
import Variants from "./Variants";
import VariantsTable from "./VariantsTable";
import { Product } from "@prisma/client";
import DeleteModal from "@/components/Modal/DeleteModal";
import Image from "next/image";

interface ProductEditorProps {
  categories: category[];
  product: {
    id: string;
    categoriesOnProducts: [
      {
        category: {
          id: string;
          name: string;
        };
        id: string;
        productId: string;
        categoryId: string;
      }
    ];
    description: any;
    isActive: boolean;
    name: string;
    slug: string;
    colour: [
      {
        label: string;
        value: string;
      }
    ];
    size: [string];
    Image: [
      {
        id: string;
        url: string;
        altText: string;
      }
    ];
    Inventory: [
      {
        sku: string;
        discountedPrice: number;
        id: string;
        isActive: boolean;
        price: number;
        AttributesOnInventory: [
          {
            id: string;
            attributeValueId: string;
            attributeValue: {
              attribute: {
                name: string;
              };
              value: string;
              name: string;
            };
          }
        ];
      }
    ];
  } | null;
}

const ProductEditor: FC<ProductEditorProps> = ({ categories, product }) => {
  const router = useRouter();

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  //   what u see what u get
  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const _titleRef = useRef<HTMLTextAreaElement>(null);

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Enter the product description",
        inlineToolbar: true,
        data: product ? product.description : { blocks: [] },
        tools: {
          header: Header,
          list: List,
          table: Table,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);
  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();
      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  // select values for categories
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const handleCategory = (value: { label: string; value: string }[]) => {
    setSelectedCategory(value.map((val) => val.value));
  };

  const [colour, setColour] = useState<{ label: string; value: string }[]>();
  const [size, setSize] = useState<string[]>();

  const values = (
    colour: { label: string; value: string }[],
    size: string[]
  ) => {
    useEffect(() => {
      setColour(colour);
      setSize(size);
    }, [colour, size]);
  };

  let numbeOfSubProducts;
  let results: string[] = [];
  let inventorySubproducts: any = [];

  if (colour !== undefined && size) {
    numbeOfSubProducts = colour.length * size.length;
    size.map((size) => {
      colour.map((colo) => {
        results.push(`${colo.value} | ${size}`);
      });
    });

    if (product) {
      inventorySubproducts = product.Inventory.map((prod) => {
        return {
          price: prod.price as number,
          discountedPrice: prod.discountedPrice as number,
          quantity: 0 as number,
        };
      });
    } else if (!product) {
      inventorySubproducts = Array.from(Array(numbeOfSubProducts).keys()).map(
        (i) => ({
          price: 0,
          discountedPrice: 0,
          quantity: 0,
          image: "",
        })
      );
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  // react hook form

  let defaultValues = {};
  if (product) {
    defaultValues = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      categoryIds: product.categoriesOnProducts.map((cate) => cate.categoryId),
      inventory: inventorySubproducts,
      sizeValues: product.size,
      colourValues: product.colour,
    };
  } else {
    defaultValues = {
      name: "",
      description: null,
      slug: "",
      categoryIds: [],
      sizeValues: [""],
      colourValues: [{ label: "", value: "" }],
      inventory: inventorySubproducts,
    };
  }

  const method = useForm<ProductCreationRequest>({
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (Object.keys(method.formState.errors).length) {
      for (const [_key, value] of Object.entries(method.formState.errors)) {
        console.log(method.formState.errors);

        toast({
          title: "Something went wrong.",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [method.formState.errors]);

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  // transtack query to post data

  const { mutate: createProduct } = useMutation({
    mutationFn: async ({
      name,
      description,
      slug,
      categoryIds,
      isActive,
      colourValues,
      sizeValues,
      inventory,
      images,
    }: ProductCreationRequest) => {
      const payload: ProductCreationRequest = {
        id: product?.id,
        name,
        description,
        slug,
        categoryIds,
        isActive,
        colourValues,
        sizeValues,
        inventory,
        images,
      };

      if (product) {
        setIsLoading(true);

        const { data } = await axios.put(
          "/api/dashboard/products/update",
          payload
        );

        setIsLoading(false);
      } else if (!product) {
        setIsLoading(true);

        const { data } = await axios.post(
          "/api/dashboard/products/create",
          payload
        );

        setIsLoading(false);
        return data as string;
      }
    },
    onError(err) {
      setIsLoading(false);
      console.log(err);
    },
    onSuccess: () => {
      router.push("/dashboard/products");

      router.refresh();
      method.reset();

      return toast({
        description: "Your product has been added",
      });
    },
  });

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  // State to set active
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [key, setKey] = useState<string[]>(
    product?.Image ? product.Image.map((url) => url.url) : []
  );
  const uploadImages = async (
    e: UIEvent & { target: HTMLInputElement & { files: Array<string> } }
  ) => {
    const files = e.target.files;
    setIsLoading(true);
    if (files.length > 0) {
      const data = new FormData();
      for (const file of files) {
        // @ts-ignore
        const link = await uploadMultipleToS3(file);

        setKey((prev) => [...prev, link]);
      }
      setIsLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  // Submit Handler of form

  async function onSubmit(data: any) {
    const blocks = await ref.current?.save();

    const payload: ProductCreationRequest = {
      name: data.name,
      description: blocks,
      slug: data.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, ""),
      categoryIds: selectedCategory,
      isActive: isActive,
      colourValues: colour,
      sizeValues: size,
      inventory: data.inventory,
      images: key,
    };

    createProduct(payload);
  }

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  useEffect(() => {
    if (results.length !== 0) {
      setIsDisabled(true);
    } else if (results.length === 0) {
      setIsDisabled(false);
    }
  }, [results]);

  const handleRemoveImage = (index: number) => {
    setKey((prev) => {
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetForm = () => {
    method.reset();
    setKey([]);
    setIsDisabled(false);
    setIsActive(false);
    setColour([]);
    setSize([]);
  };
  return (
    <div className="mb-40">
      <form
        action=""
        className="grid gap-10"
        onSubmit={method.handleSubmit(onSubmit)}
      >
        <FormProvider {...method}>
          <div className="flex gap-10 flex-col lg:flex-row">
            <div className="flex flex-col gap-10 w-2/3">
              {/* ////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////// */}
              {/* main */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Add Product</CardTitle>
                  <CardDescription>product information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        {...method.register("name", {
                          required: "name is required",
                        })}
                        id="name"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col w-full space-y-1.5">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          placeholder="Enter price"
                          disabled={isDisabled}
                        />
                      </div>
                      <div className="flex flex-col w-full space-y-1.5">
                        <Label htmlFor="discountedPrice">
                          Discounted Price
                        </Label>
                        <Input
                          id="discountedPrice"
                          placeholder="Enter discounted price"
                          disabled={isDisabled}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-full space-y-1.5">
                      <Label htmlFor="price">Description</Label>
                      <div
                        className="min-h-[300px] border p-2 rounded-lg "
                        id="editor"
                      ></div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Product Category</Label>
                      <Select
                        // @ts-ignore
                        defaultValue={
                          product
                            ? product?.categoriesOnProducts.map((category) => {
                                return {
                                  label: category.category.name,
                                  value: category.category.id,
                                };
                              })
                            : ""
                        }
                        isMulti
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
                        onChange={handleCategory}
                      ></Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* ////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////// */}
              {/* media */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Product Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    {product && <label htmlFor="">Old images</label>}
                    {product && (
                      <div className="">
                        <div className="flex space-x-4">
                          {product.Image.map((image, index) => {
                            return (
                              <div className="relative">
                                <Image
                                  src={image.url}
                                  width={100}
                                  height={100}
                                  alt="Image"
                                ></Image>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {key.length !== 0 && (
                      <label htmlFor="">Change or Delete Images</label>
                    )}
                    <div className="flex space-x-4">
                      {key.map((url, index) => {
                        return (
                          <div className="relative">
                            <div
                              onClick={() => handleRemoveImage(index)}
                              className="absolute -right-2 bg-embold/70 rounded-full cursor-pointer p-1 -top-4"
                            >
                              <X></X>
                            </div>
                            <Image
                              src={url}
                              width={100}
                              height={100}
                              alt="Image"
                            ></Image>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="image">Product Image</Label>
                      <Input
                        id="image"
                        type="file"
                        className="cursor-pointer"
                        multiple
                        // @ts-ignore
                        onChange={uploadImages}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* //////////////////////////////////////////////////////////////////////// */}
              {/* //////////////////////////////////////////////////////////////////////// */}
              {/* Shipping and Tax */}
              <Card className="w-full ">
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-2xl font-semibold leading-none tracking-tight">
                        Shipping & Tax
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-2 grid w-64 items-center gap-4">
                          <div className="flex flex-col w-full space-y-1.5">
                            <Label htmlFor="weight">Shipment Weight</Label>
                            <div className="flex items-center gap-4">
                              <Input id="weight" placeholder="Enter weight" />
                              <label className="text-xl" htmlFor="">
                                Kg
                              </label>
                            </div>
                          </div>
                          <div className="flex flex-col w-full space-y-1.5">
                            <Label htmlFor="hsn">HSN Code</Label>
                            <Input id="hsn" placeholder="Enter the HSN Code" />
                          </div>
                          <div className="flex flex-col w-full space-y-1.5">
                            <Label htmlFor="gst">GST</Label>
                            <Input
                              id="gst"
                              placeholder="Enter the GST percentge"
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* ////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////// */}
              {/* variants */}
              <Variants values={values} product={product}></Variants>
              <VariantsTable
                results={results}
                inventorySubproducts={inventorySubproducts}
              ></VariantsTable>

              {/* ////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////// */}
              {/* Additional Info */}
              <Card className="w-full ">
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-2xl font-semibold leading-none tracking-tight">
                        Additional Information
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid w-full items-center gap-4">
                          <p>Add tags to the product</p>
                          <div className="flex flex-col w-full space-y-1.5">
                            <Label htmlFor="gst">Tags</Label>
                            <div className="">Input tags</div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* ////////////////////////////////////////////////////////////////////////////// */}
            {/* ////////////////////////////////////////////////////////////////////////////// */}
            {/* Status Info */}
            <div className="w-1/3">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Visibility & Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
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
                    <div className="flex items-center space-x-2">
                      <Switch id="isBestSeller" />
                      <Label htmlFor="isBestSeller">BestSeller</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ////////////////////////////////////////////////////////////////////////////// */}
          {/* ////////////////////////////////////////////////////////////////////////////// */}
          {/* Footer buttons */}
          <div className="flex w-2/3 pr-8 gap-4 justify-between">
            <Button
              onClick={() => resetForm()}
              variant="secondary"
              type="reset"
              className="w-40"
            >
              Cancel
            </Button>

            <div className="flex gap-6 items-center">
              {product && (
                <DeleteModal id={product.id} name={product.name}></DeleteModal>
              )}
              <Button
                isLoading={isLoading}
                variant="default"
                type="submit"
                className="w-40"
              >
                {product ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </FormProvider>
      </form>
    </div>
  );
};

export default ProductEditor;
