import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key from env
// If key is missing (e.g. dev), this will throw effectively, or we can handle gracefully.
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

export async function POST() {
    if (!stripe) {
        return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'inr', // Using INR as app shows ₹
                    product_data: { name: 'Restore Access: Focus Contract' },
                    unit_amount: 19900 // 199.00 INR (amount in smallest currency unit)
                },
                quantity: 1
            }],
            // In a real app, these URLs should be absolute environment-based URLs
            success_url: 'http://localhost:3000?payment=success',
            cancel_url: 'http://localhost:3000?payment=cancel'
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Error:", error);
        return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
    }
}
