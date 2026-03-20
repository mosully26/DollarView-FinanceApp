import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim();
		const password = String(formData.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.' });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters.' });
		}

		const { error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${url.origin}/dashboard`
			}
		});

		if (error) {
			return fail(400, { error: error.message });
		}

		throw redirect(303, '/login');
	}
};