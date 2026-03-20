import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Business, Category } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
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

	return {
		business,
		categories: (categories as Category[]) ?? []
	};
};

export const actions: Actions = {
	add: async ({ request, locals }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const type = String(formData.get('type') ?? '').trim();

		if (!name || !['EXPENSE', 'REVENUE'].includes(type)) {
			return fail(400, { error: 'Name and valid type are required.' });
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

		const { error } = await locals.supabase.from('categories').insert({
			business_id: business.id,
			name,
			type
		});

		if (error) {
			return fail(400, { error: error.message });
		}

		return { added: true };
	},

	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const categoryId = String(formData.get('category_id') ?? '');

		if (!categoryId) {
			return fail(400, { error: 'Missing category id.' });
		}

		const { count } = await locals.supabase
			.from('transactions')
			.select('*', { count: 'exact', head: true })
			.eq('category_id', categoryId);

		if ((count ?? 0) > 0) {
			return fail(400, { error: 'This category is already used by transactions and cannot be deleted.' });
		}

		const { error } = await locals.supabase.from('categories').delete().eq('id', categoryId);

		if (error) {
			return fail(400, { error: error.message });
		}

		return { deleted: true };
	}
};