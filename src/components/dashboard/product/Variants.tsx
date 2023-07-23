import { FC, useState } from "react";
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
import { ColourOption, colourOptions } from "@/lib/data/ColourData";
import chroma from "chroma-js";
import Select, { StylesConfig } from "react-select";
import { X } from "lucide-react";

interface VariantsProps {
  values: (
    selectedColours: { label: string; value: string }[],
    values1: string[]
  ) => void;
  product: {
    id: string;
    categoriesOnProducts: [
      {
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

const Variants: FC<VariantsProps> = ({ values, product }) => {
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  // select values for categories

  const [selectedColours, setSelectedColours] = useState<
    { label: string; value: string }[]
  >(product ? product.colour : [{ label: "Black", value: "#000000" }]);
  const handleColour = (value: { label: string; value: string }[]) => {
    setSelectedColours(value.map((val) => val));
  };

  const [values1, setValues1] = useState<string[]>(product ? product.size : []);
  const addValues1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    if (e.key === " " && e.target.value !== "") {
      setValues1([...values1, e.target.value.toUpperCase()]);
      e.target.value = "";
    }
  };
  values(selectedColours, values1);

  const removeValues1 = (indextoRemove: number) => {
    setValues1(values1.filter((_, index) => index !== indextoRemove));
  };

  const colourStyles: StylesConfig<ColourOption, true> = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.value);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.value
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        color: isDisabled
          ? "#ccc"
          : isSelected
          ? chroma.contrast(color, "white") > 2
            ? "white"
            : "black"
          : data.value,
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.value
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },

    // multiValue: (styles, { data }) => {
    //   const color = chroma(data.value);
    //   return {
    //     ...styles,
    //     backgroundColor: color.alpha(0.1).css(),
    //   };
    // },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.value,
    }),

    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.value,
      ":hover": {
        backgroundColor: data.value,
        color: "white",
      },
    }),
  };

  return (
    <div>
      <Card className="w-full ">
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-2xl font-semibold leading-none tracking-tight">
                Variants
              </AccordionTrigger>
              <AccordionContent className="overflow-visible">
                <div className="flex flex-col">
                  <p>Add variants like size, colour to the product</p>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-64">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input type="text" value="Size" readOnly></Input>
                      </div>
                      <div className="w-full">
                        <Label htmlFor="name" className="text-right">
                          Value
                        </Label>
                        <div className="min-h-[35px] h-fit border  rounded-md flex gap-2 items-center justify-start p-2 flex-wrap ">
                          {values1 &&
                            values1.map((value, index) => {
                              return (
                                <div
                                  key={index}
                                  className="bg-embold rounded-lg h-fit p-1 w-fit flex items-center gap-1 text-white"
                                >
                                  <h1>{value}</h1>
                                  <X
                                    onClick={() => removeValues1(index)}
                                    className="w-4 cursor-pointer"
                                  ></X>
                                </div>
                              );
                            })}
                          <input
                            className="  h-[35px] pl-2 focus:outline-none"
                            type="text"
                            placeholder="Press space to add tags"
                            // @ts-ignore
                            onKeyUp={addValues1}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-64">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input type="text" value="Colour" readOnly></Input>
                      </div>
                      <div className="w-full h-fit">
                        <Label htmlFor="name" className="text-right">
                          Value
                        </Label>
                        <Select
                          defaultValue={selectedColours}
                          closeMenuOnSelect={false}
                          isMulti
                          options={colourOptions}
                          styles={colourStyles}
                          // @ts-ignore
                          onChange={handleColour}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Variants;
