import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();

		const email = String(formData.get('email') ?? '').trim().toLowerCase();
		const password = String(formData.get('password') ?? '').trim();
		const firstName = String(formData.get('first_name') ?? '').trim();
		const lastName = String(formData.get('last_name') ?? '').trim();

		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required.',
				email,
				first_name: firstName,
				last_name: lastName
			});
		}

		if (password.length < 6) {
			return fail(400, {
				error: 'Password must be at least 6 characters.',
				email,
				first_name: firstName,
				last_name: lastName
			});
		}

		const { data, error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName
				}
			}
		});

		if (error) {
			return fail(400, {
				error: error.message,
				email,
				first_name: firstName,
				last_name: lastName
			});
		}

		const user = data.user;
		const session = data.session;

		if (!user || !session) {
			return fail(400, {
				error: 'Unable to create account session. Make sure email confirmation is disabled in Supabase.',
				email,
				first_name: firstName,
				last_name: lastName
			});
		}

		throw redirect(303, '/dashboard/onboarding');
	}
};