/// <reference types="https://esm.sh/v135/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type AlertRow = {
	id: string;
	business_id: string;
	title: string;
	type: 'PAYMENT_REMINDER' | 'BUDGET_WARNING' | 'HIGH_EXPENSE' | 'LOW_PROFIT' | 'CUSTOM';
	frequency: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
	status: 'ACTIVE' | 'PAUSED';
	amount_threshold: number | null;
	category_id: string | null;
	alert_date: string | null;
	notes: string | null;
	last_sent_at?: string | null;
};

const projectUrl = Deno.env.get('PROJECT_URL');
const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY');

if (!projectUrl || !serviceRoleKey) {
	throw new Error('Missing PROJECT_URL or SERVICE_ROLE_KEY secret');
}

const supabase = createClient(projectUrl, serviceRoleKey);

function startOfDay(date: Date) {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

function isSameDay(a: Date, b: Date) {
	return a.toDateString() === b.toDateString();
}

function shouldSendAlert(alert: AlertRow, now: Date) {
	if (alert.status !== 'ACTIVE') return false;
	if (!alert.alert_date) return false;

	const today = startOfDay(now);
	const alertDate = startOfDay(new Date(alert.alert_date));
	const lastSent = alert.last_sent_at ? startOfDay(new Date(alert.last_sent_at)) : null;

	if (alert.frequency === 'ONCE') {
		if (!isSameDay(today, alertDate)) return false;
		if (lastSent && isSameDay(lastSent, today)) return false;
		return true;
	}

	if (today < alertDate) return false;

	if (alert.frequency === 'DAILY') {
		if (lastSent && isSameDay(lastSent, today)) return false;
		return true;
	}

	if (alert.frequency === 'WEEKLY') {
		if (today.getDay() !== alertDate.getDay()) return false;
		if (lastSent && isSameDay(lastSent, today)) return false;
		return true;
	}

	if (alert.frequency === 'MONTHLY') {
		if (today.getDate() !== alertDate.getDate()) return false;
		if (lastSent && isSameDay(lastSent, today)) return false;
		return true;
	}

	return false;
}

Deno.serve(async (_req) => {
	try {
		const now = new Date();

		const { data: alerts, error: alertsError } = await supabase
			.from('alerts')
			.select(
				'id,business_id,title,type,frequency,status,amount_threshold,category_id,alert_date,notes,last_sent_at'
			)
			.eq('status', 'ACTIVE');

		if (alertsError) {
			console.error('alerts query failed:', alertsError);
			return new Response(JSON.stringify({ error: alertsError.message }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const dueAlerts = (alerts ?? []).filter((alert: AlertRow) => shouldSendAlert(alert, now));

		for (const alert of dueAlerts) {
			const message =
				alert.type === 'PAYMENT_REMINDER'
					? `${alert.title} is due now.`
					: alert.type === 'BUDGET_WARNING'
						? `${alert.title} has reached its warning condition.`
						: alert.type === 'HIGH_EXPENSE'
							? `${alert.title} triggered a high expense alert.`
							: alert.type === 'LOW_PROFIT'
								? `${alert.title} triggered a low profit alert.`
								: `${alert.title} triggered a custom alert.`;

			const { error: insertError } = await supabase.from('alert_notifications').insert({
				alert_id: alert.id,
				business_id: alert.business_id,
				title: alert.title,
				message
			});

			if (insertError) {
				console.error('notification insert failed:', insertError);
				continue;
			}

			const { error: updateError } = await supabase
				.from('alerts')
				.update({ last_sent_at: now.toISOString() })
				.eq('id', alert.id);

			if (updateError) {
				console.error('last_sent_at update failed:', updateError);
			}
		}

		return new Response(
			JSON.stringify({
				success: true,
				processed: dueAlerts.length
			}),
			{
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (err) {
		console.error('function crashed:', err);
		return new Response(
			JSON.stringify({
				error: err instanceof Error ? err.message : 'Unknown function error'
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
});