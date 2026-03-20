import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Business, Category, Period, TransactionRow } from '$lib/types';
import { filterTransactions, periodLabel } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, url }) => {
	const period = (url.searchParams.get('period') as Period) || '6';

	const { data: businesses } = await locals.supabase
		.from('businesses')
		.select('*')
		.order('created_at', { ascending: true })
		.limit(1);

	const business = (businesses?.[0] as Business | undefined) ?? null;

	if (!business) {
		throw redirect(303, '/dashboard');
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

	return {
		business,
		categories: (categories as Category[]) ?? [],
		rows: filterTransactions(normalizedTransactions, period),
		period,
		periodText: periodLabel(period)
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();

		const title = String(formData.get('title') ?? '').trim();
		const amount = Number(formData.get('amount') ?? 0);
		const type = String(formData.get('type') ?? '') as 'EXPENSE' | 'REVENUE';
		const categoryId = String(formData.get('category_id') ?? '').trim();
		const vendor = String(formData.get('vendor') ?? '').trim() || null;
		const notes = String(formData.get('notes') ?? '').trim() || null;
		const transactionDate = String(formData.get('transaction_date') ?? '').trim();

		if (!title || !amount || !type || !categoryId || !transactionDate) {
			return fail(400, { error: 'Please fill in all required fields.' });
		}

		const { data: businesses } = await locals.supabase
			.from('businesses')
			.select('*')
			.order('created_at', { ascending: true })
			.limit(1);

		const business = (businesses?.[0] as Business | undefined) ?? null;

		if (!business) {
			return fail(400, { error: 'Create a workspace first.' });
		}

		const { data: category } = await locals.supabase
			.from('categories')
			.select('id,type')
			.eq('id', categoryId)
			.eq('business_id', business.id)
			.single();

		if (!category || category.type !== type) {
			return fail(400, {
				error: 'Selected category does not match the transaction type.'
			});
		}

		await locals.supabase.from('transactions').insert({
			business_id: business.id,
			category_id: categoryId,
			title,
			amount,
			type,
			vendor,
			notes,
			transaction_date: transactionDate
		});

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const transactionId = String(formData.get('transaction_id') ?? '');

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