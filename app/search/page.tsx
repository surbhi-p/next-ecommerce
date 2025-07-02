"use client";

import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
}

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchTermFromUrl = searchParams.get("searchTerm");
    if (searchTermFromUrl) {
      console.log(searchTermFromUrl);
      axios
        .get(`/api/search?searchTerm=${searchTermFromUrl}`)
        .then((response) => {
          console.log(response.data.products);
          setProducts(response.data.products);
        });
    }
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        id="product"
        className="px-4 md:px-12 py-5 md:py-10 flex justify-center items-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {products.map((product: Product, index) => (
            <Link href={`/product/${product._id}`} key={index}>
              <Image
                src={product.image}
                alt={`Product Image ${index + 1}`}
                width={1000}
                height={1000}
                className="max-w-[17rem] h-72 object-cover object-center rounded-lg"
              />
              <div className="mt-4">
                <h2 className="font-semibold text-lg">{product.name}</h2>
                <p className="font-medium text-sm mt-1">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Suspense>
  );
};

export default SearchPage;
