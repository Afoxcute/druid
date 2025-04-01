import { z } from "zod";
import { Twilio } from "twilio";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

async function sendSms(to: string, text: string) {
  // Read Twilio credentials from environment variables
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN; 
  
  if (!accountSid || !authToken) {
    console.error("Twilio credentials are not configured");
    throw new Error("Twilio credentials are not configured");
  }
  
  const client = new Twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER || "+12135148760", // Fallback to hardcoded number if env not set
      body: text,
    });
    console.log("Message sent:", message.sid);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export const postRouter = createTRPCRouter({
  otp: publicProcedure
    .input(z.object({ phone: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // const otp = Math.floor(100000 + Math.random() * 900000);
        const otp = "000000";
        let user = await ctx.db.user.findUnique({
          where: {
            phone: input.phone,
          },
        });
        if (!user) {
          user = await ctx.db.user.create({
            data: {
              phone: input.phone,
            },
          });
        }
        // TODO: Enable this
        if (String(env.ENABLE_SMS) === "true") {
          try {
            await sendSms(input.phone, `Your payu OTP is: ${otp}`);
          } catch (error) {
            console.error("Failed to send SMS:", error);
            if (error instanceof Error && error.message.includes("not configured")) {
              throw new Error("SMS service is not properly configured. Please contact support.");
            } else {
              throw new Error("Failed to send verification code. Please try again.");
            }
          }
        }
        await ctx.db.oTPVerification.upsert({
          where: {
            userId: user.id,
          },
          create: {
            userId: user.id,
            otpCode: String(otp),
            verified: false,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          },
          update: {
            otpCode: String(otp),
            verified: false,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          },
        });
        return otp;
      } catch (error) {
        console.error("OTP generation error:", error);
        throw error;
      }
    }),
  verifyOtp: publicProcedure
    .input(z.object({ phone: z.string(), otp: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const verification = await ctx.db.oTPVerification.findFirst({
        where: {
          user: {
            phone: input.phone,
          },
          otpCode: input.otp,
          verified: false,
          expiresAt: {
            gte: new Date(),
          },
        },
        include: {
          user: true,
        },
      });
      if (!verification) {
        throw new Error("Invalid or expired verification code");
      }
      await ctx.db.oTPVerification.update({
        where: {
          id: verification.id,
        },
        data: {
          verified: true,
        },
      });
      return verification.user;
    }),
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // Create a placeholder implementation that returns something
      return { success: true, message: `Created ${input.name}` };
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    return null;
  }),
});