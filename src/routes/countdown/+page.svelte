<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	const START  = new Date('2026-02-26T00:00:00');
	const TARGET = new Date('2026-09-23T00:00:00');

	let months  = $state(0);
	let weeks   = $state(0);
	let days    = $state(0);
	let hours   = $state(0);
	let minutes = $state(0);
	let seconds = $state(0);
	let mounted  = $state(false);
	let prevSeconds = -1;
	let tickKey = $state(0);
	let interval: ReturnType<typeof setInterval>;

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
		if (seconds !== prevSeconds) { prevSeconds = seconds; tickKey++; }
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

	interface Square { status: 'past' | 'today' | 'future' }

	function buildSquares(): Square[] {
		const squares: Square[] = [];
		const now   = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		let cur = new Date(START);
		while (cur <= TARGET) {
			const d = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate());
			if      (d < today)                       squares.push({ status: 'past' });
			else if (d.getTime() === today.getTime()) squares.push({ status: 'today' });
			else                                      squares.push({ status: 'future' });
			cur.setDate(cur.getDate() + 1);
		}
		return squares;
	}

	const squares = buildSquares();
</script>

<svelte:head>
	<title>—</title>
</svelte:head>

<div class="page" class:mounted>

	<div class="grid">
		{#each squares as sq}
			<div class="sq {sq.status}"></div>
		{/each}
	</div>

	<div class="countdown">
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

</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 1.8rem;
		padding: 0.5rem 0;
	}

	/* ---------- grid ---------- */
	.grid {
		display: grid;
		grid-template-columns: repeat(26, 14px);
		grid-template-rows: repeat(7, 14px);
		gap: 3px;
		opacity: 0;
		transform: translateY(6px);
		transition: opacity 0.5s ease, transform 0.5s ease;
	}
	.mounted .grid { opacity: 1; transform: translateY(0); }

	.sq {
		width: 14px;
		height: 14px;
		border-radius: 2px;
	}

	.sq.future {
		border: 1px solid #ddd;
	}

	.sq.past {
		background: #e8e8e8;
		position: relative;
		overflow: hidden;
	}
	.sq.past::before,
	.sq.past::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 140%;
		height: 1px;
		background: #c0c0c0;
		transform-origin: center;
	}
	.sq.past::before { transform: translate(-50%, -50%) rotate(45deg); }
	.sq.past::after  { transform: translate(-50%, -50%) rotate(-45deg); }

	.sq.today {
		background: #1a1a1a;
	}

	/* ---------- countdown ---------- */
	.row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding: 0.4rem 0;
		border-bottom: 1px solid #eee;
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.5s ease calc(0.2s + var(--i) * 70ms),
			transform 0.5s ease calc(0.2s + var(--i) * 70ms);
	}
	.row:first-child { border-top: 1px solid #eee; }
	.mounted .row { opacity: 1; transform: translateY(0); }

	.unit {
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.7rem;
		letter-spacing: 0.15em;
		color: #999;
	}

	.num {
		font-size: 1.6rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
		color: #1a1a1a;
	}

	.num.tick { animation: flash 0.4s ease-out forwards; }

	@keyframes flash {
		0%   { color: #bbb; transform: scale(1.04); }
		100% { color: #1a1a1a; transform: scale(1); }
	}
</style>
