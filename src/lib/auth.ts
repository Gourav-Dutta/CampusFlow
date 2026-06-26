import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma/client";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import type { HookEndpointContext } from "@better-auth/core";
import { headers } from "next/headers";
import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// });

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    //     sendResetPassword: async ({ user, url }) => {
    //     await transporter.sendMail({
    //       from: `"Campus Flow" <${process.env.GMAIL_USER}>`,
    //       to: user.email,
    //       subject: "Reset your password",
    //       html: `
    //         <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px;">
    //           <h2>Password Reset Request</h2>
    //           <p>Hi <strong>${user.name}</strong>,</p>
    //           <p>Click below to reset your password. Link expires in <strong>1 hour</strong>.</p>
    //           <a href="${url}" style="display:block; text-align:center; padding:12px; background:#4F46E5; color:white; border-radius:6px; text-decoration:none; margin:24px 0;">
    //             Reset Password
    //           </a>
    //           <p style="color:#888; font-size:13px;">If you didn't request this, ignore this email.</p>
    //         </div>
    //       `,
    //     });
    //   },
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
    // after: createAuthMiddleware(async (ctx) => {
    //   const hookCtx = ctx as unknown as HookEndpointContext;

    //   // only run after user signup
    //   if (hookCtx.path !== "/sign-up/email") return;

    //   const user =
    //     hookCtx.context?.newSession?.user ?? hookCtx.context?.session?.user;
    //   const studentId = (hookCtx.body as { studentId?: string })?.studentId;

    //   console.log("Hook triggered:", user?.id);

    //   if (user?.role === "Parent" && studentId) {
    //     await prisma.parentStudent.create({
    //       data: {
    //         parent_id: user.id,
    //         student_id: studentId,
    //         role: "Guardian",
    //         status: "Pending",
    //       },
    //       include: {
    //         parent: true,
    //         student: true,
    //       },
    //     });

    //     console.log("ParentStudent relation created");
    //   }
    // }),
  },
});
