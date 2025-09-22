import { Book } from "@/services/bookService";

interface BooksLogicParams {
  books: Book[];
  search: string;
  sortAsc: boolean;
  currentPage: number;
  pageSize: number;
}

export const getFilteredSortedPaginatedBooks = ({
  books,
  search,
  sortAsc,
  currentPage,
  pageSize,
}: BooksLogicParams) => {
  const filtered = books.filter(
    (book) =>
      book.name.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = filtered.sort((a, b) =>
    sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginated = sorted.slice(startIndex, startIndex + pageSize);

  const totalPages = Math.ceil(filtered.length / pageSize);

  return { paginated, totalPages };
};
