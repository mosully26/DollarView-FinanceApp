<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="mx-auto max-w-md px-6 py-16">
	<div class="card p-8">
		<h1 class="text-3xl font-bold">Login</h1>
		<p class="mt-2 text-sm text-slate-600">Welcome back to DollarView.</p>

		<form method="POST" class="mt-6 space-y-4">
			<div>
				<label for="login-email" class="mb-1 block text-sm font-medium">Email</label>
				<input id="login-email" name="email" type="email" required />
			</div>

			<div>
				<label for="login-password" class="mb-1 block text-sm font-medium">Password</label>
				<input id="login-password" name="password" type="password" required />
			</div>

			{#if form?.error}
				<p class="text-sm text-rose-600">{form.error}</p>
			{/if}

			<button class="btn-primary w-full" type="submit">Login</button>
		</form>

		<p class="mt-4 text-sm text-slate-600">
			No account?
			<a href="/signup" class="font-semibold text-sky-600">Create one</a>
		</p>
	</div>
</div>