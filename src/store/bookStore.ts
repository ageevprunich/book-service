import { create } from "zustand";
import { Book } from "@/services/bookService";

interface BooksState {
  books: Book[];
  setBooks: (books: Book[]) => void;
  addBook: (book: Book) => void;
  removeBook: (id: string) => void;
}

export const useBooksStore = create<BooksState>((set) => ({
  books: [],
  setBooks: (books) => set({ books }),
  addBook: (book) => set((state) => ({ books: [...state.books, book] })),
  removeBook: (id) => set((state) => ({ books: state.books.filter(b => b.id !== id) })),
}));
