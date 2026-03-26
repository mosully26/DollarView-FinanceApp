import { fail, redirect } from '@sveltejs/kit';
import OpenAI from 'openai';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('plan')
		.eq('id', user.id)
		.maybeSingle();

	const isPremium = profile?.plan === 'premium';

	return {
		isPremium
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			throw redirect(303, '/login');
		}

		const { data: profile } = await locals.supabase
			.from('profiles')
			.select('plan')
			.eq('id', user.id)
			.maybeSingle();

		const isPremium = profile?.plan === 'premium';

		if (!isPremium) {
			return fail(403, {
				error: 'AI Assistant is available for Premium members only.'
			});
		}

		const formData = await request.formData();
		const question = String(formData.get('question') ?? '').trim();

		if (!question) {
			return fail(400, { error: 'Please enter a question.' });
		}

		const apiKey = env.OPENAI_API_KEY;

		if (!apiKey) {
			console.error('OPENAI_API_KEY is missing');
			return fail(500, {
				error: 'OPENAI_API_KEY is missing. Check your environment variables.'
			});
		}

		const openai = new OpenAI({ apiKey });

		const { data: business } = await locals.supabase
			.from('businesses')
			.select('id, name')
			.eq('user_id', user.id)
			.maybeSingle();

		if (!business) {
			return fail(400, { error: 'No workspace found for this account.' });
		}

		const { data: transactions } = await locals.supabase
			.from('transactions')
			.select(`
				id,
				title,
				amount,
				type,
				vendor,
				transaction_date,
				category:categories(name,type)
			`)
			.eq('business_id', business.id)
			.order('transaction_date', { ascending: false })
			.limit(50);

		const { data: alerts } = await locals.supabase
			.from('alerts')
			.select('title,type,frequency,status,amount_threshold,alert_date')
			.eq('business_id', business.id)
			.order('created_at', { ascending: false })
			.limit(20);

		const { data: notifications } = await locals.supabase
			.from('alert_notifications')
			.select('title,message,created_at')
			.eq('business_id', business.id)
			.order('created_at', { ascending: false })
			.limit(20);

		const revenue = (transactions ?? [])
			.filter((t: any) => t.type === 'REVENUE')
			.reduce((sum: number, t: any) => sum + Number(t.amount ?? 0), 0);

		const expenses = (transactions ?? [])
			.filter((t: any) => t.type === 'EXPENSE')
			.reduce((sum: number, t: any) => sum + Number(t.amount ?? 0), 0);

		const profit = revenue - expenses;

		const context = {
			workspace: business.name,
			summary: {
				revenue,
				expenses,
				profit,
				transactionCount: transactions?.length ?? 0,
				alertCount: alerts?.length ?? 0,
				notificationCount: notifications?.length ?? 0
			},
			recentTransactions: transactions ?? [],
			recentAlerts: alerts ?? [],
			recentNotifications: notifications ?? []
		};

		try {
			const response = await openai.responses.create({
				model: 'gpt-5.4',
				input: [
					{
						role: 'system',
						content: [
							{
								type: 'input_text',
								text:
									'You are DollarView AI Assistant, a financial dashboard assistant. Answer clearly, professionally, and only based on the provided business data. Do not invent transactions or metrics. If data is limited, say so.'
							}
						]
					},
					{
						role: 'user',
						content: [
							{
								type: 'input_text',
								text: `Business data:\n${JSON.stringify(context, null, 2)}\n\nUser question: ${question}`
							}
						]
					}
				]
			});

			return {
				answer: response.output_text
			};
		} catch (error) {
			console.error('OpenAI assistant error:', error);
			return fail(500, {
				error: 'The assistant could not respond right now.'
			});
		}
	}
};