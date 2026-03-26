import type { RequestHandler } from './$types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecretKey = privateEnv.STRIPE_SECRET_KEY;
const webhookSecret = privateEnv.STRIPE_WEBHOOK_SECRET;
const supabaseUrl = publicEnv.PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = privateEnv.SUPABASE_SERVICE_ROLE_KEY;

if (!stripeSecretKey) {
	throw new Error('Missing STRIPE_SECRET_KEY');
}

if (!webhookSecret) {
	throw new Error('Missing STRIPE_WEBHOOK_SECRET');
}

if (!supabaseUrl) {
	throw new Error('Missing PUBLIC_SUPABASE_URL');
}

if (!supabaseServiceRoleKey) {
	throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

const stripe = new Stripe(stripeSecretKey);

const adminSupabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});

async function setPremiumStatus(
	userId: string,
	plan: 'free' | 'premium',
	subscriptionStatus: 'inactive' | 'active'
) {
	const { error } = await adminSupabase
		.from('profiles')
		.update({
			plan,
			subscription_status: subscriptionStatus
		})
		.eq('id', userId);

	if (error) {
		console.error('Failed to update profile subscription state:', error);
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const signature = request.headers.get('stripe-signature');

	if (!signature) {
		return new Response('Missing stripe-signature header', { status: 400 });
	}

	const body = await request.text();

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Invalid webhook signature';
		return new Response(`Webhook Error: ${message}`, { status: 400 });
	}

	try {
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object as Stripe.Checkout.Session;
				const userId = session.metadata?.userId;

				if (userId && session.mode === 'subscription') {
					await setPremiumStatus(userId, 'premium', 'active');
				}
				break;
			}

			case 'customer.subscription.updated': {
				const subscription = event.data.object as Stripe.Subscription;
				const userId = subscription.metadata?.userId;

				if (userId) {
					const isActive =
						subscription.status === 'active' ||
						subscription.status === 'trialing';

					await setPremiumStatus(
						userId,
						isActive ? 'premium' : 'free',
						isActive ? 'active' : 'inactive'
					);
				}
				break;
			}

			case 'customer.subscription.deleted': {
				const subscription = event.data.object as Stripe.Subscription;
				const userId = subscription.metadata?.userId;

				if (userId) {
					await setPremiumStatus(userId, 'free', 'inactive');
				}
				break;
			}

			default:
				break;
		}
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Webhook handler failed';
		console.error('Stripe webhook handler error:', message);
		return new Response(`Webhook handler error: ${message}`, { status: 500 });
	}

	return new Response('OK', { status: 200 });
};