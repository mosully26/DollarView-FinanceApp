import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import Stripe from 'stripe';

const stripeSecretKey = privateEnv.STRIPE_SECRET_KEY;
const premiumPriceId = privateEnv.STRIPE_PREMIUM_PRICE_ID;
const appUrl = publicEnv.PUBLIC_APP_URL;

if (!stripeSecretKey) {
	throw new Error('Missing STRIPE_SECRET_KEY');
}

if (!premiumPriceId) {
	throw new Error('Missing STRIPE_PREMIUM_PRICE_ID');
}

if (!appUrl) {
	throw new Error('Missing PUBLIC_APP_URL');
}

const stripe = new Stripe(stripeSecretKey);

export const GET: RequestHandler = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	const returnTo = url.searchParams.get('returnTo') || '/dashboard';

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('plan, subscription_status')
		.eq('id', user.id)
		.maybeSingle();

	const isPremium =
		profile?.plan === 'premium' && profile?.subscription_status === 'active';

	if (isPremium) {
		throw redirect(303, returnTo);
	}

	const session = await stripe.checkout.sessions.create({
		mode: 'subscription',
		line_items: [
			{
				price: premiumPriceId,
				quantity: 1
			}
		],
		success_url: `${appUrl}/dashboard?checkout=success`,
		cancel_url: `${appUrl}/pricing?checkout=cancelled`,
		customer_email: user.email ?? undefined,
		metadata: {
			userId: user.id
		},
		subscription_data: {
			metadata: {
				userId: user.id
			}
		}
	});

	if (!session.url) {
		throw redirect(303, '/pricing');
	}

	throw redirect(303, session.url);
};