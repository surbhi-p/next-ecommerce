import { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';

export default function SearchPage() {
  return (
    <div>
      <h1>Search Page</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchPageClient />
      </Suspense>
    </div>
  );
}