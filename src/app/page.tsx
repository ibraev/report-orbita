"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoomItem } from "./RoomItem/RoomItem";
import Filter from "./Filter/Filter";

export type RowType = [number, string, string, string, number]; // пример: 5 колонок

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return; // <-- проверяем, что файл выбран

    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    // Добавляем новые файлы в общий список, исключая дубликаты
    setFiles((prev) => {
      const newFiles = [...prev];

      selectedFiles.forEach((file) => {
        if (
          !newFiles.find((f) => f.name === file.name && f.size === file.size)
        ) {
          newFiles.push(file);
        }
      });
      return newFiles;
    });

    e.target.value = "";
  };

  return (
    <div className="container mx-auto">
      <main className="flex flex-col justify-around pt-10">
        <div className="flex w-full items-center gap-2">
          <div className="flex flex-col flex-1">
            <div className=" flex flex-col flex-1 items-start gap-3">
              <Label htmlFor="file">Выберите excell файл</Label>
              <Input
                id="file"
                onChange={handleFileUpload}
                type="file"
                multiple
                accept=".xls,.xlsx,.csv"
              />
            </div>
            <Filter
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />

            <div className="flex gap-5 mt-5 items-end">
              <div className="flex flex-1">
                {files.length > 0 ? (
                  <ul className="mt-4 space-y-2 flex flex-1 flex-col">
                    {files.map((file, i) => (
                      <RoomItem
                        file={file}
                        key={i}
                        startDate={startDate}
                        endDate={endDate}
                      />
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
