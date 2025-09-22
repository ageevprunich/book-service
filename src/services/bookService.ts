import { db } from "@/firebase/firebase";
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { AppUser } from "@/store/authStore";

export interface Book {
  id?: string;
  name: string;
  author: string;
  photo?: string;
  userId: string;
}

const booksCollection = collection(db, "books");
const usersCollection = collection(db, "users");

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

  async updateBook(bookId: string, data: Partial<Book>, user: AppUser) {
    const docRef = doc(db, "books", bookId);
    const snapshot = await getDoc(docRef);
    if ((snapshot.exists() && snapshot.data().userId === user.uid) || user.role === "admin") {
        await updateDoc(docRef, data);
        return { id: bookId, ...snapshot.data(), ...data } as Book; // <-- повертаємо повну книгу
    } else {
        throw new Error("Ви не можете редагувати цю книгу");
    }
  },

  async deleteBook(bookId: string) {
    await deleteDoc(doc(db, "books", bookId));
  },

  async getAllBooks() {
    const snapshot = await getDocs(booksCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
  },

  async getUserById(uid: string): Promise<AppUser | null> {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Omit<AppUser, "uid">; // виключаємо uid з даних
      return {
        uid: docSnap.id,        // id з документу
        email: data.email,
        fullName: data.fullName,
        role: data.role
      };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Помилка при отриманні користувача:", error);
      return null;
    }
  }
};
