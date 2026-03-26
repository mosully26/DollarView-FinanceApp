import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	const { data: preferences, error } = await locals.supabase
		.from('user_preferences')
		.select('*')
		.eq('user_id', user.id)
		.maybeSingle();

	if (error) {
		return {
			preferences: null,
			error: error.message
		};
	}

	return {
		preferences
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();

		const monthlyBudgetRaw = String(formData.get('monthly_budget') ?? '').trim();
		const primaryGoal = String(formData.get('primary_goal') ?? '').trim();
		const tracksBusiness = String(formData.get('tracks_business') ?? '').trim() === 'true';
		const businessType = String(formData.get('business_type') ?? '').trim();
		const categoriesRaw = String(formData.get('categories') ?? '[]');
		const alertPreference = String(formData.get('alert_preference') ?? '').trim();

		const monthlyBudget = monthlyBudgetRaw ? Number(monthlyBudgetRaw) : null;

		let categories: string[] = [];
		try {
			const parsed = JSON.parse(categoriesRaw);
			categories = Array.isArray(parsed) ? parsed : [];
		} catch {
			categories = [];
		}

		const { error } = await locals.supabase.from('user_preferences').upsert({
			user_id: user.id,
			monthly_budget: monthlyBudget,
			primary_goal: primaryGoal || null,
			tracks_business: tracksBusiness,
			business_type: businessType || null,
			alert_preference: alertPreference || null,
			categories,
			onboarding_completed: true,
			onboarding_step: 5,
			updated_at: new Date().toISOString()
		});

		if (error) {
			return fail(400, { error: error.message });
		}

		return {
			success: true,
			summary: {
				monthly_budget: monthlyBudget,
				primary_goal: primaryGoal || 'Not selected',
				tracks_business: tracksBusiness,
				business_type: businessType || 'Personal use',
				categories,
				alert_preference: alertPreference || 'Not selected'
			}
		};
	}
};