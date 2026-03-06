import express from "express";
import User from "../config/schema.js";
import Inquiry from "../config/inquirySchema.js";
import Quotation from "../config/quotationSchema.js";
import ProformaInvoice from "../config/proformaInvoiceSchema.js";
import { buildRoleFilter, isAssignedToUser } from "../utils/scope.js";

const router = express.Router();

const toDate = (value, end = false) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  if (end) date.setHours(23, 59, 59, 999);
  else date.setHours(0, 0, 0, 0);
  return date;
};

const toCsv = (rows) => {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value) => {
    const raw = String(value ?? "");
    const escaped = raw.replaceAll('"', '""');
    return `"${escaped}"`;
  };
  const lines = [headers.map(escape).join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((key) => escape(row[key])).join(","));
  });
  return lines.join("\n");
};

const applyDateFilter = (query, field, fromDate, toDateValue) => {
  if (fromDate || toDateValue) {
    query[field] = {};
    if (fromDate) query[field].$gte = fromDate;
    if (toDateValue) query[field].$lte = toDateValue;
  }
};

const mapLeads = (leads) =>
  leads.map((lead) => ({
    id: lead._id,
    name: lead.name,
    email: lead.email,
    mobile: lead.mobile,
    status: lead.status,
    assignedTo: lead.assignedTo,
    expectedValue: Number(lead.expectedValue || 0),
    createdAt: lead.createdAt,
  }));

const mapInquiries = (inquiries) =>
  inquiries.map((item) => ({
    id: item._id,
    sourceType: item.sourceType,
    sourceName: item.sourceName,
    mobile: item.mobile,
    status: item.status,
    assignedTo: item.assignedTo,
    vehicleType: item.vehicleType,
    createdAt: item.createdAt,
  }));

const mapLeadFollowups = (leads) => {
  const rows = [];
  leads.forEach((lead) => {
    (lead.followUps || []).forEach((fu) => {
      rows.push({
        leadId: lead._id,
        leadName: lead.name,
        assignedTo: lead.assignedTo,
        followupDate: fu.date,
        status: fu.status,
        priority: fu.priority,
        note: fu.note,
      });
    });
  });
  return rows;
};

const mapInquiryFollowups = (inquiries, req) => {
  const rows = [];
  inquiries.forEach((inquiry) => {
    if (!isAssignedToUser(inquiry.assignedTo, req)) return;
    (inquiry.followups || []).forEach((fu) => {
      rows.push({
        inquiryId: inquiry._id,
        sourceName: inquiry.sourceName,
        sourceType: inquiry.sourceType,
        assignedTo: inquiry.assignedTo,
        followupDate: fu.followupDate,
        status: fu.status,
        priority: fu.priority,
        remarks: fu.remarks,
      });
    });
  });
  return rows;
};

const applyCommonArrayFilter = (rows, { status, assignedTo, fromDate, toDateValue, dateField = "createdAt" }) =>
  rows.filter((row) => {
    if (status && String(row.status || "") !== status) return false;
    if (assignedTo && String(row.assignedTo || "") !== assignedTo) return false;
    const dateValue = row[dateField] ? new Date(row[dateField]) : null;
    if (fromDate && (!dateValue || dateValue < fromDate)) return false;
    if (toDateValue && (!dateValue || dateValue > toDateValue)) return false;
    return true;
  });

router.get("/:module", async (req, res) => {
  try {
    const moduleName = req.params.module;
    const { status = "", assignedTo = "", sourceType = "", export: exportType = "" } = req.query;
    const fromDate = toDate(req.query.from);
    const toDateValue = toDate(req.query.to, true);

    let rows = [];

    if (moduleName === "leads") {
      const query = buildRoleFilter(req, { type: { $in: ["lead", "Lead"] } });
      if (status) query.status = status;
      if (assignedTo) query.assignedTo = assignedTo;
      applyDateFilter(query, "createdAt", fromDate, toDateValue);
      const leads = await User.find(query).sort({ createdAt: -1 });
      rows = mapLeads(leads);
    } else if (moduleName === "inquiries") {
      const query = buildRoleFilter(req, {});
      if (status) query.status = status;
      if (assignedTo) query.assignedTo = assignedTo;
      if (sourceType) query.sourceType = sourceType;
      applyDateFilter(query, "createdAt", fromDate, toDateValue);
      const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
      rows = mapInquiries(inquiries);
    } else if (moduleName === "lead-followups") {
      const query = buildRoleFilter(req, { type: { $in: ["lead", "Lead"] } });
      const leads = await User.find(query).select("name assignedTo followUps");
      rows = applyCommonArrayFilter(mapLeadFollowups(leads), {
        status,
        assignedTo,
        fromDate,
        toDateValue,
        dateField: "followupDate",
      });
    } else if (moduleName === "inquiry-followups") {
      const inquiries = await Inquiry.find(buildRoleFilter(req, {})).select(
        "sourceName sourceType assignedTo followups"
      );
      rows = applyCommonArrayFilter(mapInquiryFollowups(inquiries, req), {
        status,
        assignedTo,
        fromDate,
        toDateValue,
        dateField: "followupDate",
      });
    } else if (moduleName === "quotations") {
      const query = {};
      if (status) query.status = status;
      if (sourceType) query.sourceType = sourceType;
      applyDateFilter(query, "createdAt", fromDate, toDateValue);
      const quotations = await Quotation.find(query).sort({ createdAt: -1 });
      rows = quotations.map((quote) => ({
        id: quote._id,
        customerName: quote.customerName,
        status: quote.status,
        sourceType: quote.sourceType,
        grandTotal: quote.grandTotal,
        validUntil: quote.validUntil,
        createdAt: quote.createdAt,
      }));
    } else if (moduleName === "proforma") {
      const query = {};
      if (status) query.status = status;
      if (sourceType) query.sourceType = sourceType;
      applyDateFilter(query, "createdAt", fromDate, toDateValue);
      const invoices = await ProformaInvoice.find(query).sort({ createdAt: -1 });
      rows = invoices.map((invoice) => ({
        id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        customerName: invoice.customerName,
        status: invoice.status,
        sourceType: invoice.sourceType,
        grandTotal: invoice.grandTotal,
        issueDate: invoice.issueDate,
        createdAt: invoice.createdAt,
      }));
    } else {
      return res.status(404).json({ message: "Unsupported report module" });
    }

    if (exportType === "csv") {
      const csv = toCsv(rows);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=${moduleName}-report.csv`);
      return res.send(csv);
    }

    return res.json({ module: moduleName, count: rows.length, rows });
  } catch (error) {
    console.error("Error fetching report:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
