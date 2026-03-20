<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="mx-auto max-w-md px-6 py-16">
	<div class="card p-8">
		<h1 class="text-3xl font-bold">Create account</h1>
		<p class="mt-2 text-sm text-slate-600">Start tracking your finances in one dashboard.</p>

		<form method="POST" class="mt-6 space-y-4">
			<div>
				<label for="signup-email" class="mb-1 block text-sm font-medium">Email</label>
				<input id="signup-email" name="email" type="email" required />
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
			<a href="/login" class="font-semibold text-sky-600">Login</a>
		</p>
	</div>
</div>