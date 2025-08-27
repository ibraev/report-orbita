import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import React from "react";

export default function Filter({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: {
  startDate: string;
  endDate: string;
  setStartDate: (val: string) => void;
  setEndDate: (val: string) => void;
}) {
  return (
    <div className="flex flex-row gap-2 mt-3">
      <div className="flex flex-col flex-1 items-start gap-3">
        <Label>Начало</Label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={startDate ? "border-green-400" : "border-red-500"}
          placeholder="начало даты"
          required
        />
      </div>
      <div className="flex flex-col flex-1 items-start gap-3">
        <Label>Конец</Label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={endDate ? "border-green-400" : "border-red-500"}
          placeholder="конец даты"
          required
        />
      </div>
    </div>
  );
}
