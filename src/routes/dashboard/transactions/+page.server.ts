import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Business, Category, Period, TransactionRow } from '$lib/types';
import { filterTransactions, periodLabel } from '$lib/utils';

const FREE_PERIODS: Period[] = ['1', '3', '6'];
const PREMIUM_PERIODS: Period[] = ['1', '3', '6', '9', '12', '24', '36', '48', '60', '72', 'all'];

export const load: PageServerLoad = async ({ locals, url }) => {
	const requestedPeriod = (url.searchParams.get('period') as Period) || '6';
	const search = String(url.searchParams.get('search') ?? '').trim();
	const typeFilter = String(url.searchParams.get('type') ?? '').trim().toUpperCase();
	const categoryFilter = String(url.searchParams.get('category') ?? '').trim();
	const minAmountRaw = String(url.searchParams.get('min') ?? '').trim();
	const maxAmountRaw = String(url.searchParams.get('max') ?? '').trim();
	const startDate = String(url.searchParams.get('start') ?? '').trim();
	const endDate = String(url.searchParams.get('end') ?? '').trim();

	const minAmount = minAmountRaw ? Number(minAmountRaw) : null;
	const maxAmount = maxAmountRaw ? Number(maxAmountRaw) : null;

	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
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
			business: null,
			categories: [] as Category[],
			rows: [] as TransactionRow[],
			period: safePeriod,
			periodText: periodLabel(safePeriod),
			plan,
			subscriptionStatus,
			isPremium,
			extendedHistoryLocked: !isPremium,
			filters: {
				search,
				type: typeFilter,
				category: categoryFilter,
				min: minAmountRaw,
				max: maxAmountRaw,
				start: startDate,
				end: endDate
			}
		};
	}

	const { data: categories } = await locals.supabase
		.from('categories')
		.select('*')
		.eq('business_id', business.id)
		.order('type')
		.order('name');

	const { data: transactions } = await locals.supabase
		.from('transactions')
		.select(
			'id,business_id,category_id,title,amount,type,vendor,notes,transaction_date,created_at,category:categories(id,name,type)'
		)
		.eq('business_id', business.id)
		.order('transaction_date', { ascending: false });

	const normalizedTransactions: TransactionRow[] =
		(transactions ?? []).map((row: any) => ({
			...row,
			category: Array.isArray(row.category) ? row.category[0] ?? null : row.category
		})) as TransactionRow[];

	let filteredRows = filterTransactions(normalizedTransactions, safePeriod);

	if (search) {
		const searchLower = search.toLowerCase();
		filteredRows = filteredRows.filter((row) => {
			const title = row.title?.toLowerCase() ?? '';
			const vendor = row.vendor?.toLowerCase() ?? '';
			return title.includes(searchLower) || vendor.includes(searchLower);
		});
	}

	if (typeFilter === 'EXPENSE' || typeFilter === 'REVENUE') {
		filteredRows = filteredRows.filter((row) => row.type === typeFilter);
	}

	if (categoryFilter) {
		filteredRows = filteredRows.filter((row) => row.category_id === categoryFilter);
	}

	if (minAmountRaw && !Number.isNaN(minAmount)) {
		filteredRows = filteredRows.filter((row) => Number(row.amount) >= Number(minAmount));
	}

	if (maxAmountRaw && !Number.isNaN(maxAmount)) {
		filteredRows = filteredRows.filter((row) => Number(row.amount) <= Number(maxAmount));
	}

	if (startDate) {
		const start = new Date(startDate);
		if (!Number.isNaN(start.getTime())) {
			filteredRows = filteredRows.filter((row) => new Date(row.transaction_date) >= start);
		}
	}

	if (endDate) {
		const end = new Date(endDate);
		if (!Number.isNaN(end.getTime())) {
			end.setHours(23, 59, 59, 999);
			filteredRows = filteredRows.filter((row) => new Date(row.transaction_date) <= end);
		}
	}

	return {
		business: business as Business,
		categories: (categories as Category[]) ?? [],
		rows: filteredRows,
		period: safePeriod,
		periodText: periodLabel(safePeriod),
		plan,
		subscriptionStatus,
		isPremium,
		extendedHistoryLocked: !isPremium,
		filters: {
			search,
			type: typeFilter,
			category: categoryFilter,
			min: minAmountRaw,
			max: maxAmountRaw,
			start: startDate,
			end: endDate
		}
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();

		const title = String(formData.get('title') ?? '').trim();
		const amount = Number(formData.get('amount') ?? 0);
		const type = String(formData.get('type') ?? '').trim().toUpperCase() as
			| 'EXPENSE'
			| 'REVENUE';
		const categoryId = String(formData.get('category_id') ?? '').trim();
		const vendor = String(formData.get('vendor') ?? '').trim() || null;
		const notes = String(formData.get('notes') ?? '').trim() || null;
		const transactionDate = String(formData.get('transaction_date') ?? '').trim();

		if (!title || !amount || !type || !categoryId || !transactionDate) {
			return fail(400, { error: 'Please fill in all required fields.' });
		}

		if (amount <= 0) {
			return fail(400, { error: 'Amount must be greater than 0.' });
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const selectedDate = new Date(transactionDate);
		selectedDate.setHours(0, 0, 0, 0);

		if (Number.isNaN(selectedDate.getTime())) {
			return fail(400, { error: 'Please enter a valid transaction date.' });
		}

		if (selectedDate > today) {
			return fail(400, {
				error: 'Future transaction dates are not allowed.'
			});
		}

		const { user } = await locals.safeGetSession();

		if (!user) {
			throw redirect(303, '/login');
		}

		const { data: business } = await locals.supabase
			.from('businesses')
			.select('*')
			.eq('user_id', user.id)
			.single();

		if (!business) {
			return fail(400, { error: 'No workspace found for this account.' });
		}

		const { data: category, error: categoryError } = await locals.supabase
			.from('categories')
			.select('id,type')
			.eq('id', categoryId)
			.eq('business_id', business.id)
			.single();

		if (categoryError || !category) {
			return fail(400, {
				error: 'Please select a valid category.'
			});
		}

		if (String(category.type).toUpperCase() !== type) {
			return fail(400, {
				error: 'Selected category does not match the transaction type.'
			});
		}

		const { error: insertError } = await locals.supabase.from('transactions').insert({
			business_id: business.id,
			category_id: categoryId,
			title,
			amount,
			type,
			vendor,
			notes,
			transaction_date: transactionDate
		});

		if (insertError) {
			return fail(400, { error: insertError.message });
		}

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const transactionId = String(formData.get('transaction_id') ?? '').trim();

		if (!transactionId) {
			return fail(400, { error: 'Missing transaction id.' });
		}

		const { error } = await locals.supabase
			.from('transactions')
			.delete()
			.eq('id', transactionId);

		if (error) {
			return fail(400, { error: error.message });
		}

		return { deleted: true };
	}
};