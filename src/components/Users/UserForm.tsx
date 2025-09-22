import { useState } from "react";

interface UserFormProps {
    onSubmit: (fullName: string, email: string, role: "user" | "admin", password?: string) => void;
    initialFullName?: string;
    initialEmail?: string;
    initialRole?: "user" | "admin";
}

export const UserForm = ({ onSubmit, initialFullName = "", initialEmail = "", initialRole = "user" }: UserFormProps) => {
    const [fullName, setFullName] = useState(initialFullName);
    const [email, setEmail] = useState(initialEmail);
    const [role, setRole] = useState<"user" | "admin">(initialRole);
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !email) return;
        onSubmit(fullName, email, role, password);
        setFullName(""); setEmail(""); setRole("user"); setPassword("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border rounded">
            <input type="text" placeholder="Ім’я" value={fullName} onChange={e => setFullName(e.target.value)} className="border px-2 py-1 rounded" />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border px-2 py-1 rounded" />
            <input
                type="password"
                placeholder={initialEmail ? "Новий пароль (залишити порожнім без зміни)" : "Пароль"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border px-2 py-1 rounded"
            />
            <select value={role} onChange={e => setRole(e.target.value as "user" | "admin")} className="border px-2 py-1 rounded">
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit" className="border px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                {initialFullName ? "Зберегти" : "Додати"}
            </button>
        </form>
    );
};
