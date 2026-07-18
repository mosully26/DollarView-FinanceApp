import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { AlertFrequency, AlertRow, AlertStatus, AlertType, Business, Category } from '$lib/types';
import { ALERT_FREQUENCY_OPTIONS, ALERT_TYPE_OPTIONS } from '$lib/types';

const VALID_ALERT_TYPES: AlertType[] = [
	'PAYMENT_REMINDER',
	'BUDGET_WARNING',
	'HIGH_EXPENSE',
	'LOW_PROFIT',
	'CUSTOM'
];

const VALID_ALERT_FREQUENCIES: AlertFrequency[] = ['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY'];

const VALID_ALERT_STATUSES: AlertStatus[] = ['ACTIVE', 'PAUSED'];

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	const { data: business } = await locals.supabase
		.from('businesses')
		.select('*')
		.eq('user_id', user.id)
		.maybeSingle();

	if (!business) {
		return {
			business: null,
			categories: [] as Category[],
			alerts: [] as AlertRow[],
			alertTypeOptions: ALERT_TYPE_OPTIONS,
			alertFrequencyOptions: ALERT_FREQUENCY_OPTIONS
		};
	}

	const { data: categories } = await locals.supabase
		.from('categories')
		.select('*')
		.eq('business_id', business.id)
		.order('type')
		.order('name');

	const { data: alerts } = await locals.supabase
		.from('alerts')
		.select(
			'id,business_id,title,type,frequency,status,amount_threshold,category_id,alert_date,notes,created_at,category:categories(id,name,type)'
		)
		.eq('business_id', business.id)
		.order('created_at', { ascending: false });

	const normalizedAlerts: AlertRow[] = (alerts ?? []).map((row: any) => ({
		...row,
		category: Array.isArray(row.category) ? row.category[0] ?? null : row.category
	})) as AlertRow[];

	return {
		business: business as Business,
		categories: (categories as Category[]) ?? [],
		alerts: normalizedAlerts,
		alertTypeOptions: ALERT_TYPE_OPTIONS,
		alertFrequencyOptions: ALERT_FREQUENCY_OPTIONS
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();

		const title = String(formData.get('title') ?? '').trim();
		const type = String(formData.get('type') ?? '').trim().toUpperCase() as AlertType;
		const frequency = String(formData.get('frequency') ?? '').trim().toUpperCase() as AlertFrequency;
		const status = String(formData.get('status') ?? 'ACTIVE').trim().toUpperCase() as AlertStatus;
		const amountThresholdRaw = String(formData.get('amount_threshold') ?? '').trim();
		const categoryIdRaw = String(formData.get('category_id') ?? '').trim();
		const alertDateRaw = String(formData.get('alert_date') ?? '').trim();
		const notes = String(formData.get('notes') ?? '').trim() || null;

		const amountThreshold = amountThresholdRaw ? Number(amountThresholdRaw) : null;
		const categoryId = categoryIdRaw || null;
		const alertDate = alertDateRaw || null;

		if (!title || !type || !frequency) {
			return fail(400, { error: 'Please fill in all required alert fields.' });
		}

		if (!VALID_ALERT_TYPES.includes(type)) {
			return fail(400, { error: 'Invalid alert type selected.' });
		}

		if (!VALID_ALERT_FREQUENCIES.includes(frequency)) {
			return fail(400, { error: 'Invalid alert frequency selected.' });
		}

		if (!VALID_ALERT_STATUSES.includes(status)) {
			return fail(400, { error: 'Invalid alert status selected.' });
		}

		if (amountThresholdRaw && (Number.isNaN(amountThreshold) || Number(amountThreshold) < 0)) {
			return fail(400, { error: 'Amount threshold must be a valid positive number.' });
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

		if (categoryId) {
			const { data: category, error: categoryError } = await locals.supabase
				.from('categories')
				.select('id')
				.eq('id', categoryId)
				.eq('business_id', business.id)
				.single();

			if (categoryError || !category) {
				return fail(400, { error: 'Please select a valid category.' });
			}
		}

		const { error: insertError } = await locals.supabase.from('alerts').insert({
			business_id: business.id,
			title,
			type,
			frequency,
			status,
			amount_threshold: amountThreshold,
			category_id: categoryId,
			alert_date: alertDate,
			notes
		});

		if (insertError) {
			return fail(400, { error: insertError.message });
		}

		throw redirect(303, '/dashboard/alerts');
	},

	update: async ({ request, locals }) => {
		const formData = await request.formData();

		const alertId = String(formData.get('alert_id') ?? '').trim();
		const title = String(formData.get('title') ?? '').trim();
		const type = String(formData.get('type') ?? '').trim().toUpperCase() as AlertType;
		const frequency = String(formData.get('frequency') ?? '').trim().toUpperCase() as AlertFrequency;
		const status = String(formData.get('status') ?? 'ACTIVE').trim().toUpperCase() as AlertStatus;
		const amountThresholdRaw = String(formData.get('amount_threshold') ?? '').trim();
		const categoryIdRaw = String(formData.get('category_id') ?? '').trim();
		const alertDateRaw = String(formData.get('alert_date') ?? '').trim();
		const notes = String(formData.get('notes') ?? '').trim() || null;

		const amountThreshold = amountThresholdRaw ? Number(amountThresholdRaw) : null;
		const categoryId = categoryIdRaw || null;
		const alertDate = alertDateRaw || null;

		if (!alertId) {
			return fail(400, { error: 'Missing alert id.' });
		}

		if (!title || !type || !frequency) {
			return fail(400, { error: 'Please fill in all required alert fields.' });
		}

		if (!VALID_ALERT_TYPES.includes(type)) {
			return fail(400, { error: 'Invalid alert type selected.' });
		}

		if (!VALID_ALERT_FREQUENCIES.includes(frequency)) {
			return fail(400, { error: 'Invalid alert frequency selected.' });
		}

		if (!VALID_ALERT_STATUSES.includes(status)) {
			return fail(400, { error: 'Invalid alert status selected.' });
		}

		if (amountThresholdRaw && (Number.isNaN(amountThreshold) || Number(amountThreshold) < 0)) {
			return fail(400, { error: 'Amount threshold must be a valid positive number.' });
		}

		const { user } = await locals.safeGetSession();

		if (!user) {
			throw redirect(303, '/login');
		}

		const { data: business } = await locals.supabase
			.from('businesses')
			.select('id')
			.eq('user_id', user.id)
			.single();

		if (!business) {
			return fail(400, { error: 'No workspace found for this account.' });
		}

		if (categoryId) {
			const { data: category, error: categoryError } = await locals.supabase
				.from('categories')
				.select('id')
				.eq('id', categoryId)
				.eq('business_id', business.id)
				.single();

			if (categoryError || !category) {
				return fail(400, { error: 'Please select a valid category.' });
			}
		}

		const { error: updateError } = await locals.supabase
			.from('alerts')
			.update({
				title,
				type,
				frequency,
				status,
				amount_threshold: amountThreshold,
				category_id: categoryId,
				alert_date: alertDate,
				notes
			})
			.eq('id', alertId)
			.eq('business_id', business.id);

		if (updateError) {
			return fail(400, { error: updateError.message });
		}

		throw redirect(303, '/dashboard/alerts');
	},

		delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const alertId = String(formData.get('alert_id') ?? '').trim();

		if (!alertId) {
			return fail(400, { error: 'Missing alert id.' });
		}

		const { user } = await locals.safeGetSession();

		if (!user) {
			throw redirect(303, '/login');
		}

		const { data: business } = await locals.supabase
			.from('businesses')
			.select('id')
			.eq('user_id', user.id)
			.single();

		if (!business) {
			return fail(400, { error: 'No workspace found for this account.' });
		}

		const { error } = await locals.supabase
			.from('alerts')
			.delete()
			.eq('id', alertId)
			.eq('business_id', business.id);

		if (error) {
			return fail(400, { error: error.message });
		}

		throw redirect(303, '/dashboard/alerts');
	}
};