import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const DEFAULT_CATEGORIES = [
	{ name: 'Maintenance', type: 'EXPENSE' },
	{ name: 'Marketing', type: 'EXPENSE' },
	{ name: 'Mortgage', type: 'EXPENSE' },
	{ name: 'Other', type: 'EXPENSE' },
	{ name: 'Payroll', type: 'EXPENSE' },
	{ name: 'Rent', type: 'EXPENSE' },
	{ name: 'Software', type: 'EXPENSE' },
	{ name: 'Supplies', type: 'EXPENSE' },
	{ name: 'Travel', type: 'EXPENSE' },
	{ name: 'Utilities', type: 'EXPENSE' },
	{ name: 'Sales', type: 'REVENUE' },
	{ name: 'Services', type: 'REVENUE' },
	{ name: 'Consulting', type: 'REVENUE' },
	{ name: 'Other Revenue', type: 'REVENUE' }
] as const;

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('first_name,last_name,plan,subscription_status')
		.eq('id', user.id)
		.maybeSingle();

	let { data: business } = await locals.supabase
		.from('businesses')
		.select('*')
		.eq('user_id', user.id)
		.maybeSingle();

	if (!business) {
		const { data: createdBusiness, error: businessError } = await locals.supabase
			.from('businesses')
			.insert({
				user_id: user.id,
				name: `${profile?.first_name || user.email?.split('@')[0] || 'My'}'s Business`
			})
			.select()
			.single();

		if (businessError) {
			console.error('Business creation error:', businessError);
		}

		if (createdBusiness) {
			business = createdBusiness;
		}
	}

	if (business) {
		const { data: existingCategories, error: categoriesError } = await locals.supabase
			.from('categories')
			.select('id,name,type')
			.eq('business_id', business.id);

		if (categoriesError) {
			console.error('Category lookup error:', categoriesError);
		}

		const existingKeys = new Set(
			(existingCategories ?? []).map((category) => `${category.type}:${category.name.toLowerCase()}`)
		);

		const missingCategories = DEFAULT_CATEGORIES.filter(
			(category) => !existingKeys.has(`${category.type}:${category.name.toLowerCase()}`)
		).map((category) => ({
			business_id: business.id,
			name: category.name,
			type: category.type
		}));

		if (missingCategories.length > 0) {
			const { error: insertCategoriesError } = await locals.supabase
				.from('categories')
				.insert(missingCategories);

			if (insertCategoriesError) {
				console.error('Default category backfill error:', insertCategoriesError);
			}
		}
	}

	const plan = profile?.plan ?? 'free';
	const subscriptionStatus = profile?.subscription_status ?? 'inactive';
	const isPremium = plan === 'premium' && subscriptionStatus === 'active';

	return {
		user: {
			id: user.id,
			email: user.email ?? '',
			firstName: profile?.first_name ?? '',
			lastName: profile?.last_name ?? ''
		},
		business,
		plan,
		subscriptionStatus,
		isPremium,
		stripe: {
			premiumCheckoutPath: '/checkout/premium',
			returnTo: url.pathname
		}
	};
};