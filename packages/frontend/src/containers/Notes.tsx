import React, { useRef, useState, useEffect } from "react";
import config from "../config";
import { NoteType } from "../types/note";
import { onError } from "../lib/errorLib";
import Button from "../components/Button";
import { useAuthFetch } from "../lib/hooksLib";
import { useParams, useNavigate } from "react-router-dom";

export default function Notes() {
  const file = useRef<null | File>(null);
  const authFetch = useAuthFetch();
  const { id } = useParams();
  const nav = useNavigate();
  const [note, setNote] = useState<null | NoteType>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadNote() {
      return authFetch(`${config.API_URL}notes/${id}`);
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment) {
          const { url } = await getPresignedDownload(attachment);
          note.attachmentURL = url;
        }

        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return content.length > 0;
  }

  function formatFilename(str: string) {
    return str.split("/")[1].replace(/^\w+-/, "");
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.files === null) return;
    file.current = event.currentTarget.files[0];
  }

  function saveNote(note: NoteType) {
    return authFetch(`${config.API_URL}notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(note),
    });
  }

  function getPresignedDownload(path: string) {
    return authFetch(`${config.API_URL}presign?path=${encodeURIComponent(path)}`);
  }

  function getPresignedUpload(fileName: string, fileType: string) {
    return authFetch(`${config.API_URL}presign`, {
      method: "POST",
      body: JSON.stringify({ fileName, fileType }),
    });
  }

  async function handleUpload(file: File) {
    const res = await getPresignedUpload(file.name, file.type);

    await fetch(res.url, {
      body: file,
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="${file.name}"`,
      },
    });

    return res.path;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    let attachment;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        attachment = await handleUpload(file.current);
      } else if (note && note.attachment) {
        attachment = note.attachment;
      }

      await saveNote({ content: content, attachment: attachment });
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteNote() {
    return authFetch(`${config.API_URL}notes/${id}`, {
      method: "DELETE",
    });
  }

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteNote();
      nav("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="container mx-auto px-4">
      {note && (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col gap-6">
          <textarea
            id="content"
            className="w-full h-72 p-3 text-2xl border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="file" className="block font-medium text-gray-700">
              Attachment
            </label>
            {note.attachment && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note.attachmentURL}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {formatFilename(note.attachment)}
                </a>
              </p>
            )}
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="w-full text-gray-700 border border-gray-300 overflow-hidden rounded focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:border-r file:border-gray-300 file:text-gray-700 file:bg-gray-100 file:cursor-pointer hover:file:bg-gray-200"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              loading={isLoading}
              disabled={!validateForm()}
            >
              Save
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
