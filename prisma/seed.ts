import crypto from "node:crypto";
import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/db";

const ADMIN_EMAIL = "dima83ido@gmail.com";
const ADMIN_NAME = "Dmitry";

function generatePassword(length = 20) {
  const charset =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, (byte) => charset[byte % charset.length]).join("");
}

async function main() {
  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "ADMIN", password: passwordHash },
    create: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      password: passwordHash,
      role: "ADMIN",
    },
  });

  console.log("ADMIN_ACCOUNT_CREATED");
  console.log(`email: ${user.email}`);
  console.log(`password: ${password}`);
  console.log(`role: ${user.role}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
