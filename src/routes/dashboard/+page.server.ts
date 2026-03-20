import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	DEFAULT_EXPENSE_CATEGORIES,
	DEFAULT_REVENUE_CATEGORIES,
	type Business,
	type Period,
	type TransactionRow
} from '$lib/types';
import { categoryBreakdown, filterTransactions, monthlyBars, periodLabel, summarize } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, url }) => {
	const period = (url.searchParams.get('period') as Period) || '6';

	const { data: businesses } = await locals.supabase
		.from('businesses')
		.select('*')
		.order('created_at', { ascending: true })
		.limit(1);

	const business = (businesses?.[0] as Business | undefined) ?? null;

	if (!business) {
		return {
			period,
			periodText: periodLabel(period),
			business: null,
			metrics: { revenue: 0, expenses: 0, profit: 0, count: 0 },
			bars: [],
			expensePie: [],
			revenueDoughnut: []
		};
	}

	const { data: transactions } = await locals.supabase
		.from('transactions')
		.select('id,business_id,category_id,title,amount,type,vendor,notes,transaction_date,created_at,category:categories(id,name,type)')
		.eq('business_id', business.id)
		.order('transaction_date', { ascending: true });

	const filtered = filterTransactions((transactions as unknown as TransactionRow[]) ?? [], period);

	return {
		period,
		periodText: periodLabel(period),
		business,
		metrics: summarize(filtered),
		bars: monthlyBars(filtered),
		expensePie: categoryBreakdown(filtered, 'EXPENSE'),
		revenueDoughnut: categoryBreakdown(filtered, 'REVENUE')
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

		await locals.supabase.from('categories').insert(categories);

		return { created: true };
	}
};