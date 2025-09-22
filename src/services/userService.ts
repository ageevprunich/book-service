import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDoc, getDocs, updateDoc, setDoc, deleteDoc, doc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const userService = {
  async addUser({ fullName, email, role, password }: { fullName: string; email: string; role: "user" | "admin"; password: string }) {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Додаємо користувача у Firestore
    await setDoc(doc(db, "users", uid), { fullName, email, role });

    return { uid, fullName, email, role };
  },

  async getAllUsers() {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map(doc => ({ uid: doc.id, ...(doc.data() as { fullName: string; email: string; role: "user" | "admin" }) }));
  },

  async updateUser(uid: string, data: Partial<{ fullName: string; email: string; role: "user" | "admin" }>) {
    await updateDoc(doc(db, "users", uid), data);
    const updated = await getDoc(doc(db, "users", uid));
    return { uid: updated.id, ...(updated.data() as { fullName: string; email: string; role: "user" | "admin" }) };
  },

  async deleteUser(uid: string) {
    // Firebase Auth видалення користувача без серверної частини не зробити з фронтенду
    // Тільки видаляємо з Firestore
    await deleteDoc(doc(db, "users", uid));
  }
};
