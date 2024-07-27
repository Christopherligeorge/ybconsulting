'use client'

import { getUserSubscriptionPlan } from '@/lib/stripe'
import { useToast } from './ui/use-toast'
import { trpc } from '@/app/_trpc/client'
import MaxWidthWrapper from './MaxWidthWrapper'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'


//subscription plan looks at what getUserSubscription plan outputs. 
interface BillingFormProps {
  subscriptionPlan: Awaited<
    ReturnType<typeof getUserSubscriptionPlan>
  >
}

/*
The issue "Property 'isLoading' does not exist on type 'UseTRPCMutationResult<{ url: string | null; },
 TRPCClientErrorLike<{ input: void; output: { url: string | null; };
 transformer: false; errorShape: DefaultErrorShape; }>, void, unknown>'." 
 is occurring because the isLoading property is not defined in the type UseTRPCMutationResult<{ url: string | null; }, 
 TRPCClientErrorLike<{ input: void; output: { url: string | null; }; transformer: false; errorShape: DefaultErrorShape; }>,
  void, unknown>.
*/

const BillingForm = ({
  subscriptionPlan,
}: BillingFormProps) => {
  const { toast } = useToast()


  //ERROR: ORIginally, it was isLoading to specify the state.we changed isloading -> status.

  //This line uses destructuring assignment to extract mutate (renamed to createStripeSession)
  // and isLoading from the result of the useMutation hook provided by trpc for the 
  //createStripeSession mutation. mutate is a function to trigger the mutation, and isLoading 
  //indicates the loading state of the mutation.

  const { mutate: createStripeSession, status} =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) window.location.href = url
        if (!url) {
          toast({
            title: 'There was a problem...',
            description: 'Please try again in a moment',
            variant: 'destructive',
          })
        }
      },
    })

  return (
    <MaxWidthWrapper className='max-w-5xl'>
      <form
        className='mt-12'
        onSubmit={(e) => {
          e.preventDefault()
          createStripeSession()
        }}>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the{' '}
              <strong>{subscriptionPlan.name}</strong> plan.
            </CardDescription>
          </CardHeader>

          <CardFooter className='flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0'>
            <Button type='submit'>
              {status ? (
                <Loader2 className='mr-4 h-4 w-4 animate-spin' />
              ) : null}
              {subscriptionPlan.isSubscribed
                ? 'Manage Subscription'
                : 'Upgrade to PRO'}
            </Button>

            {subscriptionPlan.isSubscribed ? (
              <p className='rounded-full text-xs font-medium'>
                {subscriptionPlan.isCanceled
                  ? 'Your plan will be canceled on '
                  : 'Your plan renews on'}
                {format(
                  subscriptionPlan.stripeCurrentPeriodEnd!,
                  'dd.MM.yyyy'
                )}
                .
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  )
}

export default BillingForm