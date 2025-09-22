import { useState } from "react";

interface BookFormProps {
    onSubmit: (name: string, author: string, photo?: string) => void;
}

export const BookForm = ({ onSubmit }: BookFormProps) => {
    const [name, setName] = useState("");
    const [author, setAuthor] = useState("");
    const [photo, setPhoto] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !author) return;
        onSubmit(name, author, photo);
        setName("");
        setAuthor("");
        setPhoto("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border rounded">
            <input
                type="text"
                placeholder="Назва книги"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border px-2 py-1 rounded"
            />
            <input
                type="text"
                placeholder="Автор"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="border px-2 py-1 rounded"
            />
            <input
                type="text"
                placeholder="Фото (URL)"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                className="border px-2 py-1 rounded"
            />
            <button
                type="submit"
                className="border border-blue-500 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
                Додати книгу
            </button>
        </form>
    );
};
