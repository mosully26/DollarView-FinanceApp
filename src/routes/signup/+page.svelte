<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<section class="flex min-h-screen flex-col items-center justify-center px-6">
	<div class="mb-8 text-center">
		<a href="/" class="inline-block text-2xl font-bold tracking-widest">
			<span class="text-blue-600">DOLLAR</span>
			<span class="text-slate-900">VIEW</span>
		</a>
	</div>

	<div class="w-full max-w-md">
		<div class="card p-8">
			<h1 class="text-3xl font-bold">Create account</h1>
			<p class="mt-2 text-sm text-slate-600">
				Start tracking your finances in one dashboard.
			</p>

			<form method="POST" class="mt-6 space-y-4">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label for="first-name" class="mb-1 block text-sm font-medium">First name</label>
						<input
							id="first-name"
							name="first_name"
							type="text"
							required
							value={form?.first_name ?? ''}
						/>
					</div>

					<div>
						<label for="last-name" class="mb-1 block text-sm font-medium">Last name</label>
						<input
							id="last-name"
							name="last_name"
							type="text"
							required
							value={form?.last_name ?? ''}
						/>
					</div>
				</div>

				<div>
					<label for="signup-email" class="mb-1 block text-sm font-medium">Email</label>
					<input
						id="signup-email"
						name="email"
						type="email"
						required
						value={form?.email ?? ''}
					/>
				</div>

				<div>
					<label for="signup-password" class="mb-1 block text-sm font-medium">Password</label>
					<input id="signup-password" name="password" type="password" minlength="6" required />
				</div>

				{#if form?.error}
					<p class="text-sm text-rose-600">{form.error}</p>
				{/if}

				<button class="btn-primary w-full" type="submit">Create account</button>
			</form>

			<p class="mt-4 text-sm text-slate-600">
				Already have an account?
				<a href="/login" class="font-semibold text-sky-600 hover:underline">Login</a>
			</p>
		</div>
	</div>
</section>