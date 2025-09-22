import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { booksService, Book } from "@/services/bookService";
import { useAuthStore } from "@/store/authStore";

export const BookDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (!id) return;

        const fetchBook = async () => {
            try {
                const allBooks = await booksService.getAllBooks();
                const foundBook = allBooks.find(b => b.id === id);
                setBook(foundBook || null);
            } catch (error) {
                console.error("Не вдалося завантажити книгу:", error);
            }
        };

        fetchBook();
    }, [id]);

    const handleExchangeRequest = async () => {
        if (!book || !user) return;

        if (book.userId === user.uid) {
            alert("Ви не можете запропонувати обмін на свою книгу!");
            return;
        }

        try {
            // Отримуємо email власника книги
            const ownerUser = await booksService.getUserById(book.userId);
            if (!ownerUser?.email) {
                alert("Не вдалося знайти email власника книги");
                return;
            }

            // Формуємо email-запит
            const subject = encodeURIComponent("Запит на обмін книгою");
            const body = encodeURIComponent(
                `Привіт, я хотів би запропонувати обмін.\n\n` +
                `Відправник: ${user.fullName || user.email}\n` +
                `Email: ${user.email}\n` +
                `Моя книга для обміну: ...` // тут можна додати список книг користувача
            );

            // Використовуємо mailto:
            window.location.href = `mailto:${ownerUser.email}?subject=${subject}&body=${body}`;
        } catch (error) {
            console.error("Помилка при надсиланні запиту:", error);
        }
    };

    if (!book) {
        return <div className="p-4 text-center">Книга не знайдена</div>;
    }

    return (
        <div className="p-4 flex flex-col items-center gap-4">
            <h1 className="text-3xl font-bold">{book.name}</h1>
            <p className="text-lg text-gray-600">{book.author}</p>
            {book.photo && (
                <img
                    src={book.photo}
                    alt={book.name}
                    className="w-64 h-64 object-cover rounded"
                />
            )}
            <div className="flex gap-4 mt-4">
                <button
                    className="border border-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
                    onClick={() => navigate("/books")}
                >
                    Повернутися до списку книг
                </button>
                <button
                    className="border border-green-500 px-4 py-2 rounded hover:bg-green-500 hover:text-white transition-colors"
                    onClick={handleExchangeRequest}
                >
                    Запропонувати обмін
                </button>
            </div>
        </div>
    );
};
