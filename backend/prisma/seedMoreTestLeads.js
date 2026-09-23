// prisma/seedMoreTestLeads.js — one-off: adds 10 NEW realistic TEST leads
// (stage "new", customer/developer mix) without touching any existing rows.
// Names are prefixed "TEST2 - " so they're clearly identifiable.
import "dotenv/config";
import prisma from "../config/prisma.js";

const NEW_TEST_LEADS = [
  { leadType: "customer", name: "TEST2 - Arjun Nair", email: "arjun.nair@example.com", phone: "9876511001", source: "property_page_contact", stage: "new", propertyTitle: "Emerald Court 2BHK" },
  { leadType: "customer", name: "TEST2 - Divya Iyer", email: "divya.iyer@example.com", phone: "9876511002", source: "google_ads", stage: "new", propertyTitle: "Silver Oak Residency" },
  { leadType: "customer", name: "TEST2 - Farhan Sheikh", email: "farhan.sheikh@example.com", phone: "9876511003", source: "whatsapp_enquiry", stage: "new", propertyTitle: "Maple Grove Apartments" },
  { leadType: "customer", name: "TEST2 - Ishita Bose", email: "ishita.bose@example.com", phone: "9876511004", source: "referral", stage: "new", propertyTitle: "Blue Ridge Towers" },
  { leadType: "customer", name: "TEST2 - Manoj Pillai", email: "manoj.pillai@example.com", phone: "9876511005", source: "property_page_contact", stage: "new", propertyTitle: "Cedar Park Villas" },
  { leadType: "customer", name: "TEST2 - Ritu Chawla", email: "ritu.chawla@example.com", phone: "9876511006", source: "facebook_ads", stage: "new", propertyTitle: "Golden Meadows 3BHK" },
  { leadType: "developer", name: "TEST2 - Aravalli Infra Developers", email: "sales@aravalliinfra.example.com", phone: "9876511007", source: "developer_signup", stage: "new", propertyTitle: "Aravalli Tech Park" },
  { leadType: "developer", name: "TEST2 - Coastal Realty Developers", email: "info@coastalrealty.example.com", phone: "9876511008", source: "developer_signup", stage: "new", propertyTitle: "Coastal Marina Residences" },
  { leadType: "developer", name: "TEST2 - Northgate Builders & Developers", email: "contact@northgatebuilders.example.com", phone: "9876511009", source: "property_page_contact", stage: "new", propertyTitle: "Northgate Business Hub" },
  { leadType: "developer", name: "TEST2 - Summit Urban Developers", email: "hello@summiturban.example.com", phone: "9876511010", source: "referral", stage: "new", propertyTitle: "Summit Heights Commercial" },
];

async function main() {
  const before = await prisma.lead.count();

  const existing = await prisma.lead.findFirst({ where: { name: { startsWith: "TEST2 - " } } });
  if (existing) {
    console.log(`RESULT: SKIPPED (TEST2 leads already exist) total=${before}`);
    return;
  }

  await prisma.lead.createMany({ data: NEW_TEST_LEADS });
  const after = await prisma.lead.count();
  console.log(`RESULT: CREATED ${after - before} leads. before=${before} after=${after}`);
}

main()
  .catch((err) => {
    console.log("RESULT: ERROR", err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
