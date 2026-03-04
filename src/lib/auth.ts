import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma/client";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";
import type { HookEndpointContext } from "@better-auth/core";

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
      year: { type: "string", required: true },
      phone_no: { type: "string", required: true },
    },
  },

  plugins: [nextCookies()],

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const hookCtx = ctx as unknown as HookEndpointContext;

      // only run after user signup
      if (hookCtx.path !== "/sign-up/email") return;

      const user =
        hookCtx.context?.newSession?.user ?? hookCtx.context?.session?.user;
      const studentId = (hookCtx.body as { studentId?: string })?.studentId;

      console.log("Hook triggered:", user?.id);

      if (user?.role === "Parent" && studentId) {
        await prisma.parentStudent.create({
          data: {
            parent_id: user.id,
            student_id: studentId,
            role: "Guardian",
          },
        });

        console.log("ParentStudent relation created");
      }
    }),
  },
});
