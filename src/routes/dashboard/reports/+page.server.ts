import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Business, Period, TransactionRow } from '$lib/types';
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
	const requestedPeriod = (url.searchParams.get('period') as Period) || '12';
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

	const filteredTransactions = filterTransactions(normalizedTransactions, safePeriod);

	return {
		business: business as Business,
		period: safePeriod,
		periodText: periodLabel(safePeriod),
		plan,
		subscriptionStatus,
		isPremium,
		rows: filteredTransactions,
		metrics: summarize(filteredTransactions),
		bars: monthlyBars(filteredTransactions, safePeriod),
		expensePie: categoryBreakdown(filteredTransactions, 'EXPENSE'),
		reportsLocked: !isPremium
	};
};