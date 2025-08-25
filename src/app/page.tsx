"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function formatYMDshort(date: Date) {
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function Home() {
  type RowType = [number, string, string, string, number]; // пример: 5 колонок

  const [files, setFile] = useState<RowType[]>([]);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filtered, setFiltered] = useState<RowType[]>([]);

  const defaultFilter = "guest"; // сразу фильтруем по "guest"

  const handleFilter = () => {
    if (!startDate || !endDate) return;

    const start = formatYMDshort(new Date(startDate));
    const end = formatYMDshort(new Date(endDate));

    const res: RowType[] = files.filter((row) => {
      const rowDate = row[3];
      return rowDate >= start && rowDate <= end;
    });

    setFiltered(res);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate("");
    setEndDate("");
    const file = e.target.files?.[0];
    if (!file) return; // <-- проверяем, что файл выбран

    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // Берём первый лист
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: (string | number)[][] = XLSX.utils.sheet_to_json(
        worksheet,
        {
          header: 1,
        }
      );
      const header = jsonData[3]; // сохраняем заголовок
      const dataRows = jsonData.slice(1); // остальные строки
      const seen = new Set<string>();

      const filtered = dataRows.filter((row, index) => {
        if (index === 0) return true; // оставляем заголовок

        const matchesFilter = row.some((cell) =>
          String(cell || "")
            .toLowerCase()
            .includes(defaultFilter)
        ) as unknown as RowType[];

        if (!matchesFilter) return false;

        const date = String(row[3]);

        if (seen.has(date)) return false;

        seen.add(date);
        return true;
      });

      const finalData: RowType[] = [header, ...filtered] as RowType[];

      setFile(finalData);
    };

    reader.readAsArrayBuffer(file);
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
                placeholder="Открыть"
              />
            </div>

            <div className="flex gap-5 mt-5 items-end">
              <div className="flex flex-col flex-1 items-start gap-3">
                <Label>Начало</Label>
                <Input
                  disabled={files.length === 0}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border p-2"
                  placeholder="начало даты"
                  required
                />
              </div>
              <div className="flex flex-col flex-1 items-start gap-3">
                <Label>Конец</Label>
                <Input
                  type="date"
                  disabled={files.length === 0}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border p-2"
                  placeholder="конец даты"
                  required
                />
              </div>

              <Button
                disabled={!startDate || !endDate}
                onClick={handleFilter}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Фильтровать по периоду
              </Button>
            </div>
          </div>
        </div>
        <table className="min-w-full border border-gray-300 mt-5">
          <tbody>
            {filtered.map((row, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"} // полосатые строки
              >
                {Object.values(row).map((val, j) => (
                  <td
                    key={j}
                    className="px-4 py-2 border-b border-gray-300 text-sm text-gray-800"
                  >
                    {val as string}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
