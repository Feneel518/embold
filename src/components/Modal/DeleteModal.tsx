import { FC } from "react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "../hooks/use-toast";
import { CategoryDeleteRequest } from "@/lib/validators/Category";
import { ProductDeleteRequest } from "@/lib/validators/Product";

interface DeleteModalProps {
  name: string;
  id: string;
}

const DeleteModal: FC<DeleteModalProps> = ({ name, id }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { mutate: handleDelete } = useMutation({
    mutationFn: async () => {
      const payload: CategoryDeleteRequest | ProductDeleteRequest = {
        id,
      };

      if (pathname.includes("categories")) {
        const { data } = await axios.post(
          "/api/dashboard/category/delete",
          payload
        );

        return data as string;
      } else if (pathname.includes("products")) {
        const { data } = await axios.post(
          "/api/dashboard/products/delete",
          payload
        );

        return data as string;
      }
    },
    onError: (err) => {
      console.log(err);
      if (pathname.includes("categories")) {
        return toast({
          title: "This is a parent category",
          description: "Delete subcategory to delete parent category.",
          variant: "destructive",
        });
      }
      if (pathname.includes("products")) {
        return toast({
          title: "Something went wrong",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      if (pathname.includes("categories")) {
        router.push("/dashboard/categories");
      } else if (pathname.includes("products")) {
        router.push("/dashboard/products");
      }

      router.refresh();

      if (pathname.includes("categories")) {
        return toast({
          description: "Your category has been deleted",
        });
      } else if (pathname.includes("products")) {
        return toast({
          description: "Your product has been deleted",
        });
      }
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-40" variant="destructive">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription className="text-xs">
            This action cannot be undone. Are you sure you want to permanently
            delete this file from our servers?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="">
            <h1 className="text-xl ">
              Are you sure you want to delete "{name}"
            </h1>
          </div>
        </div>
        <DialogFooter className="flex gap-4">
          <DialogPrimitive.Close>
            <Button type="button">Cancel</Button>
          </DialogPrimitive.Close>
          <Button
            onClick={() => handleDelete()}
            variant="destructive"
            type="button"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
