import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import { RowType } from "../page";
import { formatYMDshort } from "../utils";

export function RoomItem({
  file,
  startDate,
  endDate,
}: {
  file: File;
  startDate: string;
  endDate: string;
}) {
  const [files, setFiles] = useState<RowType[]>([]);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target?.result;
      const workbook = read(binaryStr, { type: "binary" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: (string | number)[][] = utils.sheet_to_json(worksheet, {
        header: 1,
      });
      const header = jsonData[4]; // сохраняем заголовок
      const dataRows = jsonData.slice(3); // остальные строки
      console.log(dataRows, "dataRows");
      const seen = new Set<string>();
      const defaultFilter = "guest"; // сразу фильтруем по "guest"

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

      const finalData: RowType[] = [...filtered] as RowType[];
      setFiles(finalData);
    };

    reader.readAsArrayBuffer(file); // здесь file точно File
  }, [file]);

  const filteredRows =
    startDate && endDate
      ? files.filter((row, i) => {
          if (i === 0) return true; // заголовок
          const rowDate: string = row[3];
          return (
            rowDate >= formatYMDshort(new Date(startDate)) &&
            rowDate <= formatYMDshort(new Date(endDate))
          );
        })
      : files;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Дверь {file.name}</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <table className="table border">
            <tbody>
              {filteredRows?.map((row, i) => (
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
            <tfoot className="px-5 py-10">
              <tr className="text-3xl font-bold text-gray-800 p-5">
                <td className="px-10 py-5">
                  Количество дней:
                  {filteredRows
                    ? new Set(filteredRows.map((row) => row[3])).size - 1
                    : 0}
                </td>
              </tr>
            </tfoot>
          </table>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
