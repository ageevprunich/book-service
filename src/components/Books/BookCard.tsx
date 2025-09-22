interface BookCardProps {
    name: string;
    author: string;
    photo?: string;
    onDelete?: () => void;
}

export const BookCard = ({ name, author, photo, onDelete }: BookCardProps) => {
    return (
        <div className="border rounded p-4 flex flex-col items-center gap-2">
            {photo && <img src={photo} alt={name} className="w-32 h-32 object-cover rounded" />}
            <h3 className="font-bold">{name}</h3>
            <p className="text-sm text-gray-600">{author}</p>
            {onDelete && (
                <button
                    className="border border-red-500 px-2 py-1 rounded text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    onClick={onDelete}
                >
                    Видалити
                </button>
            )}
        </div>
    );
};
