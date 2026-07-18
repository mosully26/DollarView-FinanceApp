import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

type NotificationRow = {
	id: string;
	alert_id: string;
	business_id: string;
	title: string;
	message: string;
	sent_at: string;
	created_at: string;
};

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	const { data: business } = await locals.supabase
		.from('businesses')
		.select('id, name')
		.eq('user_id', user.id)
		.maybeSingle();

	if (!business) {
		return {
			business: null,
			notifications: [] as NotificationRow[]
		};
	}

	const { data: notifications, error } = await locals.supabase
		.from('alert_notifications')
		.select('id, alert_id, business_id, title, message, sent_at, created_at')
		.eq('business_id', business.id)
		.order('created_at', { ascending: false });

	if (error) {
		return {
			business,
			notifications: [] as NotificationRow[],
			error: error.message
		};
	}

	return {
		business,
		notifications: (notifications ?? []) as NotificationRow[]
	};
};