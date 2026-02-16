import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma/client";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: { 
    enabled: true, 
  }, 
  user: {
        additionalFields: {
            role: { type: "string", required: true },
            year: { type: "number", required: true },
            phone_no: { type: "string", required: true }
        }
    },
  plugins: [nextCookies()]
});