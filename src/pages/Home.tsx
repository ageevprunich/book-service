import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { auth } from "@/firebase/firebase";
import { LoginForm } from "@/components/Auth/LoginForm";
import { RegisterForm } from "@/components/Auth/RegisterForm";

export const Home = () => {
    const [showLogin, setShowLogin] = useState(true);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            logout(); // очищаємо user зі store
            navigate("/"); // редірект на головну
        } catch (error) {
            console.error("Помилка при виході:", error);
        }
    };

    if (user) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 min-h-screen">
                <h1 className="text-2xl font-bold">Ласкаво просимо, {user.email}</h1>
                <div className="flex gap-4">
                    <button
                        className="border border-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
                        onClick={() => navigate("/me/books")}
                    >
                        Мої книги
                    </button>
                    <button
                        className="border border-green-500 px-4 py-2 rounded hover:bg-green-500 hover:text-white transition-colors"
                        onClick={() => navigate("/books")}
                    >
                        Усі книги
                    </button>
                    <button
                        className="border border-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-colors"
                        onClick={handleLogout}
                    >
                        Вийти
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 min-h-screen">
            <div className="flex gap-4">
                <button
                    className={`border border-gray-300 px-4 py-2 rounded ${showLogin ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                    onClick={() => setShowLogin(true)}
                >
                    Логін
                </button>
                <button
                    className={`border border-gray-400 px-4 py-2 rounded ${!showLogin ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                    onClick={() => setShowLogin(false)}
                >
                    Реєстрація
                </button>
            </div>
            {showLogin ? <LoginForm /> : <RegisterForm />}
        </div>
    );
};
