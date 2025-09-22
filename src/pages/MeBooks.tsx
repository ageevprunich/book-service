import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useBooksStore } from "@/store/bookStore";
import { booksService } from "../services/bookService";
import { BookCard } from "@/components/Books/BookCard";
import { BookForm } from "@/components/Books/BookForm";

export const MeBooks = () => {
    const user = useAuthStore((state) => state.user);
    const { books, setBooks, addBook, removeBook } = useBooksStore();

    useEffect(() => {
        if (user?.uid) {
            booksService.getMyBooks(user.uid).then(setBooks);
        }
    }, [user, setBooks]);

    const handleAddBook = (name: string, author: string, photo?: string) => {
        if (!user) return;
        const newBook = { name, author, photo, userId: user.uid };
        booksService.addBook(newBook).then((book) => addBook(book));
    };

    const handleDeleteBook = (id: string) => {
        booksService.deleteBook(id).then(() => removeBook(id));
    };

    return (
        <div className="p-4 flex flex-col gap-4">
            <BookForm onSubmit={handleAddBook} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {books.map((book) => (
                    <BookCard
                        key={book.id}
                        name={book.name}
                        author={book.author}
                        photo={book.photo}
                        onDelete={() => handleDeleteBook(book.id!)}
                    />
                ))}
            </div>
        </div>
    );
};
