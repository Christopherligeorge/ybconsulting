import { stripe } from './stripe'

async function testStripeConnection() {
  try {
    const customer = await stripe.customers.create({
      email: 'test@example.com',
      description: 'Test customer for connection verification'
    })
    console.log('Successfully connected to Stripe!')
    console.log('Created test customer:', customer.id)
    
    // Clean up by deleting the test customer
    await stripe.customers.del(customer.id)
    console.log('Test customer deleted')
  } catch (error) {
    console.error('Stripe connection error:', error)
  }
}

testStripeConnection() 