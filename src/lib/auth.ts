import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma/client";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import type { HookEndpointContext } from "@better-auth/core";
import { headers } from "next/headers";

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
    before: createAuthMiddleware(async (ctx) => {
      const hookCtx = ctx as unknown as HookEndpointContext;
      console.log(hookCtx);
      // Only Admin or Principal can create new accounts
      if (hookCtx.path === "/sign-up/email") {
        const session = await auth.api.getSession({ headers: await headers() });
        const callerRole = session?.user?.role;

        if (callerRole !== "Admin" && callerRole !== "Principal") {
          throw new APIError("FORBIDDEN", {
            message: "Only Admins or Principals can create accounts",
          });
        }
      }
    }),
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
            status: "Pending",
          },
          include: {
            parent: true,
            student: true,
          },
        });

        console.log("ParentStudent relation created");
      }
    }),
  },
});
