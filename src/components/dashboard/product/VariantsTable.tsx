import { FC, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useFormContext } from "react-hook-form";

interface VariantsTableProps {
  results: string[];
  inventorySubproducts: [
    {
      price: string;
      discountedPrice: string;
      quantity: string;
    }
  ];
}

const VariantsTable: FC<VariantsTableProps> = ({
  results,
  inventorySubproducts,
}) => {
  const { register, getValues } = useFormContext();
  return (
    <div>
      {results.length !== 0 && (
        <Card>
          <CardContent>
            <div className="flex flex-col gap-4 mt-10">
              {results.map((subProd, index) => {
                getValues([
                  `inventory.${index}.price`,
                  `inventory.${index}.discountedPrice`,
                ]);
                return (
                  <div
                    key={index}
                    className="grid grid-cols-5 items-center gap-4"
                  >
                    <div className="flex flex-col space-y-1.5">
                      <Label>Variants</Label>
                      <h1>{subProd}</h1>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label>Price</Label>
                      <Input
                        defaultValue={
                          inventorySubproducts[index]
                            ? inventorySubproducts[index].price
                            : 0
                        }
                        {...register(`inventory.${index}.price`, {
                          valueAsNumber: true,
                        })}
                      ></Input>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label>Discounted Price</Label>
                      <Input
                        defaultValue={
                          inventorySubproducts[index]
                            ? inventorySubproducts[index].discountedPrice
                            : 0
                        }
                        {...register(`inventory.${index}.discountedPrice`, {
                          valueAsNumber: true,
                        })}
                      ></Input>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label>Quantity</Label>
                      <Input
                        defaultValue={
                          inventorySubproducts[index]
                            ? inventorySubproducts[index].quantity
                            : 0
                        }
                        {...register(`inventory.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                      ></Input>
                    </div>
                    {/* <div className="flex flex-col space-y-1.5">
                      <Label>Quantity</Label>
                      <Input
                        multiple
                        type="file"
                        {...register(`inventory.${index}.image`, {

                          onChange(event) {
                            handleImageUpload(event);
                          },
                          value: key,
                        })}
                      ></Input>
                    </div> */}

                    <Input
                      value={subProd}
                      {...register(`inventory.${index}.subProductName`)}
                      type="hidden"
                    ></Input>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VariantsTable;
