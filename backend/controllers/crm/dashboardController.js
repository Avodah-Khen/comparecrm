// controllers/crm/dashboardController.js — aggregate stats for the CRM
// dashboard, computed from real Lead/LeadActivity/SiteVisit data.
import prisma from "../../config/prisma.js";
import { LeadStage, LeadType } from "@prisma/client";

export async function getStats(_req, res) {
  const [totalLeads, totalSiteVisits, stageCounts, typeCounts, recentLeads, recentActivities, upcomingSiteVisits] =
    await Promise.all([
      prisma.lead.count(),
      prisma.siteVisit.count(),
      prisma.lead.groupBy({ by: ["stage"], _count: { _all: true } }),
      prisma.lead.groupBy({ by: ["leadType"], _count: { _all: true } }),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.leadActivity.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { lead: { select: { id: true, name: true } }, crmUser: { select: { id: true, email: true } } },
      }),
      prisma.siteVisit.findMany({
        where: { scheduledAt: { gte: new Date() } },
        orderBy: { scheduledAt: "asc" },
        take: 5,
        include: { lead: { select: { id: true, name: true } } },
      }),
    ]);

  const byStage = Object.fromEntries(Object.values(LeadStage).map((stage) => [stage, 0]));
  stageCounts.forEach((row) => { byStage[row.stage] = row._count._all; });

  const byType = Object.fromEntries(Object.values(LeadType).map((type) => [type, 0]));
  typeCounts.forEach((row) => { byType[row.leadType] = row._count._all; });

  res.json({ totalLeads, totalSiteVisits, byStage, byType, recentLeads, recentActivities, upcomingSiteVisits });
}
