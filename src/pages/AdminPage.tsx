import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";
import { UserForm } from "@/components/Users/UserForm";
import { AppUser } from "@/store/authStore";

export const AdminPage = () => {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const [users, setUsers] = useState<AppUser[]>([]);
    const [editingUser, setEditingUser] = useState<AppUser | null>(null);

    // Перевірка, чи це адмін
    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/"); // редірект для звичайних користувачів
        }
    }, [user, navigate]);

    // Завантажуємо всіх користувачів
    useEffect(() => {
        userService.getAllUsers().then(setUsers); // створимо метод у сервісі
    }, []);

    const handleAddUser = (fullName: string, email: string, role: "admin" | "user", password?: string) => {
        if (!password) return; // or handle error/validation as needed
        userService.addUser({ fullName, email, role, password }).then((newUser) => setUsers([...users, newUser]));
    };

    const handleDeleteUser = (uid: string) => {
        userService.deleteUser(uid).then(() => setUsers(users.filter(u => u.uid !== uid)));
    };

    const handleEditUser = (fullName: string, email: string, role: "admin" | "user") => {
        if (!editingUser) return;
        userService.updateUser(editingUser.uid, { fullName, email, role }).then((updatedUser) => {
            setUsers(users.map(u => u.uid === updatedUser.uid ? updatedUser : u));
            setEditingUser(null);
        });
    };

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Адмін панель</h1>

            <UserForm
                onSubmit={editingUser ? handleEditUser : handleAddUser}
                initialFullName={editingUser?.fullName ?? ""}
                initialEmail={editingUser?.email ?? ""}
                initialRole={editingUser?.role as "user" | "admin" ?? "user"}
                // requirePassword={!editingUser}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {users.map(u => (
                    <div key={u.uid} className="border p-4 rounded flex flex-col gap-2">
                        <p><b>Ім’я:</b> {u.fullName}</p>
                        <p><b>Email:</b> {u.email}</p>
                        <p><b>Роль:</b> {u.role}</p>
                        <div className="flex gap-2 mt-2">
                            <button
                                className="border px-2 py-1 rounded bg-yellow-400 hover:bg-yellow-500"
                                onClick={() => setEditingUser(u)}
                            >
                                Редагувати
                            </button>
                            <button
                                className="border px-2 py-1 rounded bg-red-400 hover:bg-red-500"
                                onClick={() => handleDeleteUser(u.uid)}
                            >
                                Видалити
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
