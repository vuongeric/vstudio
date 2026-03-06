<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	const TARGET = new Date('2026-08-26T00:00:00');

	let months  = $state(0);
	let weeks   = $state(0);
	let days    = $state(0);
	let hours   = $state(0);
	let minutes = $state(0);
	let seconds = $state(0);

	let interval: ReturnType<typeof setInterval>;
	let mounted  = $state(false);

	// track prev seconds to trigger tick animation
	let prevSeconds = -1;
	let tickKey = $state(0);

	function calcMonths(now: Date, target: Date) {
		let m = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
		if (now.getDate() > target.getDate()) m--;
		return Math.max(0, m);
	}

	function tick() {
		const now  = new Date();
		const diff = Math.max(0, TARGET.getTime() - now.getTime());
		months  = calcMonths(now, TARGET);
		weeks   = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
		days    = Math.floor(diff / (1000 * 60 * 60 * 24));
		hours   = Math.floor(diff / (1000 * 60 * 60));
		minutes = Math.floor(diff / (1000 * 60));
		seconds = Math.floor(diff / 1000);
		if (seconds !== prevSeconds) {
			prevSeconds = seconds;
			tickKey++;
		}
	}

	onMount(() => {
		tick();
		interval = setInterval(tick, 1000);
		requestAnimationFrame(() => { mounted = true; });
	});

	onDestroy(() => clearInterval(interval));

	const rows: { label: string; getValue: () => number }[] = [
		{ label: 'months',  getValue: () => months  },
		{ label: 'weeks',   getValue: () => weeks   },
		{ label: 'days',    getValue: () => days    },
		{ label: 'hours',   getValue: () => hours   },
		{ label: 'minutes', getValue: () => minutes },
		{ label: 'seconds', getValue: () => seconds },
	];
</script>

<svelte:head>
	<title>—</title>
</svelte:head>

<div class="wrap" class:mounted>
	{#each rows as row, i}
		<div class="row" style="--i:{i}">
			<span class="unit">{row.label}</span>
				{#if row.label === 'seconds'}
				{#key tickKey}
					<span class="num tick">{row.getValue().toLocaleString()}</span>
				{/key}
			{:else}
				<span class="num">{row.getValue().toLocaleString()}</span>
			{/if}
		</div>
	{/each}
</div>

<style>
	.wrap {
		padding: 0.5rem 0 1rem;
	}

	.row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding: 0.55rem 0;
		border-bottom: 1px solid #eee;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.5s ease calc(var(--i) * 80ms),
			transform 0.5s ease calc(var(--i) * 80ms);
	}

	.row:first-child {
		border-top: 1px solid #eee;
	}

	.mounted .row {
		opacity: 1;
		transform: translateY(0);
	}

	.unit {
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: lowercase;
		color: #999;
	}

	.num {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: clamp(1.5rem, 4vw, 2.6rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
		color: #1a1a1a;
		transition: color 0.15s ease;
	}

	/* flash the seconds on each tick */
	.num.tick {
		animation: flash 0.4s ease-out forwards;
	}

	@keyframes flash {
		0%   { color: #aaa; transform: scale(1.04); }
		100% { color: #1a1a1a; transform: scale(1); }
	}
</style>
