// controllers/crm/siteVisitsController.js — scheduling/tracking property
// visits between a CrmUser and a Lead.
import prisma from "../../config/prisma.js";

export async function listSiteVisits(req, res) {
  const { leadId, upcoming } = req.query;

  const where = {};
  if (leadId) where.leadId = leadId;
  if (upcoming === "true") where.scheduledAt = { gte: new Date() };

  const siteVisits = await prisma.siteVisit.findMany({
    where,
    orderBy: { scheduledAt: "asc" },
    include: {
      lead: { select: { id: true, name: true, phone: true, propertyTitle: true } },
      crmUser: { select: { id: true, email: true } },
    },
  });
  res.json({ siteVisits });
}

export async function createSiteVisit(req, res) {
  const { leadId, scheduledAt } = req.body;
  if (!leadId || !scheduledAt) return res.status(400).json({ error: "leadId and scheduledAt are required" });

  const siteVisit = await prisma.siteVisit.create({
    data: { leadId, scheduledAt: new Date(scheduledAt), crmUserId: req.crmUser.id },
    include: {
      lead: { select: { id: true, name: true, phone: true, propertyTitle: true } },
      crmUser: { select: { id: true, email: true } },
    },
  });
  res.status(201).json({ siteVisit });
}

export async function updateSiteVisit(req, res) {
  const { status, scheduledAt } = req.body;
  const data = {};
  if (status !== undefined) data.status = status;
  if (scheduledAt !== undefined) data.scheduledAt = new Date(scheduledAt);

  if (Object.keys(data).length === 0) return res.status(400).json({ error: "No valid fields to update" });

  try {
    const siteVisit = await prisma.siteVisit.update({
      where: { id: req.params.id },
      data,
      include: {
        lead: { select: { id: true, name: true, phone: true, propertyTitle: true } },
        crmUser: { select: { id: true, email: true } },
      },
    });
    res.json({ siteVisit });
  } catch {
    res.status(404).json({ error: "Site visit not found" });
  }
}
