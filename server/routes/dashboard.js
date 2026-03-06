import express from "express";
import User from "../config/schema.js";
import Task from "../config/taskSchema.js";
import Inquiry from "../config/inquirySchema.js";
import Quotation from "../config/quotationSchema.js";
import ProformaInvoice from "../config/proformaInvoiceSchema.js";
import { buildRoleFilter, isAssignedToUser } from "../utils/scope.js";

const router = express.Router();

const buildFollowupBuckets = (items, dateKey) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const today = [];
  const overdue = [];
  const upcoming = [];

  items.forEach((item) => {
    const dateValue = new Date(item?.[dateKey]);
    if (Number.isNaN(dateValue.getTime())) return;

    if (dateValue >= startOfToday && dateValue < startOfTomorrow) {
      today.push(item);
    } else if (dateValue < startOfToday) {
      overdue.push(item);
    } else {
      upcoming.push(item);
    }
  });

  return { today, overdue, upcoming };
};

router.get("/summary", async (req, res) => {
  try {
    const leadFilter = buildRoleFilter(req, { type: { $in: ["lead", "Lead"] } });

    const [
      leads,
      pendingTasks,
      inquiries,
      quotations,
      proformaInvoices,
      totalCustomers,
    ] = await Promise.all([
      User.find(leadFilter).select("name assignedTo status expectedValue followUps mobile contactPerson"),
      Task.countDocuments(buildRoleFilter(req, { status: { $ne: "Completed" } })),
      Inquiry.find(buildRoleFilter(req, {})).select(
        "sourceName sourceType status assignedTo followups mobile vehicleType"
      ),
      Quotation.find().select("status grandTotal customerName customerMobile validUntil sourceType sourceId"),
      ProformaInvoice.find().select("status grandTotal customerName customerMobile issueDate sourceType sourceId"),
      User.countDocuments({ type: { $in: ["customer", "Customer"] } }),
    ]);

    const stageCounts = {
      new: 0,
      qualified: 0,
      won: 0,
      lost: 0,
      active: 0,
    };

    let convertedLeadRevenue = 0;

    leads.forEach((lead) => {
      const normalizedStatus = String(lead.status || "").toLowerCase();
      if (normalizedStatus === "new") stageCounts.new += 1;
      if (normalizedStatus === "qualified") stageCounts.qualified += 1;
      if (normalizedStatus === "converted") stageCounts.won += 1;
      if (normalizedStatus === "lost") stageCounts.lost += 1;
      if (!["converted", "lost", "inactive"].includes(normalizedStatus)) {
        stageCounts.active += 1;
      }
      if (normalizedStatus === "converted") {
        convertedLeadRevenue += Number(lead.expectedValue || 0);
      }
    });

    const leadFollowupRows = [];
    leads.forEach((lead) => {
      (lead.followUps || [])
        .filter((fu) => fu.status !== "Completed")
        .forEach((fu) => {
          leadFollowupRows.push({
            leadId: lead._id,
            leadName: lead.name,
            mobile: lead.mobile,
            contactPerson: lead.contactPerson,
            assignedTo: lead.assignedTo,
            status: fu.status,
            priority: fu.priority,
            note: fu.note,
            date: fu.date,
          });
        });
    });

    const inquiryFollowupRows = [];
    inquiries.forEach((inquiry) => {
      if (!isAssignedToUser(inquiry.assignedTo, req)) return;
      (inquiry.followups || [])
        .filter((fu) => fu.status !== "Completed")
        .forEach((fu) => {
          inquiryFollowupRows.push({
            inquiryId: inquiry._id,
            sourceName: inquiry.sourceName,
            sourceType: inquiry.sourceType,
            mobile: inquiry.mobile,
            assignedTo: inquiry.assignedTo,
            status: fu.status,
            priority: fu.priority,
            remarks: fu.remarks,
            followupDate: fu.followupDate,
          });
        });
    });

    const leadBuckets = buildFollowupBuckets(leadFollowupRows, "date");
    const inquiryBuckets = buildFollowupBuckets(inquiryFollowupRows, "followupDate");

    const quoteStats = {
      total: quotations.length,
      draft: quotations.filter((q) => q.status === "Draft").length,
      accepted: quotations.filter((q) => q.status === "Accepted").length,
      value: quotations.reduce((sum, q) => sum + Number(q.grandTotal || 0), 0),
    };

    const proformaStats = {
      total: proformaInvoices.length,
      issued: proformaInvoices.filter((p) => p.status === "Issued").length,
      paid: proformaInvoices.filter((p) => p.status === "Paid").length,
      value: proformaInvoices.reduce((sum, p) => sum + Number(p.grandTotal || 0), 0),
    };

    res.json({
      totalCustomers,
      pendingTasks,
      stageCounts,
      revenue: {
        convertedLeadRevenue,
        quotationValue: quoteStats.value,
        proformaValue: proformaStats.value,
      },
      leadFollowups: {
        today: leadBuckets.today,
        overdue: leadBuckets.overdue,
        upcoming: leadBuckets.upcoming,
      },
      inquiryFollowups: {
        today: inquiryBuckets.today,
        overdue: inquiryBuckets.overdue,
        upcoming: inquiryBuckets.upcoming,
      },
      quotation: quoteStats,
      proforma: proformaStats,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
