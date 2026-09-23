// prisma/seedTestLeads.js — one-off: adds 10 realistic TEST leads for
// exercising Customer/Developer CRM views. Names are prefixed "TEST -" so
// they're clearly identifiable and never mistaken for real site traffic.
// Safe to run once; skips if TEST leads already exist.
import "dotenv/config";
import prisma from "../config/prisma.js";

const TEST_LEADS = [
  { leadType: "customer", name: "TEST - Priya Sharma", email: "priya.sharma@example.com", phone: "9876500001", source: "property_page_contact", stage: "new", propertyTitle: "Sunrise Heights 2BHK" },
  { leadType: "customer", name: "TEST - Rohan Mehta", email: "rohan.mehta@example.com", phone: "9876500002", source: "whatsapp_enquiry", stage: "contacted", propertyTitle: "Green Valley Villas" },
  { leadType: "customer", name: "TEST - Anita Desai", email: "anita.desai@example.com", phone: "9876500003", source: "property_page_contact", stage: "qualified", propertyTitle: "Lakeview Residency" },
  { leadType: "customer", name: "TEST - Karan Verma", email: "karan.verma@example.com", phone: "9876500004", source: "referral", stage: "converted", propertyTitle: "Orchid Towers 3BHK" },
  { leadType: "customer", name: "TEST - Neha Kapoor", email: "neha.kapoor@example.com", phone: "9876500005", source: "property_page_contact", stage: "rejected", propertyTitle: "Palm Grove Apartments" },
  { leadType: "developer", name: "TEST - Vikram Developers", email: "contact@vikramdevelopers.example.com", phone: "9876500006", source: "developer_signup", stage: "new", propertyTitle: "Skyline Business Park" },
  { leadType: "developer", name: "TEST - Horizon Builders Group", email: "sales@horizonbuilders.example.com", phone: "9876500007", source: "developer_signup", stage: "contacted", propertyTitle: "Horizon Corporate Plaza" },
  { leadType: "broker", name: "TEST - Sameer Realty Associates", email: "sameer@realtyassociates.example.com", phone: "9876500008", source: "broker_referral", stage: "qualified" },
  { leadType: "broker", name: "TEST - Meera Property Consultants", email: "meera@propertyconsult.example.com", phone: "9876500009", source: "broker_referral", stage: "new" },
  { leadType: "builder", name: "TEST - Shivam Construction Co", email: "info@shivamconstruction.example.com", phone: "9876500010", source: "builder_signup", stage: "contacted", propertyTitle: "Riverside Enclave Phase 2" },
];

async function main() {
  const existing = await prisma.lead.findFirst({ where: { name: { startsWith: "TEST - " } } });
  if (existing) {
    console.log("TEST leads already exist — skipping.");
    return;
  }

  await prisma.lead.createMany({ data: TEST_LEADS });
  console.log(`Created ${TEST_LEADS.length} TEST leads.`);
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
