import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	const { data: preferences } = await locals.supabase
		.from('user_preferences')
		.select('*')
		.eq('user_id', user.id)
		.maybeSingle();

	return { preferences };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();

		const monthlyBudget = Number(formData.get('monthly_budget') ?? 0);
		const primaryGoal = String(formData.get('primary_goal') ?? '');
		const tracksBusiness = String(formData.get('tracks_business')) === 'true';
		const businessType = String(formData.get('business_type') ?? '');
		const alertPreference = String(formData.get('alert_preference') ?? '');
		const categories = JSON.parse(String(formData.get('categories') ?? '[]'));

		const { error } = await locals.supabase.from('user_preferences').upsert({
			user_id: user.id,
			monthly_budget: monthlyBudget,
			primary_goal: primaryGoal,
			tracks_business: tracksBusiness,
			business_type: businessType,
			alert_preference: alertPreference,
			categories,
			updated_at: new Date().toISOString()
		});

		if (error) {
			return fail(400, { error: error.message });
		}

		return { success: true };
	}
};