import { AppUser } from "@/store/authStore";

interface BookCardProps {
    name: string;
    author: string;
    photo?: string;
    userId: string;            // Власник книги
    currentUser: AppUser | null;      // Поточний користувач
    onDelete?: () => void;
    onEdit?: () => void;
    onClick?: () => void;
}

export const BookCard = ({ name, author, photo, userId, currentUser, onDelete, onEdit, onClick }: BookCardProps) => {
    const canEdit = currentUser!.uid === userId || currentUser!.role === "admin";

    return (
        <div
            className="border rounded p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={onClick}
        >
            {photo && <img src={photo} alt={name} className="w-32 h-32 object-cover rounded" />}
            <h3 className="font-bold">{name}</h3>
            <p className="text-sm text-gray-600">{author}</p>
            {canEdit && onDelete && (
                <button
                    className="border border-red-500 px-2 py-1 rounded text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                >
                    Видалити
                </button>
            )}
            {canEdit && onEdit && (
                <button
                    className="border border-yellow-500 px-2 py-1 rounded text-yellow-500 hover:bg-yellow-500 hover:text-white transition-colors"
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                >
                    Редагувати
                </button>
            )}
        </div>
    );
};
