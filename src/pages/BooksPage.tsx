import { useState, useEffect } from "react";
import { booksService, Book } from "@/services/bookService";
import { getFilteredSortedPaginatedBooks } from "@/services/booksLogic";
import { BookCard } from "@/components/Books/BookCard";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export const BooksPage = () => {
    const user = useAuthStore((state) => state.user);

    const [books, setBooks] = useState<Book[]>([]);
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
    const [displayBooks, setDisplayBooks] = useState<Book[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        // Завантажуємо всі книги з Firestore
        booksService.getAllBooks().then(setBooks);
    }, []);

    useEffect(() => {
        const { paginated, totalPages } = getFilteredSortedPaginatedBooks({
            books,
            search,
            sortAsc,
            currentPage,
            pageSize,
        });
        setDisplayBooks(paginated);
        setTotalPages(totalPages);
    }, [books, search, sortAsc, currentPage]);

    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <button
                    className="border border-gray-500 px-4 py-2 rounded hover:bg-gray-500 hover:text-white transition-colors self-start"
                    onClick={() => navigate("/")}
                >
                    Назад на головну
                </button>
                <input
                    type="text"
                    placeholder="Пошук за назвою або автором"
                    className="border px-4 py-2 rounded w-full md:w-1/3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="border px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => setSortAsc(!sortAsc)}
                >
                    Сортувати: {sortAsc ? "А→Я" : "Я→А"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayBooks.map((book) => (
                    <BookCard
                        key={book.id}
                        name={book.name}
                        author={book.author}
                        photo={book.photo}
                        userId={book.userId}
                        currentUser={user}      
                        onClick={() => navigate(`/books/${book.id}`)}
                    />
                    
                ))}
            </div>

            <div className="flex gap-2 justify-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                            }`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};
