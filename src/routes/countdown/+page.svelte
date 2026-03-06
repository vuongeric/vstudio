<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	const TARGET = new Date('2026-08-26T00:00:00');

	const units = ['months', 'weeks', 'days', 'hours', 'minutes', 'seconds'] as const;
	type Unit = (typeof units)[number];

	let current = $state<Unit>('months');
	let value = $state(0);
	let interval: ReturnType<typeof setInterval>;

	function calcMonths(now: Date, target: Date) {
		let m =
			(target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
		if (now.getDate() > target.getDate()) m--;
		return Math.max(0, m);
	}

	function getValue(unit: Unit): number {
		const now = new Date();
		const diff = Math.max(0, TARGET.getTime() - now.getTime());
		switch (unit) {
			case 'months':  return calcMonths(now, TARGET);
			case 'weeks':   return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
			case 'days':    return Math.floor(diff / (1000 * 60 * 60 * 24));
			case 'hours':   return Math.floor(diff / (1000 * 60 * 60));
			case 'minutes': return Math.floor(diff / (1000 * 60));
			case 'seconds': return Math.floor(diff / 1000);
		}
	}

	function tick() {
		value = getValue(current);
	}

	function next() {
		const idx = units.indexOf(current);
		current = units[(idx + 1) % units.length];
		tick();
	}

	onMount(() => {
		tick();
		interval = setInterval(tick, 1000);
	});

	onDestroy(() => clearInterval(interval));
</script>

<svelte:head>
	<title>—</title>
</svelte:head>

<div class="wrap">
	<div class="number">{value.toLocaleString()}</div>
	<div class="label">{current}</div>
	<button class="btn" onclick={next} aria-label="Switch unit">↻</button>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 1rem 5rem;
		gap: 0;
	}

	.number {
		font-size: clamp(4rem, 14vw, 9rem);
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
		color: #1a1a1a;
	}

	.label {
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.8rem;
		letter-spacing: 0.2em;
		text-transform: lowercase;
		color: #999;
		margin-top: 0.75rem;
	}

	.btn {
		margin-top: 2rem;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid #e0e0e0;
		background: #fff;
		cursor: pointer;
		font-size: 1.1rem;
		color: #666;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: border-color 0.2s, color 0.2s, transform 0.15s;
	}

	.btn:hover {
		border-color: #aaa;
		color: #333;
	}

	.btn:active {
		transform: scale(0.9) rotate(90deg);
	}
</style>
