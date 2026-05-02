import axios from 'axios';
import { Book } from '../types/book';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    // Optional: add auth tokens here if needed
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

const MOCK_BOOKS: Book[] = [
  {
    book_id: '1',
    title: 'Neuromancer',
    author: 'William Gibson',
    description: 'The Matrix is a world within the world, a global consensus-hallucination, the representation of every byte of data in cyberspace...',
    genre: 'Sci-Fi',
    price: 14.99,
    published_date: '1984-07-01',
    image_url: 'https://images.unsplash.com/photo-1614544048536-0d28caf77f41?w=800&q=80',
    pdf_url: '#',
    isbn: '978-0441569595'
  },
  {
    book_id: '2',
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange.',
    genre: 'Sci-Fi',
    price: 18.99,
    published_date: '1965-08-01',
    image_url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80',
    pdf_url: '#',
    isbn: '978-0441172719'
  },
  {
    book_id: '3',
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    description: 'Told in Kvothe\'s own voice, this is the tale of the magically gifted young man who grows to be the most notorious wizard his world has ever seen.',
    genre: 'Fantasy',
    price: 24.99,
    published_date: '2007-03-27',
    image_url: 'https://images.unsplash.com/photo-1705721357357-ab87523248f7?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    pdf_url: '#',
    isbn: '978-0756404741'
  },
  {
    book_id: '4',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    description: 'A series of personal writings by Marcus Aurelius, Roman Emperor from 161 to 180 AD, recording his private notes to himself and ideas on Stoic philosophy.',
    genre: 'Philosophy',
    price: 9.99,
    published_date: '0180-01-01',
    image_url: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&q=80',
    pdf_url: '#',
    isbn: '978-0812968255'
  },
  {
    book_id: '5',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    description: 'Alicia Berenson’s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London’s most desirable areas.',
    genre: 'Mystery',
    price: 12.99,
    published_date: '2019-02-05',
    image_url: 'https://images.unsplash.com/photo-1587876931567-564ce588bfbd?w=800&q=80',
    pdf_url: '#',
    isbn: '978-1250301697'
  },
  {
    book_id: '6',
    title: '1984',
    author: 'George Orwell',
    description: 'Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.',
    genre: 'Fiction',
    price: 11.99,
    published_date: '1949-06-08',
    image_url: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&q=80',
    pdf_url: '#',
    isbn: '978-0451524935'
  }
];

export const fetchAllBooks = async (): Promise<Book[]> => {
  try {
    const response = await apiClient.get<Book[]>('/api/books');
    return response.data.map((book) => {
      // If the API returns a relative path like /images/alchemist.jpg,
      // prepend the API base URL so the frontend can load it properly.
      let updatedBook = { ...book };
      if (updatedBook.image_url && updatedBook.image_url.startsWith('/')) {
        updatedBook.image_url = `${API_BASE}${updatedBook.image_url}`;
      }
      if (updatedBook.pdf_url && updatedBook.pdf_url.startsWith('/')) {
        updatedBook.pdf_url = `${API_BASE}${updatedBook.pdf_url}`;
      }
      return updatedBook;
    });
  } catch (error) {
    console.error("Failed to fetch books, using mock data", error);
    return MOCK_BOOKS;
  }
};
