import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Business, Category } from '$lib/types';

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
			categories: [] as Category[]
		};
	}

	const { data: categories, error } = await locals.supabase
		.from('categories')
		.select('*')
		.eq('business_id', business.id)
		.order('type')
		.order('name');

	if (error) {
		return {
			business: business as Business,
			categories: [] as Category[],
			error: error.message
		};
	}

	return {
		business: business as Business,
		categories: (categories as Category[]) ?? []
	};
};

export const actions: Actions = {
	add: async ({ request, locals }) => {
		const formData = await request.formData();

		const name = String(formData.get('name') ?? '').trim();
		const type = String(formData.get('type') ?? '').trim().toUpperCase() as
			| 'EXPENSE'
			| 'REVENUE';

		if (!name || !type) {
			return fail(400, { error: 'Please enter a category name and type.' });
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

		const { data: existing } = await locals.supabase
			.from('categories')
			.select('id')
			.eq('business_id', business.id)
			.eq('type', type)
			.ilike('name', name)
			.maybeSingle();

		if (existing) {
			return fail(400, { error: 'A category with that name already exists.' });
		}

		const { error } = await locals.supabase.from('categories').insert({
			business_id: business.id,
			name,
			type
		});

		if (error) {
			return fail(400, { error: error.message });
		}

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const categoryId = String(formData.get('category_id') ?? '').trim();

		if (!categoryId) {
			return fail(400, { error: 'Missing category id.' });
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

		const { data: linkedTransaction } = await locals.supabase
			.from('transactions')
			.select('id')
			.eq('business_id', business.id)
			.eq('category_id', categoryId)
			.limit(1)
			.maybeSingle();

		if (linkedTransaction) {
			return fail(400, {
				error: 'Cannot delete a category that is already used by transactions.'
			});
		}

		const { error } = await locals.supabase
			.from('categories')
			.delete()
			.eq('id', categoryId)
			.eq('business_id', business.id);

		if (error) {
			return fail(400, { error: error.message });
		}

		return { deleted: true };
	}
};