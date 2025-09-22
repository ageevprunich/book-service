import { useState, useEffect } from "react";

interface UserFormProps {
    onSubmit: (fullName: string, email: string, role: "admin" | "user") => void;
    initialFullName?: string;
    initialEmail?: string;
    initialRole?: "admin" | "user";
}

export const UserForm = ({ onSubmit, initialFullName = "", initialEmail = "", initialRole = "user" }: UserFormProps) => {
    const [fullName, setFullName] = useState(initialFullName);
    const [email, setEmail] = useState(initialEmail);
    const [role, setRole] = useState(initialRole);

    useEffect(() => {
        setFullName(initialFullName);
        setEmail(initialEmail);
        setRole(initialRole);
    }, [initialFullName, initialEmail, initialRole]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !email) return;
        onSubmit(fullName, email, role);
        setFullName("");
        setEmail("");
        setRole("user");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border rounded">
            <input
                type="text"
                placeholder="Повне ім’я"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border px-2 py-1 rounded"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border px-2 py-1 rounded"
            />
            <select
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "user")}
                className="border px-2 py-1 rounded"
            >
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit" className="border px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                {initialFullName ? "Зберегти" : "Додати користувача"}
            </button>
        </form>
    );
};
