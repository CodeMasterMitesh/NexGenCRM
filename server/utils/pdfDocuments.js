import PDFDocument from "pdfkit";

const currency = (value) => `INR ${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const drawHeader = (doc, title) => {
  doc.rect(0, 0, doc.page.width, 95).fill("#eaf4ff");
  doc.fillColor("#104a8e").fontSize(20).text("NexGenCRM", 48, 28, { continued: true });
  doc.fillColor("#2a8f4a").text(" Sales");
  doc.fillColor("#202020").fontSize(11).text("Drive. Optimize. Succeed.", 48, 56);
  doc.fontSize(18).fillColor("#0b3b73").text(title, 390, 34, { align: "right", width: 160 });
  doc.moveTo(40, 95).lineTo(doc.page.width - 40, 95).stroke("#9fc4eb");
};

const drawMeta = (doc, entity, y) => {
  const leftX = 48;
  const rightX = 330;
  doc.fillColor("#222").fontSize(11);
  doc.text(`Customer: ${entity.customerName || "-"}`, leftX, y);
  doc.text(`Email: ${entity.customerEmail || "-"}`, leftX, y + 16);
  doc.text(`Mobile: ${entity.customerMobile || "-"}`, leftX, y + 32);

  doc.text(`Status: ${entity.status || "Draft"}`, rightX, y);
  doc.text(`Created By: ${entity.createdBy || "-"}`, rightX, y + 16);
  if (entity.issueDate) {
    doc.text(`Issue Date: ${new Date(entity.issueDate).toLocaleDateString()}`, rightX, y + 32);
  } else if (entity.validUntil) {
    doc.text(`Valid Until: ${new Date(entity.validUntil).toLocaleDateString()}`, rightX, y + 32);
  }
};

const drawItemsTable = (doc, items, startY) => {
  let y = startY;
  const columns = [48, 82, 298, 360, 430, 500];

  doc.rect(48, y, 510, 24).fill("#0b3b73");
  doc.fillColor("white").fontSize(10);
  doc.text("#", columns[0] + 6, y + 7);
  doc.text("Item", columns[1], y + 7);
  doc.text("Qty", columns[2], y + 7, { width: 55, align: "right" });
  doc.text("Unit", columns[3], y + 7, { width: 65, align: "right" });
  doc.text("Tax%", columns[4], y + 7, { width: 45, align: "right" });
  doc.text("Amount", columns[5], y + 7, { width: 52, align: "right" });

  y += 24;
  doc.fillColor("#222");

  const safeItems = Array.isArray(items) ? items : [];
  safeItems.forEach((item, index) => {
    const lineTotal = (Number(item.quantity || 0) * Number(item.unitPrice || 0)) - Number(item.discount || 0);
    if (y > 690) {
      doc.addPage();
      y = 56;
    }
    if (index % 2 === 0) {
      doc.rect(48, y, 510, 24).fill("#f6faff");
      doc.fillColor("#222");
    }
    doc.fontSize(10);
    doc.text(String(index + 1), columns[0] + 6, y + 7);
    doc.text(item.productName || "-", columns[1], y + 7, { width: 205, ellipsis: true });
    doc.text(String(item.quantity || 0), columns[2], y + 7, { width: 55, align: "right" });
    doc.text(currency(item.unitPrice || 0), columns[3], y + 7, { width: 65, align: "right" });
    doc.text(String(item.taxRate || 0), columns[4], y + 7, { width: 45, align: "right" });
    doc.text(currency(lineTotal), columns[5], y + 7, { width: 52, align: "right" });
    y += 24;
  });

  return y + 10;
};

const drawTotals = (doc, entity, y) => {
  const x = 360;
  doc.fontSize(11).fillColor("#222");
  doc.text(`Subtotal: ${currency(entity.subtotal)}`, x, y, { width: 190, align: "right" });
  doc.text(`Discount: ${currency(entity.discountTotal)}`, x, y + 18, { width: 190, align: "right" });
  doc.text(`Tax: ${currency(entity.taxTotal)}`, x, y + 36, { width: 190, align: "right" });
  doc.fontSize(13).fillColor("#0b3b73").text(`Grand Total: ${currency(entity.grandTotal)}`, x, y + 58, { width: 190, align: "right" });
};

const drawFooter = (doc, entity) => {
  const notesY = 735;
  doc.fontSize(10).fillColor("#333").text(`Notes: ${entity.notes || "-"}`, 48, notesY, { width: 320 });
  doc.text("Authorized Signature", 420, notesY + 36, { width: 130, align: "center" });
  doc.moveTo(420, notesY + 34).lineTo(550, notesY + 34).stroke("#888");
};

export const renderSalesPdfBuffer = (entity, title) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 30 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    drawHeader(doc, title);
    drawMeta(doc, entity, 114);
    const tableEnd = drawItemsTable(doc, entity.items, 180);
    drawTotals(doc, entity, tableEnd);
    drawFooter(doc, entity);

    doc.end();
  });
