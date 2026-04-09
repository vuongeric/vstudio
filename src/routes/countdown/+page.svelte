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

	const dayData: Record<string, { candy?: number; chocolate?: number; jackpot?: boolean }> = {
		'2026-03-02': { candy: 2 },
		'2026-03-03': { candy: 1 },
		'2026-03-04': { candy: 2 },
		'2026-03-05': { candy: 1 },
		'2026-03-09': { candy: 3 },
		'2026-03-10': { candy: 2 },
		'2026-03-11': { candy: 4 },
		'2026-03-12': { candy: 1 },
		'2026-03-13': { candy: 2 },
		'2026-03-16': { candy: 1 },
		'2026-03-17': { candy: 2 },
		'2026-03-18': { candy: 5 },
		'2026-03-19': { candy: 2 },
		'2026-03-20': { candy: 4 },
		'2026-03-23': { candy: 1 },
		'2026-03-24': { candy: 3 },
		'2026-03-25': { candy: 2 },
		'2026-03-26': { candy: 2 },
		'2026-03-27': { candy: 3, chocolate: 2 },
		'2026-03-30': { candy: 1 },
		'2026-03-31': { candy: 2 },
		'2026-04-01': { candy: 2, chocolate: 1 },
		'2026-04-02': { jackpot: true },
		'2026-04-09': { candy: 2, chocolate: 1 },
	};

	interface Square { status: 'past' | 'today' | 'future'; candy: number; chocolate: number; jackpot: boolean; date: Date }

	function dateKey(d: Date): string {
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
	}

	function buildSquares(): Square[] {
		const squares: Square[] = [];
		const now   = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		let cur = new Date(START);
		while (cur <= TARGET) {
			const d    = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate());
			const data = dayData[dateKey(d)] ?? {};
			let status: 'past' | 'today' | 'future';
			if      (d < today)                       status = 'past';
			else if (d.getTime() === today.getTime()) status = 'today';
			else                                      status = 'future';
			squares.push({ status, candy: data.candy ?? 0, chocolate: data.chocolate ?? 0, jackpot: data.jackpot ?? false, date: d });
			cur.setDate(cur.getDate() + 1);
		}
		return squares;
	}

	const INTERVIEW_COLORS = ['#9be9a8', '#40c463', '#30a14e', '#216e39', '#1a4f27'];
	const OFFER_COLOR = '#f59e0b';
	const SIGNED_OFFER_COLOR = '#89cff0';

	function squareBg(sq: Square): string {
		if (sq.jackpot)   return SIGNED_OFFER_COLOR;
		if (sq.chocolate > 0)    return OFFER_COLOR;
		if (sq.candy > 0) return INTERVIEW_COLORS[Math.min(sq.candy - 1, INTERVIEW_COLORS.length - 1)];
		return '';
	}

	function squareTip(sq: Square): string {
		const label = sq.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
		const parts: string[] = [label];
		if (sq.candy > 0) parts.push(`candy: ${sq.candy}`);
		if (sq.chocolate > 0)     parts.push(`chocolate: ${sq.chocolate}`);
		if (sq.jackpot)    parts.push(`jackpot 🎰`);
		if (parts.length === 1) parts.push('🤑');
		return parts.join('\n');
	}

	const squares = buildSquares();

	let confettiCanvas: HTMLCanvasElement;
	let confettiAnimId: number;
	let confettiActive = false;

	interface Particle {
		x: number; y: number;
		vx: number; vy: number;
		w: number; h: number;
		color: string;
		rot: number; rotV: number;
		alpha: number;
	}

	const CONFETTI_COLORS = ['#89cff0','#f59e0b','#40c463','#ff6b6b','#a78bfa','#f472b6','#34d399','#fbbf24'];

	function spawnParticles(arr: Particle[], count: number) {
		const W = window.innerWidth;
		for (let i = 0; i < count; i++) {
			arr.push({
				x: Math.random() * W,
				y: -10,
				vx: (Math.random() - 0.5) * 4,
				vy: Math.random() * 4 + 2,
				w: Math.random() * 10 + 6,
				h: Math.random() * 5 + 3,
				color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
				rot: Math.random() * 360,
				rotV: (Math.random() - 0.5) * 8,
				alpha: 1,
			});
		}
	}

	function startConfetti() {
		if (confettiActive) return;
		confettiActive = true;
		const canvas = confettiCanvas;
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight;
		const ctx = canvas.getContext('2d')!;
		const particles: Particle[] = [];
		spawnParticles(particles, 180);
		let spawnTimer = 0;

		function frame() {
			if (!confettiActive && particles.length === 0) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				return;
			}
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			// keep spawning while hovering
			if (confettiActive) {
				spawnTimer++;
				if (spawnTimer % 8 === 0) spawnParticles(particles, 20);
			}
			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];
				p.x  += p.vx;
				p.y  += p.vy;
				p.rot += p.rotV;
				if (!confettiActive) p.alpha -= 0.012;
				if (p.y > canvas.height || p.alpha <= 0) { particles.splice(i, 1); continue; }
				ctx.save();
				ctx.globalAlpha = p.alpha;
				ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
				ctx.rotate(p.rot * Math.PI / 180);
				ctx.fillStyle = p.color;
				ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
				ctx.restore();
			}
			confettiAnimId = requestAnimationFrame(frame);
		}
		frame();
	}

	function stopConfetti() {
		confettiActive = false;
	}
</script>

<svelte:head>
	<title>—</title>
</svelte:head>

<canvas bind:this={confettiCanvas} style="position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:999"></canvas>

<div class="page" class:mounted>

	<div class="grid">
		{#each squares as sq}
			<div
				class="sq {sq.status} has-tip"
				class:active={sq.jackpot || sq.chocolate > 0 || sq.candy > 0}
				style={squareBg(sq) ? `background:${squareBg(sq)}` : ''}
				data-tip={squareTip(sq)}
				onmouseenter={sq.jackpot ? startConfetti : undefined}
				onmouseleave={sq.jackpot ? stopConfetti : undefined}
			></div>
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
		position: relative;
	}

	.sq.future {
		border: 1px solid #ddd;
	}

	.sq.past {
		background: #e8e8e8;
	}
	.sq.past:not(.active) {
		background-image:
			linear-gradient(45deg,  transparent 35%, #c0c0c0 35%, #c0c0c0 65%, transparent 65%),
			linear-gradient(-45deg, transparent 35%, #c0c0c0 35%, #c0c0c0 65%, transparent 65%);
	}

	.sq.today {
		background: #1a1a1a;
	}

	/* ---------- tooltips ---------- */
	.sq.has-tip {
		cursor: default;
	}
	.sq.has-tip::after {
		content: attr(data-tip);
		position: absolute;
		bottom: calc(100% + 6px);
		left: 50%;
		transform: translateX(-50%);
		background: #1a1a1a;
		color: #fff;
		font-size: 0.65rem;
		font-family: 'Courier New', Courier, monospace;
		white-space: pre;
		padding: 4px 8px;
		border-radius: 4px;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.15s;
		z-index: 10;
	}
	.sq.has-tip:hover::after { opacity: 1; }

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
