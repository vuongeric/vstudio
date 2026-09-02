<script>
	import { base } from '$app/paths';

	const drinks = [
		{
			number: '01',
			name: 'Matcha Latte',
			description: 'Ceremonial matcha · milk or oat · syrup',
			notes: 'ICED'
		},
		{
			number: '02',
			name: 'SAN “G”',
			description: 'Guava · green grape · jasmine tea'
		},
		{
			number: '03',
			name: 'Salty Canadian',
			description: 'Maple syrup · milk · buttermilk · salt',
			extra: 'HOT / ICED'
		},
		{
			number: '04',
			name: 'Espresso',
			description: 'Latte · Americano',
			notes: 'SWEETENER PROVIDED',
			extra: 'HOT / COLD'
		}
	];
</script>

<svelte:head>
	<title>Menu</title>
	<meta name="description" content="A contemporary editorial drinks menu." />
</svelte:head>

<main class="menu-shell">
	<article class="menu-sheet" aria-labelledby="menu-title">
		<header class="top-row">
			<div class="menu-header">
				<h1 id="menu-title">Menu</h1>
			</div>

			<aside class="qr-panel" aria-label="Instagram QR code">
				<div class="qr-frame">
					<img
						class="qr-image"
						src={`${base}/cafe-qr/foodlovereric-instagram-qr.jpeg`}
						alt="Instagram QR code for @foodlovereric"
					/>
				</div>
			</aside>
		</header>

		<section class="menu-grid" aria-label="Drink menu">
			{#each drinks as drink}
				<article class="menu-item">
					<p class="item-number">{drink.number}</p>
					<h2>{drink.name}</h2>
					<div class="item-details">
						<p>{drink.description}</p>
						{#if drink.notes}<p>{drink.notes}</p>{/if}
					</div>
					{#if drink.extra}<p class="extra">{drink.extra}</p>{/if}
				</article>
			{/each}
		</section>

		<footer>
			<p>Prepared with care, one cup at a time.</p>
		</footer>
	</article>
</main>

<style>
	:global(body) {
		margin: 0;
		color: #181815;
		background: #d9d9d4;
		font-family: 'Helvetica Neue', 'Apple SD Gothic Neo', Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
	}

	.menu-shell,
	.menu-shell * {
		box-sizing: border-box;
	}

	.menu-shell {
		--ink: #181815;
		--muted-ink: #66655f;
		--paper: #f7f6f0;
		--rule: #c8c6bc;
		--sans: 'Helvetica Neue', 'Apple SD Gothic Neo', Arial, sans-serif;
		min-height: 100vh;
		display: grid;
		place-items: center;
		padding: clamp(1rem, 4vw, 4rem);
		font-family: var(--sans);
	}

	.menu-sheet {
		position: relative;
		display: flex;
		width: min(100%, 210mm);
		min-height: 297mm;
		padding: clamp(2.75rem, 6vw, 5rem) clamp(2rem, 5vw, 4.5rem) 2.5rem;
		overflow: hidden;
		flex-direction: column;
		border-radius: 3px;
		background: var(--paper);
		box-shadow: 0 24px 60px rgba(35, 35, 31, 0.18);
	}

	.menu-sheet::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 2;
		pointer-events: none;
		border: 1px solid rgba(24, 24, 21, 0.08);
	}

	.top-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(8rem, 11rem);
		gap: clamp(2rem, 6vw, 4rem);
		align-items: end;
		min-height: 13rem;
	}

	.menu-header {
		min-width: 0;
	}

	.item-number,
	.item-details,
	.extra,
	footer {
		text-transform: uppercase;
		letter-spacing: 0.16em;
	}

	h1 {
		margin: 0;
		font-family: var(--sans);
		font-size: clamp(3.6rem, 7vw, 5.8rem);
		font-weight: 650;
		letter-spacing: -0.075em;
		line-height: 0.82;
		text-transform: uppercase;
	}

	.menu-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-template-rows: repeat(2, minmax(0, 1fr));
		flex: 1;
	}

	.menu-item {
		min-height: 15rem;
		padding: 2.25rem 2.25rem 2rem 0;
		border-bottom: 1px solid var(--rule);
	}

	.menu-item:nth-child(even) {
		padding-right: 0;
		padding-left: 2.25rem;
		border-left: 1px solid var(--rule);
	}

	.item-number {
		margin: 0 0 1.8rem;
		color: var(--muted-ink);
		font-size: 0.55rem;
		font-weight: 700;
	}

	h2 {
		max-width: 13ch;
		margin: 0;
		font-family: var(--sans);
		font-size: clamp(1.2rem, 2.5vw, 1.72rem);
		font-weight: 650;
		letter-spacing: -0.025em;
		line-height: 1;
		text-transform: uppercase;
	}

	.item-details {
		margin-top: 1.65rem;
		color: var(--muted-ink);
		font-size: clamp(0.72rem, 1.7vw, 0.86rem);
		font-weight: 500;
		line-height: 1.55;
		letter-spacing: 0.09em;
	}

	.item-details p,
	footer p {
		margin: 0;
	}

	.item-details p + p {
		margin-top: 0.45rem;
	}

	.extra {
		display: inline-block;
		margin: 1.15rem 0 0;
		padding: 0.43rem 0.62rem;
		border: 1px solid var(--rule);
		border-radius: 2px;
		color: var(--ink);
		font-size: 0.44rem;
		font-weight: 700;
	}

	footer {
		margin-top: auto;
		padding-top: 2rem;
		color: var(--muted-ink);
		font-size: 0.45rem;
		font-weight: 600;
		line-height: 1.8;
	}

	.qr-panel {
		display: flex;
		min-width: 0;
		padding-left: clamp(1.5rem, 4vw, 2.75rem);
		border-left: 1px solid var(--rule);
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}

	.qr-frame {
		display: block;
		width: min(100%, 10.5rem);
		aspect-ratio: 1;
		overflow: hidden;
		border: 1px solid #e2e0d8;
		border-radius: 0.9rem;
		background: #fff;
		box-shadow: 0 8px 22px rgba(24, 24, 21, 0.08);
	}

	.qr-image {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		transform: scale(1.2);
		transform-origin: center;
	}

	@media (max-width: 760px) {
		.menu-shell {
			display: block;
			padding: 0;
		}

		.menu-sheet {
			min-height: 100vh;
			padding: 2.5rem 1.5rem;
			box-shadow: none;
		}

		.top-row {
			grid-template-columns: minmax(0, 1fr) minmax(7rem, 9rem);
			gap: 1.5rem;
			min-height: 11.5rem;
		}

		.qr-panel {
			padding-left: 1.5rem;
		}

		.qr-frame {
			width: min(100%, 8rem);
		}
	}

	@media (max-width: 480px) {
		.menu-grid {
			grid-template-columns: 1fr;
		}

		.menu-item,
		.menu-item:nth-child(even) {
			min-height: auto;
			padding: 2rem 0;
			border-left: 0;
		}
	}

	@media print {
		@page {
			size: A4 portrait;
			margin: 0;
		}

		:global(body) {
			background: white;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}

		.menu-shell {
			display: block;
			padding: 0;
		}

		.menu-sheet {
			width: 210mm;
			height: 297mm;
			min-height: 297mm;
			padding: 20mm 18mm 14mm;
			border-radius: 0;
			box-shadow: none;
		}
	}
</style>
