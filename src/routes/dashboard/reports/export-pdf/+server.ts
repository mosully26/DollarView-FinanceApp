import { error, type RequestHandler } from '@sveltejs/kit';
import PDFDocument from 'pdfkit';
import type { Period, TransactionRow } from '$lib/types';
import { filterTransactions, periodLabel } from '$lib/utils';

const PREMIUM_PERIODS: Period[] = ['1', '3', '6', '9', '12', '24', '36', '48', '60', '72', 'all'];

function formatMoney(value: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(value);
}

function collectPdfBytes(doc: PDFKit.PDFDocument): Promise<Uint8Array> {
	return new Promise((resolve, reject) => {
		const chunks: Uint8Array[] = [];

		doc.on('data', (chunk: Buffer | Uint8Array) => {
			chunks.push(chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk));
		});

		doc.on('end', () => {
			const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
			const merged = new Uint8Array(totalLength);

			let offset = 0;
			for (const chunk of chunks) {
				merged.set(chunk, offset);
				offset += chunk.length;
			}

			resolve(merged);
		});

		doc.on('error', reject);
	});
}

function drawLogo(doc: PDFKit.PDFDocument, x: number, y: number) {
	doc.font('Helvetica-Bold').fontSize(24).fillColor('#2563EB').text('Dollar', x, y, {
		lineBreak: false
	});

	doc.font('Helvetica-Bold').fontSize(24).fillColor('#111827').text('View', x + 73, y, {
		lineBreak: false
	});

	doc.font('Helvetica').fontSize(9).fillColor('#64748B').text('FINANCIAL REPORT', x + 2, y + 28, {
		characterSpacing: 2
	});
}

function drawHeaderBand(doc: PDFKit.PDFDocument, left: number, right: number, businessName: string, periodText: string) {
	const top = 42;
	const height = 92;

	doc.roundedRect(left, top, right - left, height, 16).fill('#F8FAFC');

	drawLogo(doc, left + 18, top + 16);

	doc.font('Helvetica').fontSize(10).fillColor('#475569').text(`Business: ${businessName}`, right - 230, top + 22, {
		width: 210,
		align: 'left'
	});

	doc.text(`Period: ${periodText}`, right - 230, top + 40, {
		width: 210,
		align: 'left'
	});

	doc.text(`Generated: ${new Date().toLocaleDateString('en-US')}`, right - 230, top + 58, {
		width: 210,
		align: 'left'
	});
}

function drawSectionTitle(doc: PDFKit.PDFDocument, title: string, x: number, y: number, width: number) {
	doc.font('Helvetica-Bold').fontSize(15).fillColor('#0F172A').text(title, x, y);
	doc.roundedRect(x, y + 22, width, 3, 2).fill('#DBEAFE');
}

function drawSummaryCard(
	doc: PDFKit.PDFDocument,
	x: number,
	y: number,
	width: number,
	height: number,
	label: string,
	value: string,
	tone: 'blue' | 'green' | 'red' | 'slate'
) {
	const accentMap = {
		blue: '#2563EB',
		green: '#059669',
		red: '#DC2626',
		slate: '#475569'
	};

	const accent = accentMap[tone];

	doc.roundedRect(x, y, width, height, 12).fill('#FFFFFF');
	doc.roundedRect(x, y, width, height, 12).lineWidth(1).stroke('#CBD5E1');
	doc.roundedRect(x, y, 6, height, 6).fill(accent);

	doc.font('Helvetica').fontSize(10).fillColor('#64748B').text(label, x + 18, y + 12);
	doc.font('Helvetica-Bold').fontSize(16).fillColor('#111827').text(value, x + 18, y + 31);
}

function drawTableHeader(doc: PDFKit.PDFDocument, left: number, right: number, y: number, columnX: number[]) {
	doc.roundedRect(left, y - 6, right - left, 24, 8).fill('#EFF6FF');

	const headers = ['Date', 'Title', 'Type', 'Category', 'Amount', 'Vendor'];

	doc.font('Helvetica-Bold').fontSize(9).fillColor('#1E3A8A');

	headers.forEach((header, index) => {
		const width =
			index === headers.length - 1 ? right - columnX[index] - 8 : columnX[index + 1] - columnX[index] - 8;

		doc.text(header, columnX[index] + 6, y, {
			width
		});
	});
}

export const GET: RequestHandler = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('plan, subscription_status')
		.eq('id', user.id)
		.maybeSingle();

	const plan = profile?.plan ?? 'free';
	const subscriptionStatus = profile?.subscription_status ?? 'inactive';
	const isPremium = plan === 'premium' && subscriptionStatus === 'active';

	if (!isPremium) {
		throw error(403, 'Premium subscription required to export reports.');
	}

	const requestedPeriod = (url.searchParams.get('period') as Period) || '12';
	const safePeriod: Period = PREMIUM_PERIODS.includes(requestedPeriod) ? requestedPeriod : '12';

	const { data: business } = await locals.supabase
		.from('businesses')
		.select('*')
		.eq('user_id', user.id)
		.maybeSingle();

	if (!business) {
		throw error(404, 'Business not found.');
	}

	const { data: transactions, error: transactionsError } = await locals.supabase
		.from('transactions')
		.select(
			'id,business_id,category_id,title,amount,type,vendor,notes,transaction_date,created_at,category:categories(id,name,type)'
		)
		.eq('business_id', business.id)
		.order('transaction_date', { ascending: false });

	if (transactionsError) {
		throw error(500, transactionsError.message);
	}

	const normalizedTransactions: TransactionRow[] =
		(transactions ?? []).map((row: any) => ({
			...row,
			category: Array.isArray(row.category) ? row.category[0] ?? null : row.category
		})) as TransactionRow[];

	const filteredTransactions = filterTransactions(normalizedTransactions, safePeriod);

	const revenue = filteredTransactions
		.filter((row) => row.type === 'REVENUE')
		.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);

	const expenses = filteredTransactions
		.filter((row) => row.type === 'EXPENSE')
		.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);

	const profit = revenue - expenses;
	const count = filteredTransactions.length;

	const doc = new PDFDocument({
		margin: 50,
		size: 'A4'
	});

	const pdfPromise = collectPdfBytes(doc);

	const left = 50;
	const right = doc.page.width - 50;
	const contentWidth = right - left;

	doc.info.Title = 'DollarView Financial Report';
	doc.info.Author = 'DollarView';
	doc.info.Subject = 'Financial Report';
	doc.info.Creator = 'DollarView';

	drawHeaderBand(doc, left, right, business.name, periodLabel(safePeriod));

	let y = 160;

	drawSectionTitle(doc, 'Executive Summary', left, y, 150);
	y += 38;

	const cardGap = 18;
	const cardWidth = (contentWidth - cardGap) / 2;
	const cardHeight = 68;

	drawSummaryCard(doc, left, y, cardWidth, cardHeight, 'Revenue', formatMoney(revenue), 'green');
	drawSummaryCard(
		doc,
		left + cardWidth + cardGap,
		y,
		cardWidth,
		cardHeight,
		'Expenses',
		formatMoney(expenses),
		'red'
	);

	y += cardHeight + 16;

	drawSummaryCard(doc, left, y, cardWidth, cardHeight, 'Profit', formatMoney(profit), profit >= 0 ? 'blue' : 'red');
	drawSummaryCard(doc, left + cardWidth + cardGap, y, cardWidth, cardHeight, 'Transactions', String(count), 'slate');

	y += cardHeight + 34;

	drawSectionTitle(doc, 'Transaction Details', left, y, 170);
y += 40;

// Better column spacing
const tableLeft = left;
const tableRight = right;
const tableWidth = tableRight - tableLeft;

// Date, Title, Type, Category, Amount, Vendor
const columnWidths = [82, 150, 78, 96, 92, 92];
const columnX = [
	tableLeft,
	tableLeft + columnWidths[0],
	tableLeft + columnWidths[0] + columnWidths[1],
	tableLeft + columnWidths[0] + columnWidths[1] + columnWidths[2],
	tableLeft + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3],
	tableLeft + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4]
];

function drawTableHeader(doc: PDFKit.PDFDocument, left: number, right: number, y: number, columnX: number[]) {
	doc.roundedRect(left, y - 6, right - left, 24, 8).fill('#EFF6FF');

	const headers = ['Date', 'Title', 'Type', 'Category', 'Amount', 'Vendor'];

	doc.font('Helvetica-Bold').fontSize(9).fillColor('#1E3A8A');

	headers.forEach((header, index) => {
		const width =
			index === headers.length - 1 ? right - columnX[index] - 8 : columnX[index + 1] - columnX[index] - 8;

		doc.text(header, columnX[index] + 6, y, {
			width
		});
	});
}

function ensurePageSpace(requiredHeight = 34) {
	if (doc.y + requiredHeight > doc.page.height - 55) {
		doc.addPage();
		drawHeaderBand(doc, left, right, business.name, periodLabel(safePeriod));
		doc.y = 160;
		drawSectionTitle(doc, 'Transaction Details', left, doc.y, 170);
		doc.y += 40;
		drawTableHeader(doc, tableLeft, tableRight, doc.y, columnX);
		doc.y += 34;
	}
}

doc.y = y;
drawTableHeader(doc, tableLeft, tableRight, doc.y, columnX);
doc.y += 34;

if (!filteredTransactions.length) {
	doc.roundedRect(tableLeft, doc.y, tableWidth, 46, 10).fill('#F8FAFC');
	doc.font('Helvetica').fontSize(10).fillColor('#64748B').text('No transactions for this period.', tableLeft + 14, doc.y + 15);
} else {
	filteredTransactions.forEach((row, index) => {
		const hasNotes = Boolean(row.notes);
		const rowHeight = hasNotes ? 54 : 34;

		ensurePageSpace(rowHeight + 8);

		const rowTop = doc.y;
		const fillColor = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC';

		doc.roundedRect(tableLeft, rowTop - 2, tableWidth, rowHeight, 10).fill(fillColor);
		doc.roundedRect(tableLeft, rowTop - 2, tableWidth, rowHeight, 10).lineWidth(0.6).stroke('#E2E8F0');

		const values = [
			row.transaction_date,
			row.title,
			row.type,
			row.category?.name ?? 'Uncategorized',
			formatMoney(Number(row.amount ?? 0)),
			row.vendor ?? '—'
		];

		doc.font('Helvetica').fontSize(9).fillColor('#111827');

		values.forEach((value, valueIndex) => {
			doc.text(String(value), columnX[valueIndex] + 8, rowTop + 8, {
				width: columnWidths[valueIndex] - 14,
				height: 12,
				ellipsis: true,
				lineBreak: false
			});
		});

		if (hasNotes) {
			doc.font('Helvetica-Oblique').fontSize(8).fillColor('#64748B').text(`Notes: ${row.notes}`, tableLeft + 10, rowTop + 28, {
				width: tableWidth - 20,
				ellipsis: true,
				lineBreak: false
			});
		}

		doc.y = rowTop + rowHeight + 8;
	});
}

	doc.end();

	const pdfBytes = await pdfPromise;
	const filename = `DollarView-Report-${safePeriod}-${new Date().toISOString().slice(0, 10)}.pdf`;

	const pdfBlob = new Blob([pdfBytes as BlobPart], {
		type: 'application/pdf'
	});

	return new Response(pdfBlob, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="${filename}"`
		}
	});
};