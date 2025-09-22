import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { MeBooks } from "@/pages/MeBooks";
import { auth } from "@/firebase/firebase";
import { useAuthStore } from "@/store/authStore";
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
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
        </Routes>
      </div>

  );
}

export default App;
