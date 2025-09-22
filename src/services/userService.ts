import { db } from "@/firebase/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { AppUser } from "@/store/authStore";

const usersCollection = collection(db, "users");

export const userService = {
    // Отримати всіх користувачів
    async getAllUsers(): Promise<AppUser[]> {
        const snapshot = await getDocs(usersCollection);
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as AppUser));
    },

    // Додати користувача
    async addUser(user: Omit<AppUser, "uid">): Promise<AppUser> {
        const docRef = await addDoc(usersCollection, user);
        return { uid: docRef.id, ...user };
    },

    // Оновити користувача
    async updateUser(uid: string, data: Partial<AppUser>): Promise<AppUser> {
        const docRef = doc(db, "users", uid);
        await updateDoc(docRef, data);
        return { uid, ...data } as AppUser;
    },

    // Видалити користувача
    async deleteUser(uid: string) {
        await deleteDoc(doc(db, "users", uid));
    },
};
