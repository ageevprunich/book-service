import { useState } from "react";
import { register } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
    const setUser = useAuthStore((state) => state.setUser);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const userCredential = await register(email, password, fullName);
            setUser(userCredential.user);
        } catch (err: any) {
            setError(err.message || "Помилка при реєстрації");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="text"
                placeholder="Ім'я"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border rounded px-3 py-2"
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded px-3 py-2"
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded px-3 py-2"
            />
            <Button type="submit">Зареєструватися</Button>
        </form>
    );
}
