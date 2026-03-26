export type TxType = 'EXPENSE' | 'REVENUE';

export type Period =
	| '1'
	| '3'
	| '6'
	| '9'
	| '12'
	| '24'
	| '36'
	| '48'
	| '60'
	| '72'
	| 'all';

export type AlertFrequency = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type AlertType =
	| 'PAYMENT_REMINDER'
	| 'BUDGET_WARNING'
	| 'HIGH_EXPENSE'
	| 'LOW_PROFIT'
	| 'CUSTOM';

export type AlertStatus = 'ACTIVE' | 'PAUSED';

export type Business = {
	id: string;
	user_id: string;
	name: string;
	created_at: string;
};

export type Category = {
	id: string;
	business_id: string;
	name: string;
	type: TxType;
	created_at: string;
};

export type TransactionRow = {
	id: string;
	business_id: string;
	category_id: string;
	title: string;
	amount: number | string;
	type: TxType;
	vendor: string | null;
	notes: string | null;
	transaction_date: string;
	created_at: string;
	category?: {
		id: string;
		name: string;
		type: TxType;
	} | null;
};

export type AlertRow = {
	id: string;
	business_id: string;
	title: string;
	type: AlertType;
	frequency: AlertFrequency;
	status: AlertStatus;
	amount_threshold: number | null;
	category_id: string | null;
	alert_date: string | null;
	notes: string | null;
	created_at: string;
	category?: {
		id: string;
		name: string;
		type: TxType;
	} | null;
};

export type MetricSummary = {
	revenue: number;
	expenses: number;
	profit: number;
	count: number;
};

export type BarPoint = {
	label: string;
	revenue: number;
	expenses: number;
};

export type PiePoint = {
	label: string;
	value: number;
};

export const FREE_PERIODS: Period[] = ['1', '3', '6'];

export const PREMIUM_PERIODS: Period[] = [
	'1',
	'3',
	'6',
	'9',
	'12',
	'24',
	'36',
	'48',
	'60',
	'72',
	'all'
];

export const ALERT_TYPE_OPTIONS: { label: string; value: AlertType }[] = [
	{ label: 'Payment Reminder', value: 'PAYMENT_REMINDER' },
	{ label: 'Budget Warning', value: 'BUDGET_WARNING' },
	{ label: 'High Expense', value: 'HIGH_EXPENSE' },
	{ label: 'Low Profit', value: 'LOW_PROFIT' },
	{ label: 'Custom', value: 'CUSTOM' }
];

export const ALERT_FREQUENCY_OPTIONS: { label: string; value: AlertFrequency }[] = [
	{ label: 'One Time', value: 'ONCE' },
	{ label: 'Daily', value: 'DAILY' },
	{ label: 'Weekly', value: 'WEEKLY' },
	{ label: 'Monthly', value: 'MONTHLY' }
];

export const DEFAULT_EXPENSE_CATEGORIES = [
	'Rent',
	'Utilities',
	'Payroll',
	'Inventory',
	'Marketing',
	'Software',
	'Supplies',
	'Travel',
	'Maintenance',
	'Other'
];

export const DEFAULT_REVENUE_CATEGORIES = ['Sales', 'Services', 'Consulting', 'Other Revenue'];