export function formatYMDshort(date: Date) {
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }

  function countUniqueDays(rows: (string | number)[][]): number {
    const dates = new Set<string>();
  
    rows.forEach((row, i) => {
      if (i === 0) return; // пропускаем заголовок
      const rawDate = row[3];
      if (!rawDate) return;
  
      // нормализуем в YYYY-MM-DD
      const date = formatYMDshort(new Date(rawDate));
      dates.add(date);
    });
  
    return dates.size;
  }