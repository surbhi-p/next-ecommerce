"use client";
import axios from 'axios';
import Image from 'next/image';
import Link from "next/link";
import React, { useEffect } from 'react'

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
}

const ProductList = () => {
  const [products, setProducts] = React.useState([]);

  useEffect(() => {
    axios
      .get("/api/fetch-products")
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error: any) => {
        // Handle any errors
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div id='product' className='px-4 md:px-12 py-5 md:py-10 flex justify-center items-center'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5'>
        {products.map((product: Product, index) => (
          <Link href={`/products/${product._id}`} key={index} >
            <Image src={product.image} alt={`Product Image ${index + 1}`} width={1000} height={1000} className='max-w-[17rem] h-72 object-cover object-center rounded-lg' />
            <div className='mt-4'>
              <h2 className='font-semibold text-lg'>{product.name}</h2>
              <p className='font-medium text-sm mt-1'>${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProductList