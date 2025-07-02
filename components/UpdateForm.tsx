"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import axios from "axios";
import { updateAction } from "@/utils/updateAction";

interface Product {
  image: string;
  _id: string;
  name: string;
  price: number;
  link: string;
  description: string;
}

const UpdateForm = ({productId}: {productId: string}) => {
  const router = useRouter();
  const [imageURL, setImageURL] = useState("");
  const [product, setProduct] = useState<Product>();

  useEffect(()=> {
    axios.get(`/api/products/${productId}`).then(response => setProduct(response.data.product));
  }, []);

  useEffect(() => {
    console.log("Product data:", product);
    if(product){
      setImageURL(product.image); // Set initial image URL from product data
    }
  }, [product])

  async function ClientAddAction(formData: FormData){
    const result = await updateAction(formData, productId);
    if (result?.error) {
      // Toast notification
      toast.error(result.error);
    }
    if (result?.success) {
      // Toast notification
      toast.success(result.success);
      router.push("/");
      setImageURL(""); // Reset image URL after successful submission 
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileSize = file.size;
      if(Math.round(fileSize / 1024) > 1024) { // Check if file size exceeds 1MB
        toast.error("File size exceeds 1MB limit");
      } else {
        setImageURL(URL.createObjectURL(file));
      }
    }
  };

  return (
    <form action={ClientAddAction} className="w-full max-auto flex flex-col justify-center items-center space-y-4 mt-3 md:mt-5">
      {imageURL && <Image src={imageURL} alt="Product Preview" height={300} width={300} />}
      <div className="flex flex-col w-full max-w-xl">
        <label>Product Image: </label>
        <input
          type="file"
          accept="image/*"
          name="image"
          onChange={handleImageChange}
          className="w-full px-3 px-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
        />
      </div>
      <div className="flex flex-col w-full max-w-xl">
        <label>Name: </label>
        <input type="text" defaultValue={product?.name} name="name" placeholder="Enter product name" className="w-full px-3 px-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500" />
      </div>
      <div className="flex flex-col w-full max-w-xl">
        <label>Price: </label>
        <input type="number" defaultValue={product?.price} name="price" placeholder="Enter product price" className="w-full px-3 px-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500" />
      </div>
      <div className="flex flex-col w-full max-w-xl">
        <label>Seller&apos;s Link: </label>
        <input
          type="text"
          name="link"
          defaultValue={product?.link}
          placeholder="Link to where buyers can find you"
          className="w-full px-3 px-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
        />
      </div>
      <div className="flex flex-col w-full max-w-xl">
        <label>Description: </label>
        <textarea
          name="description"
          placeholder="Enter product description"
          rows={4}
          defaultValue={product?.description}
          className="w-full px-3 px-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-[#212529] text-white py-2 px-3 rounded-md cursor-pointer flex flex-col w-full max-w-xl"
      >
        Update Product
      </button>
    </form>
  );
};

export default UpdateForm;
