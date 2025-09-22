import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { MeBooks } from "@/pages/MeBooks";
import { BooksPage } from "@/pages/BooksPage";
import { BookDetailPage } from "@/pages/BookDetails";
import { auth } from "@/firebase/firebase";
import { useAuthStore } from "@/store/authStore";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { AppUser } from "@/store/authStore";
import "./App.css";

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // отримуємо дані користувача з Firestore (ім'я, роль)
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          fullName: docSnap.exists() ? docSnap.data().fullName : undefined,
          role: docSnap.exists() ? (docSnap.data().role as "admin" | "user") : "user",
        };

        setUser(appUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return (

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/me/books"
            element={user ? <MeBooks /> : <Navigate to="/" />}
        />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        </Routes>
      </div>

  );
}

export default App;
