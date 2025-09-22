import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useBooksStore } from "@/store/bookStore";
import { booksService, Book } from "@/services/bookService";
import { BookCard } from "@/components/Books/BookCard";
import { BookForm } from "@/components/Books/BookForm";

export const MeBooks = () => {
    const user = useAuthStore((state) => state.user);
    const { books, setBooks, addBook, removeBook } = useBooksStore();
    const navigate = useNavigate(); 
    const [editingBook, setEditingBook] = useState<Book | null>(null);

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

    const handleStartEdit = (book: Book) => {
        setEditingBook(book);
    };

    // Зберегти зміни після редагування
    const handleEditBook = (name: string, author: string, photo?: string) => {
        if (!user || !editingBook) return;

        booksService.updateBook(editingBook.id!, { name, author, photo }, user)
            .then((updatedBook) => {
                // Замінюємо стару книгу на оновлену
                setBooks(books.map(b =>
                    b.id === updatedBook.id
                        ? { ...b, ...updatedBook }  // <-- важливо: беремо всі поля з updatedBook
                        : b
                ));
                setEditingBook(null); // закриваємо форму
            })
            .catch(err => console.error("Помилка редагування книги:", err));
    };

    return (
        <div className="p-4 flex flex-col gap-4">
            <button
                className="border border-gray-500 px-4 py-2 rounded hover:bg-gray-500 hover:text-white transition-colors self-start"
                onClick={() => navigate("/")}
            >
                Назад на головну
            </button>

            <BookForm
                onSubmit={editingBook ? handleEditBook : handleAddBook}
                initialName={editingBook?.name}
                initialAuthor={editingBook?.author}
                initialPhoto={editingBook?.photo}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {books.map((book) => (
                    <BookCard
                        key={book.id}
                        name={book.name}
                        author={book.author}
                        photo={book.photo}
                        userId={book.userId}
                        currentUser={user}
                        onDelete={() => handleDeleteBook(book.id!)}
                        onEdit={() => handleStartEdit(book)} // передаємо редагування
                    />
                ))}
            </div>
        </div>
    );
};
