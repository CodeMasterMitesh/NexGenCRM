export const exportRowsToCsv = (rows, fileName = "export.csv") => {
  if (!Array.isArray(rows) || rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const escapeValue = (value) => {
    const raw = String(value ?? "");
    return `"${raw.replaceAll('"', '""')}"`;
  };

  const csvRows = [
    headers.map(escapeValue).join(","),
    ...rows.map((row) => headers.map((key) => escapeValue(row[key])).join(",")),
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
};
