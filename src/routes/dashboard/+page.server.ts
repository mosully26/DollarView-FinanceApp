import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	DEFAULT_EXPENSE_CATEGORIES,
	DEFAULT_REVENUE_CATEGORIES,
	type Business,
	type Period,
	type TransactionRow
} from '$lib/types';
import {
	categoryBreakdown,
	filterTransactions,
	monthlyBars,
	periodLabel,
	summarize
} from '$lib/utils';

const FREE_PERIODS: Period[] = ['1', '3', '6'];
const PREMIUM_PERIODS: Period[] = ['1', '3', '6', '9', '12', '24', '36', '48', '60', '72', 'all'];

export const load: PageServerLoad = async ({ locals, url }) => {
	const requestedPeriod = (url.searchParams.get('period') as Period) || '6';
	const { user } = await locals.safeGetSession();

	if (!user) {
		return {
			period: '6' as Period,
			periodText: periodLabel('6'),
			plan: 'free',
			subscriptionStatus: 'inactive',
			isPremium: false,
			business: null,
			metrics: { revenue: 0, expenses: 0, profit: 0, count: 0 },
			bars: [],
			expensePie: [],
			revenueDoughnut: [],
			advancedChartsLocked: true
		};
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('plan, subscription_status')
		.eq('id', user.id)
		.maybeSingle();

	const plan = profile?.plan ?? 'free';
	const subscriptionStatus = profile?.subscription_status ?? 'inactive';
	const isPremium = plan === 'premium' && subscriptionStatus === 'active';

	const allowedPeriods = isPremium ? PREMIUM_PERIODS : FREE_PERIODS;
	const safePeriod: Period = allowedPeriods.includes(requestedPeriod) ? requestedPeriod : '6';

	const { data: business } = await locals.supabase
		.from('businesses')
		.select('*')
		.eq('user_id', user.id)
		.maybeSingle();

	if (!business) {
		return {
			period: safePeriod,
			periodText: periodLabel(safePeriod),
			plan,
			subscriptionStatus,
			isPremium,
			business: null,
			metrics: { revenue: 0, expenses: 0, profit: 0, count: 0 },
			bars: [],
			expensePie: [],
			revenueDoughnut: [],
			advancedChartsLocked: !isPremium
		};
	}

	const { data: transactions } = await locals.supabase
		.from('transactions')
		.select(
			'id,business_id,category_id,title,amount,type,vendor,notes,transaction_date,created_at,category:categories(id,name,type)'
		)
		.eq('business_id', business.id)
		.order('transaction_date', { ascending: true });

	const normalizedTransactions: TransactionRow[] =
		(transactions ?? []).map((row: any) => ({
			...row,
			category: Array.isArray(row.category) ? row.category[0] ?? null : row.category
		})) as TransactionRow[];

	const filteredTransactions = filterTransactions(normalizedTransactions, safePeriod);

	const metrics = summarize(filteredTransactions);
	const bars = monthlyBars(filteredTransactions, safePeriod);
	const expensePie = categoryBreakdown(filteredTransactions, 'EXPENSE');
	const revenueDoughnut = categoryBreakdown(filteredTransactions, 'REVENUE');

	return {
		period: safePeriod,
		periodText: periodLabel(safePeriod),
		plan,
		subscriptionStatus,
		isPremium,
		business: business as Business,
		metrics,
		bars,
		expensePie,
		revenueDoughnut,
		advancedChartsLocked: !isPremium
	};
};

export const actions: Actions = {
	createBusiness: async ({ request, locals }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const { user } = await locals.safeGetSession();

		if (!user) {
			return fail(401, { createError: 'You must be logged in.' });
		}

		if (!name) {
			return fail(400, { createError: 'Business or personal workspace name is required.' });
		}

		const { data: existingBusiness } = await locals.supabase
			.from('businesses')
			.select('id')
			.eq('user_id', user.id)
			.maybeSingle();

		if (existingBusiness) {
			return fail(400, { createError: 'A workspace already exists for this account.' });
		}

		const { data: business, error } = await locals.supabase
			.from('businesses')
			.insert({ name, user_id: user.id })
			.select('*')
			.single();

		if (error || !business) {
			return fail(400, { createError: error?.message ?? 'Could not create workspace.' });
		}

		const categories = [
			...DEFAULT_EXPENSE_CATEGORIES.map((item) => ({
				business_id: business.id,
				name: item,
				type: 'EXPENSE'
			})),
			...DEFAULT_REVENUE_CATEGORIES.map((item) => ({
				business_id: business.id,
				name: item,
				type: 'REVENUE'
			}))
		];

		const { error: categoryInsertError } = await locals.supabase
			.from('categories')
			.insert(categories);

		if (categoryInsertError) {
			return fail(400, {
				createError: categoryInsertError.message
			});
		}

		return { created: true };
	}
};