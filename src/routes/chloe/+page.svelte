<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	const target = new Date('2026-09-29T00:00:00');

	let now = $state(new Date());
	let mounted = $state(false);
	let monthIndex = $state(0);
	let interval: ReturnType<typeof setInterval>;
	const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	function monthStart(date: Date) {
		return new Date(date.getFullYear(), date.getMonth(), 1);
	}

	function monthKey(date: Date) {
		return `${date.getFullYear()}-${date.getMonth()}`;
	}

	function sameDay(a: Date, b: Date) {
		return (
			a.getFullYear() === b.getFullYear() &&
			a.getMonth() === b.getMonth() &&
			a.getDate() === b.getDate()
		);
	}

	function buildMonths(startDate: Date, endDate: Date) {
		const start = monthStart(startDate <= endDate ? startDate : endDate);
		const end = monthStart(endDate);
		const months = [];
		const cursor = new Date(start);

		while (cursor <= end) {
			const year = cursor.getFullYear();
			const month = cursor.getMonth();
			const daysInMonth = new Date(year, month + 1, 0).getDate();
			const mondayStartOffset = (new Date(year, month, 1).getDay() + 6) % 7;

			months.push({
				key: monthKey(cursor),
				label: monthNames[month],
				year,
				leadingBlanks: Array.from({ length: mondayStartOffset }),
				days: Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1))
			});

			cursor.setMonth(cursor.getMonth() + 1);
		}

		return months;
	}

	const totalMs = $derived(Math.max(0, target.getTime() - now.getTime()));
	const totalSeconds = $derived(Math.floor(totalMs / 1000));
	const days = $derived(Math.floor(totalSeconds / 86400));
	const hours = $derived(Math.floor((totalSeconds % 86400) / 3600));
	const minutes = $derived(Math.floor((totalSeconds % 3600) / 60));
	const seconds = $derived(totalSeconds % 60);
	const isDone = $derived(totalMs === 0);

	const units = $derived([
		{ label: 'days', value: days },
		{ label: 'hours', value: hours },
		{ label: 'minutes', value: minutes },
		{ label: 'seconds', value: seconds }
	]);
	const months = $derived(buildMonths(now, target));
	const currentMonth = $derived(months[monthIndex]);
	const canGoBack = $derived(monthIndex > 0);
	const canGoForward = $derived(monthIndex < months.length - 1);

	function changeMonth(direction: number) {
		monthIndex = Math.min(Math.max(monthIndex + direction, 0), months.length - 1);
	}

	$effect(() => {
		if (monthIndex > months.length - 1) {
			monthIndex = Math.max(months.length - 1, 0);
		}
	});

	onMount(() => {
		now = new Date();
		interval = setInterval(() => {
			now = new Date();
		}, 1000);
		requestAnimationFrame(() => {
			mounted = true;
		});
	});

	onDestroy(() => clearInterval(interval));
</script>

<svelte:head>
	<title>Chloe</title>
</svelte:head>

<section class="chloe-page" class:mounted>
	<div class="content">
		<header class="masthead">
			<h1>Chloe</h1>
		</header>

		<section class="calendar" aria-label="Calendar">
			{#if currentMonth}
				<div class="calendar-nav">
					<button
						type="button"
						aria-label="Previous month"
						disabled={!canGoBack}
						onclick={() => changeMonth(-1)}
					>
						‹
					</button>
					<span>{monthIndex + 1} / {months.length}</span>
					<button
						type="button"
						aria-label="Next month"
						disabled={!canGoForward}
						onclick={() => changeMonth(1)}
					>
						›
					</button>
				</div>

				<div class="month" id={`month-${currentMonth.key}`}>
					<div class="calendar-top">
						<span>{currentMonth.label}</span>
						<span>{currentMonth.year}</span>
					</div>

					<div class="weekdays" aria-hidden="true">
						{#each weekdays as day}
							<span>{day}</span>
						{/each}
					</div>

					<div class="days">
						{#each currentMonth.leadingBlanks as _}
							<span class="blank"></span>
						{/each}
						{#each currentMonth.days as day}
							<span class:today={sameDay(day, now)} class:target-day={sameDay(day, target)}>
								{day.getDate()}
							</span>
						{/each}
					</div>
				</div>
			{/if}
		</section>

		{#if isDone}
			<p class="done">today is the day</p>
		{:else}
			<div class="units" aria-label="Countdown">
				{#each units as unit}
					<div class="unit">
						<strong>{unit.value.toString().padStart(unit.label === 'days' ? 1 : 2, '0')}</strong>
						<span>{unit.label}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	:global(main) {
		max-width: none;
		padding: 0;
	}

	.chloe-page {
		min-height: calc(100vh - 7rem);
		display: grid;
		place-items: center;
		padding: 1.6rem 1.25rem 2rem;
		background: #d8c9b4;
		color: #241f19;
	}

	.content {
		width: min(680px, 100%);
		text-align: center;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.6s ease,
			transform 0.6s ease;
	}

	.mounted .content {
		opacity: 1;
		transform: translateY(0);
	}

	.calendar-top,
	.weekdays,
	.unit span,
	.done {
		font-family: 'Avenir Next', 'Helvetica Neue', Arial, sans-serif;
	}

	h1 {
		font-family: Didot, 'Bodoni 72', 'Bodoni 72 Smallcaps', 'Times New Roman', Georgia, serif;
		font-size: clamp(4rem, 13vw, 8.25rem);
		font-weight: 400;
		line-height: 0.85;
		letter-spacing: -0.035em;
	}

	.calendar {
		width: min(390px, 100%);
		margin: 1.15rem auto 0;
		padding: 0.9rem;
		border: 1px solid rgba(36, 31, 25, 0.18);
		background: rgba(232, 221, 204, 0.52);
		box-shadow: 0 14px 38px rgba(60, 47, 32, 0.11);
	}

	.calendar-nav {
		display: grid;
		grid-template-columns: 2rem 1fr 2rem;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.7rem;
		font-family: 'Avenir Next', 'Helvetica Neue', Arial, sans-serif;
		color: rgba(36, 31, 25, 0.58);
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.calendar-nav button {
		min-width: 2rem;
		aspect-ratio: 1;
		border: 1px solid rgba(36, 31, 25, 0.22);
		border-radius: 999px;
		background: rgba(232, 221, 204, 0.45);
		color: #241f19;
		font-family: Didot, 'Bodoni 72', Georgia, serif;
		font-size: 1.25rem;
		line-height: 1;
		cursor: pointer;
		touch-action: manipulation;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			opacity 0.2s ease;
	}

	.calendar-nav button:hover:not(:disabled) {
		border-color: rgba(36, 31, 25, 0.42);
		background: rgba(232, 221, 204, 0.72);
	}

	.calendar-nav button:disabled {
		cursor: default;
		opacity: 0.28;
	}

	.month {
		min-height: 268px;
	}

	.calendar-top {
		display: flex;
		justify-content: space-between;
		padding-bottom: 0.65rem;
		border-bottom: 1px solid rgba(36, 31, 25, 0.16);
		font-size: 0.76rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.weekdays,
	.days {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
	}

	.weekdays {
		margin-top: 0.72rem;
		color: rgba(36, 31, 25, 0.5);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
	}

	.days {
		gap: 0.26rem;
		margin-top: 0.32rem;
	}

	.days span {
		aspect-ratio: 1;
		display: grid;
		place-items: center;
		font-family: Didot, 'Bodoni 72', Georgia, serif;
		font-size: 0.95rem;
		color: rgba(36, 31, 25, 0.82);
	}

	.days .blank {
		visibility: hidden;
	}

	.days .target-day {
		border: 1px solid rgba(36, 31, 25, 0.62);
		background: #241f19;
		color: #e8ddcc;
	}

	.days .today:not(.target-day) {
		outline: 1px solid rgba(36, 31, 25, 0.42);
		outline-offset: -5px;
	}

	.units {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.5rem;
		width: min(480px, 100%);
		margin: 1rem auto 0;
	}

	.unit {
		display: grid;
		gap: 0.2rem;
		padding: 0.6rem 0.45rem;
		border-top: 1px solid rgba(36, 31, 25, 0.3);
		border-bottom: 1px solid rgba(36, 31, 25, 0.18);
	}

	.unit strong {
		font-family: Didot, 'Bodoni 72', Georgia, serif;
		font-size: clamp(1.65rem, 4vw, 3rem);
		font-weight: 400;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.unit span {
		color: rgba(36, 31, 25, 0.58);
		font-size: 0.64rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.done {
		margin-top: 1.25rem;
		color: rgba(36, 31, 25, 0.7);
		font-size: 0.9rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	@media (max-width: 700px) {
		.chloe-page {
			min-height: calc(100svh - 6rem);
			align-items: start;
			padding: 0.9rem 0.95rem 1.4rem;
		}

		h1 {
			font-size: clamp(3.55rem, 18vw, 5.9rem);
		}

		.units {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0.45rem;
			margin-top: 0.8rem;
		}

		.calendar {
			width: min(340px, 100%);
			margin-top: 0.8rem;
			padding: 0.68rem;
			box-shadow: 0 10px 26px rgba(60, 47, 32, 0.1);
		}

		.calendar-nav {
			grid-template-columns: 2.35rem 1fr 2.35rem;
			gap: 0.5rem;
			margin-bottom: 0.55rem;
			font-size: 0.62rem;
			letter-spacing: 0.12em;
		}

		.calendar-nav button {
			min-width: 2.35rem;
			font-size: 1.35rem;
		}

		.month {
			min-height: 232px;
		}

		.calendar-top {
			padding-bottom: 0.55rem;
			font-size: 0.68rem;
			letter-spacing: 0.15em;
		}

		.weekdays {
			margin-top: 0.55rem;
			font-size: 0.62rem;
		}

		.days {
			gap: 0.2rem;
			margin-top: 0.26rem;
		}

		.days span {
			font-size: 0.86rem;
		}

		.days .today:not(.target-day) {
			outline-offset: -4px;
		}

		.unit {
			gap: 0.15rem;
			padding: 0.5rem 0.35rem;
		}

		.unit strong {
			font-size: clamp(1.45rem, 9vw, 2.35rem);
		}

		.unit span {
			font-size: 0.58rem;
			letter-spacing: 0.13em;
		}
	}

	@media (max-width: 380px) {
		.chloe-page {
			padding-inline: 0.7rem;
		}

		h1 {
			font-size: clamp(3.1rem, 17vw, 4.5rem);
		}

		.calendar {
			width: min(310px, 100%);
		}

		.month {
			min-height: 214px;
		}

		.days span {
			font-size: 0.8rem;
		}
	}
</style>
