// prisma/seed.js — creates the first admin CrmUser so the CRM can be
// logged into at all. Skips silently if an admin already exists.
// Run with: SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD=... npm run seed
import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

async function main() {
  const existingAdmin = await prisma.crmUser.findFirst({ where: { role: "admin" } });
  if (existingAdmin) {
    console.log(`An admin user already exists (${existingAdmin.email}) — skipping seed.`);
    return;
  }

  if (!email || !password) {
    throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before running the seed script.");
  }

  const hashed = await bcrypt.hash(password, 10);
  const admin = await prisma.crmUser.create({ data: { email, password: hashed, role: "admin" } });
  console.log(`Created admin user: ${admin.email}`);
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
