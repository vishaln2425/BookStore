import { useState, useEffect, useMemo } from 'react';
import { Book } from '../types/book';
import { fetchAllBooks } from '../services/bookApi';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAllBooks();
        setBooks(data);
      } catch (err) {
        setError('Failed to load books. Please try again later.');
        // Optional fallback for demonstration purposes if the API is down
        // setBooks([...mockBooks]) 
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = activeGenre ? book.genre === activeGenre : true;
      return matchesSearch && matchesGenre;
    });
  }, [books, searchQuery, activeGenre]);

  return {
    books,
    filteredBooks,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    activeGenre,
    setActiveGenre,
  };
};
