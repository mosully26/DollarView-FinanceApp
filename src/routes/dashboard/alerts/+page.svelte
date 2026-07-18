<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let editingAlertId = $state<string | null>(null);

	const typeLabels: Record<string, string> = {
		PAYMENT_REMINDER: 'Payment Reminder',
		BUDGET_WARNING: 'Budget Warning',
		HIGH_EXPENSE: 'High Expense',
		LOW_PROFIT: 'Low Profit',
		CUSTOM: 'Custom'
	};

	const frequencyLabels: Record<string, string> = {
		ONCE: 'One Time',
		DAILY: 'Daily',
		WEEKLY: 'Weekly',
		MONTHLY: 'Monthly'
	};

	const statusLabels: Record<string, string> = {
		ACTIVE: 'Active',
		PAUSED: 'Paused'
	};

	function formatCurrency(value: number | null) {
		if (value == null) return '—';
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(value);
	}

	function formatDate(value: string | null) {
		if (!value) return 'No date set';
		return new Date(value).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function toDateInputValue(value: string | null) {
		if (!value) return '';
		return value.split('T')[0];
	}
</script>

<svelte:head>
	<title>Alerts | DollarView</title>
</svelte:head>

<div class="space-y-8">
	<section
		class="relative overflow-visible rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8 xl:p-10 dark:border-slate-800 dark:bg-slate-900/90"
	>
		<div class="pointer-events-none absolute inset-0">
			<div
				class="absolute -left-24 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/20"
			></div>
			<div
				class="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-slate-300/30 blur-3xl dark:bg-slate-700/30"
			></div>
		</div>

		<div class="relative grid gap-10 xl:grid-cols-[1.1fr_0.85fr_0.95fr] xl:items-center">
			<div class="max-w-2xl">
				<p
					class="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-blue-400"
				>
					Smart alerts
				</p>

				<h1
					class="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl dark:text-white"
				>
					Monitor business activity with cleaner, smarter financial alerts.
				</h1>

				<p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
					Create reminders for payments, budget thresholds, spending spikes, and custom financial
					events — all in one polished dashboard experience.
				</p>

				<div class="mt-8 grid gap-4 sm:grid-cols-3">
					<div
						class="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60"
					>
						<p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
							Payments
						</p>
						<p class="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
							Stay on top of important due dates and recurring reminders.
						</p>
					</div>

					<div
						class="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60"
					>
						<p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
							Budgets
						</p>
						<p class="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
							Track warning points before spending gets out of control.
						</p>
					</div>

					<div
						class="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60"
					>
						<p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
							Custom
						</p>
						<p class="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
							Build flexible alerts around your business workflow.
						</p>
					</div>
				</div>
			</div>

			<div class="flex justify-center">
				<div class="relative mx-auto h-[500px] w-[300px] md:h-[540px] md:w-[320px]">
					<div
						class="absolute inset-0 rounded-[3rem] border-[8px] border-slate-950 bg-slate-100 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.18)] dark:border-slate-200 dark:bg-slate-900"
					>
						<div class="relative h-full overflow-visible rounded-[2.3rem] bg-gradient-to-b from-[#eff6ff] via-white to-[#f8fafc]">
								<div class="absolute inset-0 bg-gradient-to-b from-[#eff6ff] via-white to-[#f8fafc]"></div>

                            <div
                                class="absolute left-1/2 top-3 h-7 w-28 -translate-x-1/2 rounded-full bg-black/95 shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
                            ></div>

                            <div class="relative z-10 px-5 pb-5 pt-12">
                                <!-- APP HEADER -->
                                <div class="flex items-start justify-between">
                                    <div>
                                        <p class="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                                            Alert center
                                        </p>

                                        <h3 class="mt-2 text-xl font-extrabold tracking-tight">
                                            <span class="text-blue-600">DOLLAR</span><span class="text-slate-900">VIEW</span>
                                        </h3>
                                    </div>

                                    <div class="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                                        Live
                                    </div>
                                </div>

                                <!-- SUMMARY CARD -->
                                <div
                                    class="mt-5 rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                                >
                                    <p class="text-xs text-slate-500">Monthly alert summary</p>
                                    <div class="mt-2 flex items-end justify-between gap-3">
                                        <p class="text-[2rem] font-extrabold leading-none text-slate-900">3 active</p>
                                        <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                                            Healthy
                                        </span>
                                    </div>
                                    <p class="mt-2 text-sm text-emerald-600">1 payment reminder due soon</p>
                                </div>

                                <!-- BUDGET CARD -->
                                <div
                                    class="mt-4 rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                                >
                                    <div class="flex items-center justify-between">
                                        <p class="text-sm font-semibold text-slate-900">Marketing budget</p>
                                        <p class="text-sm font-semibold text-blue-600">82%</p>
                                    </div>

                                    <div class="mt-3 h-2.5 rounded-full bg-slate-200">
                                        <div class="h-2.5 w-[82%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                                    </div>

                                    <p class="mt-2 text-xs leading-5 text-slate-500">
                                        Approaching monthly category threshold
                                    </p>
                                </div>

                                <!-- RECENT ALERTS -->
                                <div
                                    class="mt-4 rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                                >
                                    <div class="flex items-center justify-between">
                                        <p class="text-sm font-semibold text-slate-900">Recent alerts</p>
                                        <p class="text-xs font-medium text-blue-600">View all</p>
                                    </div>

                                    <div class="mt-4 space-y-3">
                                        <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3">
                                            <div>
                                                <p class="text-sm font-semibold text-slate-900">Payroll due</p>
                                                <p class="text-xs text-slate-500">Payment Reminder</p>
                                            </div>
                                            <p class="text-sm font-semibold text-amber-600">Tomorrow</p>
                                        </div>

                                        <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3">
                                            <div>
                                                <p class="text-sm font-semibold text-slate-900">Office supplies spike</p>
                                                <p class="text-xs text-slate-500">High Expense</p>
                                            </div>
                                            <p class="text-sm font-semibold text-rose-600">$240</p>
                                        </div>

                                        <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3">
                                            <div>
                                                <p class="text-sm font-semibold text-slate-900">Marketing budget</p>
                                                <p class="text-xs text-slate-500">Budget Warning</p>
                                            </div>
                                            <p class="text-sm font-semibold text-blue-600">82%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- floating card 1 -->
                            <div
                                class="absolute left-[-0.75rem] top-[18.75rem] z-20 w-[145px] rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_35px_rgba(15,23,42,0.14)]"
                            >
                                <p class="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">Category limit</p>
                                <p class="mt-2 text-3xl font-bold text-slate-900">$1,240</p>
                                <div class="mt-3 h-2 rounded-full bg-slate-200">
                                    <div class="h-2 w-[68%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                                </div>
                                <p class="mt-2 text-xs leading-5 text-slate-500">
                                    68% of monthly budget used
                                </p>
                            </div>

                            <!-- floating card 2 -->
                            <div
                                class="absolute right-[-1.4rem] top-[6.2rem] z-20 w-[155px] rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_35px_rgba(15,23,42,0.14)]"
                            >
                                <div class="space-y-3">
                                    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                                        <div>
                                            <p class="text-sm font-semibold text-slate-900">Office supplies</p>
                                            <p class="text-xs text-slate-500">Expense</p>
                                        </div>
                                        <p class="text-sm font-semibold text-rose-600">$240</p>
                                    </div>

                                    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                                        <div>
                                            <p class="text-sm font-semibold text-slate-900">Marketing</p>
                                            <p class="text-xs text-slate-500">Budget</p>
                                        </div>
                                        <p class="text-sm font-semibold text-blue-600">82%</p>
                                    </div>

                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-sm font-semibold text-slate-900">Profit trend</p>
                                            <p class="text-xs text-slate-500">Healthy</p>
                                        </div>
                                        <p class="text-sm font-semibold text-emerald-600">+12%</p>
                                    </div>
                                </div>
                            </div>
						</div>
					</div>
				</div>
			</div>

			<div
				class="w-full rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_25px_60px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-950 sm:p-6"
			>
				<div class="mb-5 flex items-start justify-between gap-4">
					<div>
						<p
							class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400"
						>
							Create alert
						</p>
						<h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
							Configure a new notification
						</h2>
					</div>

					<div
						class="rounded-2xl bg-blue-600/10 px-3 py-2 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
					>
						{data.alerts.length} records
					</div>
				</div>

				{#if form?.error}
					<div
						class="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
					>
						{form.error}
					</div>
				{/if}

				<form method="POST" action="?/create" class="space-y-4">
					<div>
						<label
							for="title"
							class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>
							Alert title
						</label>
						<input
							id="title"
							name="title"
							type="text"
							placeholder="Enter alert title"
							required
							class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
						/>
					</div>

					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label
								for="type"
								class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>
								Alert type
							</label>
							<select
								id="type"
								name="type"
								required
								class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
							>
								{#each data.alertTypeOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</div>

						<div>
							<label
								for="frequency"
								class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>
								Frequency
							</label>
							<select
								id="frequency"
								name="frequency"
								required
								class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
							>
								{#each data.alertFrequencyOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</div>
					</div>

					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label
								for="amount_threshold"
								class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>
								Amount threshold
							</label>
							<input
								id="amount_threshold"
								name="amount_threshold"
								type="number"
								step="0.01"
								min="0"
								placeholder="Optional amount"
								class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
							/>
						</div>

						<div>
							<label
								for="category_id"
								class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>
								Category
							</label>
							<select
								id="category_id"
								name="category_id"
								class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
							>
								<option value="">All categories</option>
								{#each data.categories as category}
									<option value={category.id}>
										{category.name} ({category.type})
									</option>
								{/each}
							</select>
						</div>
					</div>

					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label
								for="alert_date"
								class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>
								Alert date
							</label>
							<input
								id="alert_date"
								name="alert_date"
								type="date"
								class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
							/>
						</div>

						<div>
							<label
								for="status"
								class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>
								Status
							</label>
							<select
								id="status"
								name="status"
								class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
							>
								<option value="ACTIVE">Active</option>
								<option value="PAUSED">Paused</option>
							</select>
						</div>
					</div>

					<div>
						<label
							for="notes"
							class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
						>
							Notes
						</label>
						<textarea
							id="notes"
							name="notes"
							rows="4"
							placeholder="Add optional notes or context for this alert"
							class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
						></textarea>
					</div>

					<div class="flex flex-wrap items-center gap-3 pt-2">
						<button
							type="submit"
							class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
						>
							Create Alert
						</button>

						<div class="text-sm text-slate-500 dark:text-slate-400">
							Build proactive reminders for your business workflow.
						</div>
					</div>
				</form>
			</div>
		</div>
	</section>

	<section class="space-y-4">
		<div class="flex flex-wrap items-end justify-between gap-4">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
					Alert center
				</p>
				<h2 class="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
					Your configured alerts
				</h2>
			</div>

			<div
				class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
			>
				{data.alerts.length} total alert{data.alerts.length === 1 ? '' : 's'}
			</div>
		</div>

		{#if data.alerts.length === 0}
			<div
				class="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
			>
				<h3 class="text-xl font-semibold text-slate-900 dark:text-white">No alerts created yet</h3>
				<p class="mt-3 text-slate-600 dark:text-slate-400">
					Create your first smart alert above to start tracking important financial events.
				</p>
			</div>
		{:else}
			<div class="grid gap-5 lg:grid-cols-2">
				{#each data.alerts as alert}
					<div
						class="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900"
					>
						<div class="flex items-start justify-between gap-4">
							<div class="min-w-0">
								<div class="flex flex-wrap items-center gap-2">
									<h3 class="truncate text-lg font-bold text-slate-900 dark:text-white">
										{alert.title}
									</h3>

									<span
										class={`rounded-full px-2.5 py-1 text-xs font-semibold ${
											alert.status === 'ACTIVE'
												? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
												: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
										}`}
									>
										{statusLabels[alert.status] ?? alert.status}
									</span>
								</div>

								<p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
									{typeLabels[alert.type] ?? alert.type}
								</p>
							</div>

							<div class="flex items-center gap-2">
								<button
									type="button"
									onclick={() =>
										(editingAlertId = editingAlertId === alert.id ? null : alert.id)}
									class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-900/50 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
								>
									{editingAlertId === alert.id ? 'Cancel' : 'Edit'}
								</button>

								<form method="POST" action="?/delete">
									<input type="hidden" name="alert_id" value={alert.id} />
									<button
										type="submit"
										class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-900/50 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
									>
										Delete
									</button>
								</form>
							</div>
						</div>

						{#if editingAlertId === alert.id}
                                <form method="POST" action="?/update" class="mt-5 space-y-4">
                                    <input type="hidden" name="alert_id" value={alert.id} />

                                    <div>
                                        <label for={`title-${alert.id}`} class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Alert title
                                        </label>
                                        <input
                                            id={`title-${alert.id}`}
                                            name="title"
                                            type="text"
                                            value={alert.title}
                                            required
                                            class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                                        />
                                    </div>

                                    <div class="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label for={`type-${alert.id}`} class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Alert type
                                            </label>
                                            <select
                                                id={`type-${alert.id}`}
                                                name="type"
                                                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                                            >
                                                {#each data.alertTypeOptions as option}
                                                    <option value={option.value} selected={option.value === alert.type}>
                                                        {option.label}
                                                    </option>
                                                {/each}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                for={`frequency-${alert.id}`}
                                                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                            >
                                                Frequency
                                            </label>
                                            <select
                                                id={`frequency-${alert.id}`}
                                                name="frequency"
                                                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                                            >
                                                {#each data.alertFrequencyOptions as option}
                                                    <option value={option.value} selected={option.value === alert.frequency}>
                                                        {option.label}
                                                    </option>
                                                {/each}
                                            </select>
                                        </div>
                                    </div>

                                    <div class="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label
                                                for={`amount-threshold-${alert.id}`}
                                                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                            >
                                                Amount threshold
                                            </label>
                                            <input
                                                id={`amount-threshold-${alert.id}`}
                                                name="amount_threshold"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={alert.amount_threshold ?? ''}
                                                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                for={`category-${alert.id}`}
                                                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                            >
                                                Category
                                            </label>
                                            <select
                                                id={`category-${alert.id}`}
                                                name="category_id"
                                                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                                            >
                                                <option value="">All categories</option>
                                                {#each data.categories as category}
                                                    <option value={category.id} selected={category.id === alert.category_id}>
                                                        {category.name} ({category.type})
                                                    </option>
                                                {/each}
                                            </select>
                                        </div>
                                    </div>

                                    <div class="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label
                                                for={`alert-date-${alert.id}`}
                                                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                            >
                                                Alert date
                                            </label>
                                            <input
                                                id={`alert-date-${alert.id}`}
                                                name="alert_date"
                                                type="date"
                                                value={toDateInputValue(alert.alert_date)}
                                                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                for={`status-${alert.id}`}
                                                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                            >
                                                Status
                                            </label>
                                            <select
                                                id={`status-${alert.id}`}
                                                name="status"
                                                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                                            >
                                                <option value="ACTIVE" selected={alert.status === 'ACTIVE'}>Active</option>
                                                <option value="PAUSED" selected={alert.status === 'PAUSED'}>Paused</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label for={`notes-${alert.id}`} class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Notes
                                        </label>
                                        <textarea
                                            id={`notes-${alert.id}`}
                                            name="notes"
                                            rows="4"
                                            class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                                        >{alert.notes ?? ''}</textarea>
                                    </div>

                                    <div class="flex items-center gap-3">
                                        <button
                                            type="submit"
                                            class="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                                        >
                                            Save Changes
                                        </button>

                                        <button
                                            type="button"
                                            onclick={() => (editingAlertId = null)}
                                            class="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            {:else}
							<div class="mt-5 grid gap-3 sm:grid-cols-2">
								<div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
									<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
										Frequency
									</p>
									<p class="mt-2 text-sm font-medium text-slate-900 dark:text-white">
										{frequencyLabels[alert.frequency] ?? alert.frequency}
									</p>
								</div>

								<div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
									<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
										Threshold
									</p>
									<p class="mt-2 text-sm font-medium text-slate-900 dark:text-white">
										{formatCurrency(alert.amount_threshold)}
									</p>
								</div>

								<div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
									<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
										Category
									</p>
									<p class="mt-2 text-sm font-medium text-slate-900 dark:text-white">
										{alert.category?.name ?? 'All categories'}
									</p>
								</div>

								<div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
									<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
										Alert date
									</p>
									<p class="mt-2 text-sm font-medium text-slate-900 dark:text-white">
										{formatDate(alert.alert_date)}
									</p>
								</div>
							</div>

							{#if alert.notes}
								<div class="mt-4 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
									<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
										Notes
									</p>
									<p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
										{alert.notes}
									</p>
								</div>
							{/if}
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>