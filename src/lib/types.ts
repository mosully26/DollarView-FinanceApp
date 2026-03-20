export type TxType = 'EXPENSE' | 'REVENUE';
export type Period = '1' | '3'| '6' | '9' | '12' | '24' | '36' | '48' | '60' | '72' |'all';

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
	};
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