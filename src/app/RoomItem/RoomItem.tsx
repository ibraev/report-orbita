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
      const header = jsonData[3]; // сохраняем заголовок
      const dataRows = jsonData.slice(1); // остальные строки
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

      const finalData: RowType[] = [header, ...filtered] as RowType[];
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
  console.log(filteredRows[1].length);
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
              <h2 className="text-3xl font-bold text-gray-800 p-5">
                Количество дней: {filteredRows[1].length - 1}
              </h2>
            </tfoot>
          </table>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
