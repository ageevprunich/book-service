import { db } from "@/firebase/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

export interface Book {
  id?: string;
  name: string;
  author: string;
  photo?: string;
  userId: string;
}

const booksCollection = collection(db, "books");

export const booksService = {
  async getMyBooks(userId: string) {
    const q = query(booksCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
  },

  async addBook(book: Book) {
    const docRef = await addDoc(booksCollection, book);
    return { id: docRef.id, ...book };
  },

  async deleteBook(bookId: string) {
    await deleteDoc(doc(db, "books", bookId));
  }
};
