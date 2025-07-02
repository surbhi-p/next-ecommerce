import Hero from '@/components/Hero'
import ProductList from '@/components/ProductList'
import React from 'react'

export default function Home() {
  return (
    <div>
      <Hero />
      <h2 className='w-full text-center text-2xl md:text-4xl font-semibold py-6'>All product</h2>
      <ProductList />
    </div>
  )
}
