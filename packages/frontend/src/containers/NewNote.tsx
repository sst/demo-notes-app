import React, { useRef, useState } from "react";
import { NoteType } from "../types/note";
import { onError } from "../lib/errorLib";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../lib/hooksLib";
import config from "../config";

export default function NewNote() {
  const file = useRef<null | File>(null);
  const authFetch = useAuthFetch();
  const nav = useNavigate();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.files === null) return;
    file.current = event.currentTarget.files[0];
  }

  function createNote(note: NoteType) {
    return authFetch(`${config.API_URL}notes`, {
      method: "POST",
      body: JSON.stringify(note),
    });
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
      const attachment = file.current
        ? await handleUpload(file.current)
        : undefined;

      await createNote({ content, attachment });
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col gap-4">
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-72 p-3 border border-gray-300 rounded text-2xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="file" className="block font-medium text-gray-700">
            Attachment
          </label>
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
            variant="primary"
            loading={isLoading}
            disabled={!validateForm()}
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}
