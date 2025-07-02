"use client";
import { addAction } from "@/utils/AddAction";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

const AddForm = () => {
  const router = useRouter();
  const [imageURL, setImageURL] = useState("");
  async function ClientAddAction(formData: FormData){
    const {error, success} = await addAction(formData);
    if(error){
      // Toast notification
      toast.error(error)
    }
    if(success){
      // Toast notification
      toast.success(success)
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
        <input type="text" name="name" placeholder="Enter product name" className="w-full px-3 px-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500" />
      </div>
      <div className="flex flex-col w-full max-w-xl">
        <label>Price: </label>
        <input type="number" name="price" placeholder="Enter product price" className="w-full px-3 px-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500" />
      </div>
      <div className="flex flex-col w-full max-w-xl">
        <label>Seller&apos;s Link: </label>
        <input
          type="text"
          name="link"
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
          className="w-full px-3 px-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-[#212529] text-white py-2 px-3 rounded-md cursor-pointer flex flex-col w-full max-w-xl"
      >
        Add Product
      </button>
    </form>
  );
};

export default AddForm;
