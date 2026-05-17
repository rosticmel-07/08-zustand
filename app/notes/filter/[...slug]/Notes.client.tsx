"use client";

import { useState } from "react";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import { useDebouncedCallback } from "use-debounce";
import Modal from "@/components/Modal/Modal";
import { NoteForm } from "@/components/NoteForm/NoteForm";
import css from "../../page.module.css";

export default function NotesClient({ tag }: { tag?: string } = {}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["notes", search, page, tag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search,
        tag: tag && tag !== "all" ? tag : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const onClose = () => setIsModalOpen(false);
  const onOpen = () => setIsModalOpen(true);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={debouncedSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            page={page}
            setPage={setPage}
          />
        )}

        <button className={css.button} type="button" onClick={onOpen}>
          Create note +
        </button>
      </header>
      {isLoading && !data && <p>Loading notes...</p>}

      {isError && <p>Error: {error?.message || "Something went wrong"}</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {data && data.notes.length === 0 && !isLoading && (
        <p>No notes found matching your search.</p>
      )}

      {isModalOpen && (
        <Modal onClose={onClose}>
          <NoteForm onCancel={onClose} />
        </Modal>
      )}
    </div>
  );
}
