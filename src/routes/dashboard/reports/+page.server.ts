import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Business, Period, TransactionRow } from '$lib/types';
import { categoryBreakdown, filterTransactions, monthlyBars, periodLabel, summarize } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, url }) => {
	const period = (url.searchParams.get('period') as Period) || '12';

	const { data: businesses } = await locals.supabase
		.from('businesses')
		.select('*')
		.order('created_at', { ascending: true })
		.limit(1);

	const business = (businesses?.[0] as Business | undefined) ?? null;

	if (!business) {
		throw redirect(303, '/dashboard');
	}

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

    const filtered = filterTransactions(normalizedTransactions, period);

	return {
		business,
		period,
		periodText: periodLabel(period),
		rows: filtered,
		metrics: summarize(filtered),
		bars: monthlyBars(filtered),
		expensePie: categoryBreakdown(filtered, 'EXPENSE')
	};
};