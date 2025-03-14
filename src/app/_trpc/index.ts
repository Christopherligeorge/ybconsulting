//import { router } from './trpc';
//import { publicProcedure } from './trpc';

import { initTRPC } from '@trpc/server'
import { z } from 'zod';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import { TRPCError } from '@trpc/server';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query'
import { absoluteUrl } from '@/lib/utils'
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe'

const t = initTRPC.create()

export const router = t.router
export const publicProcedure = t.procedure

export const appRouter = router({
  getUserSubscriptionPlan: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) {
      return {
        name: 'Free',
        isSubscribed: false,
        isCanceled: false,
        stripeCurrentPeriodEnd: null,
      }
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    })

    if (!dbUser) {
      return {
        name: 'Free',
        isSubscribed: false,
        isCanceled: false,
        stripeCurrentPeriodEnd: null,
      }
    }

    const isSubscribed = Boolean(
      dbUser.stripePriceId &&
      dbUser.stripeCurrentPeriodEnd &&
      dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
    )

    let isCanceled = false
    if (isSubscribed && dbUser.stripeSubscriptionId) {
      const stripePlan = await stripe.subscriptions.retrieve(
        dbUser.stripeSubscriptionId
      )
      isCanceled = stripePlan.cancel_at_period_end
    }

    return {
      name: isSubscribed ? 'Pro' : 'Free',
      isSubscribed,
      isCanceled,
      stripeCurrentPeriodEnd: dbUser.stripeCurrentPeriodEnd,
    }
  }),

  getUserFiles: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const files = await db.file.findMany({
      where: {
        userId: user.id,
      },
    });

    return files;
  }),
  // Add other procedures here
  getFile: publicProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      const { getUser } = getKindeServerSession()
      const user = await getUser()

      if (!user || !user.id) throw new TRPCError({ code: 'UNAUTHORIZED' })

      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId: user.id,
        },
      })

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

      return file
    }),
  
  deleteFile: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { getUser } = getKindeServerSession()
      const user = await getUser()

      if (!user || !user.id) throw new TRPCError({ code: 'UNAUTHORIZED' })

      const file = await db.file.delete({
        where: {
          id: input.id,
          userId: user.id,
        },
      })

      return file
    }),

  getFileUploadStatus: publicProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
        },
      })

      if (!file) return { status: 'PENDING' as const }

      return { status: file.uploadStatus }
    }),

  getFileMessages: publicProcedure
    .input(z.object({ 
      fileId: z.string(),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }))
    .query(async ({ input }) => {
      const { getUser } = getKindeServerSession()
      const user = await getUser()
      const { fileId, cursor } = input
      const limit = input.limit ?? INFINITE_QUERY_LIMIT

      if (!user || !user.id) throw new TRPCError({ code: 'UNAUTHORIZED' })

      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId: user.id,
        },
      })

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

      const messages = await db.message.findMany({
        where: {
          fileId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          text: true,
          createdAt: true,
          isUserMessage: true,
        },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (messages.length > limit) {
        const nextItem = messages.pop()
        nextCursor = nextItem?.id
      }

      return {
        messages,
        nextCursor,
      }
    }),

  createStripeSession: publicProcedure
    .mutation(async () => {
      const { getUser } = getKindeServerSession()
      const user = await getUser()

      if (!user || !user.id) throw new TRPCError({ code: 'UNAUTHORIZED' })

      const dbUser = await db.user.findFirst({
        where: {
          id: user.id,
        },
      })

      if (!dbUser) throw new TRPCError({ code: 'NOT_FOUND' })

      const subscriptionPlan = await getUserSubscriptionPlan()

      if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: dbUser.stripeCustomerId,
          return_url: absoluteUrl('/dashboard'),
        })

        return { url: stripeSession.url }
      }

      const stripeSession = await stripe.checkout.sessions.create({
        success_url: absoluteUrl('/dashboard'),
        cancel_url: absoluteUrl('/dashboard'),
        payment_method_types: ['card'],
        mode: 'subscription',
        billing_address_collection: 'auto',
        customer_email: user.email ?? '',
        line_items: [
          {
            price_data: {
              currency: 'USD',
              product_data: {
                name: 'Pro Plan',
                description: 'Unlimited PDF pages and more features',
              },
              unit_amount: 2000,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
        },
      })

      return { url: stripeSession.url }
    })
});

export type AppRouter = typeof appRouter; 