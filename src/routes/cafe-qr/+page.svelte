<script>
	import { base } from '$app/paths';

	const drinks = [
		{
			number: '01',
			name: 'Salty Canadian',
			ingredients: ['Maple syrup', 'Milk', 'Butter', 'Salt'],
			temperature: 'iced'
		},
		{
			number: '02',
			name: 'SAN “G”',
			ingredients: ['Guava', 'Green grape', 'Jasmine tea'],
			temperature: 'iced'
		},
		{
			number: '03',
			name: 'Matcha Latte',
			ingredients: ['Ujinotsuyu Matcha', 'Milk', 'Syrup'],
			temperature: 'both'
		},
		{
			number: '04',
			name: 'Espresso',
			ingredients: ['Latte', 'Americano'],
			temperature: 'both'
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
				<a
					class="qr-frame"
					href="https://www.instagram.com/espresso.cart/"
					target="_blank"
					rel="noreferrer"
					aria-label="Open @espresso.cart on Instagram"
				>
					<img
						class="qr-image"
						src={`${base}/cafe-qr/espresso-cart-instagram-qr.jpeg`}
						alt="Instagram QR code for @espresso.cart"
					/>
				</a>
			</aside>
		</header>

		<section class="menu-grid" aria-label="Drink menu">
			{#each drinks as drink}
				<article class="menu-item">
					<p class="item-number">{drink.number}</p>
					<div class="item-heading">
						<h2>{drink.name}</h2>
						{#if drink.temperature === 'both'}
							<p class="temperature">
								<span class="hot">Hot</span><span class="separator">/</span><span class="iced"
									>Iced</span
								>
							</p>
						{:else}
							<p class="temperature iced">Iced</p>
						{/if}
					</div>
					<ul class="item-details">
						{#each drink.ingredients as ingredient}
							<li>{ingredient}</li>
						{/each}
					</ul>
				</article>
			{/each}
		</section>
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
		padding: clamp(2.25rem, 4.5vw, 3.75rem) clamp(1.75rem, 3.8vw, 3.25rem);
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
		grid-template-columns: minmax(0, 1fr) minmax(12rem, 15.5rem);
		gap: clamp(2rem, 5vw, 3.5rem);
		align-items: center;
		min-height: 15rem;
	}

	.menu-header {
		min-width: 0;
	}

	.item-number,
	.item-details {
		text-transform: uppercase;
		letter-spacing: 0.16em;
	}

	h1 {
		margin: 0;
		font-family: var(--sans);
		font-size: clamp(4.8rem, 9vw, 7.25rem);
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
		padding: 2.75rem 2.75rem 2.5rem 0;
	}

	.menu-item:nth-child(-n + 2) {
		border-bottom: 1px solid var(--rule);
	}

	.menu-item:nth-child(even) {
		padding-right: 0;
		padding-left: 2.75rem;
		border-left: 1px solid var(--rule);
	}

	.item-number {
		margin: 0 0 2.15rem;
		color: var(--muted-ink);
		font-size: 0.72rem;
		font-weight: 700;
	}

	h2 {
		flex: 1;
		max-width: 13ch;
		margin: 0;
		font-family: var(--sans);
		font-size: clamp(1.65rem, 3.2vw, 2.15rem);
		font-weight: 650;
		letter-spacing: -0.025em;
		line-height: 1;
		text-transform: uppercase;
	}

	.item-details {
		margin: 1.45rem 0 0;
		padding: 0;
		list-style: none;
		color: var(--muted-ink);
		font-size: clamp(1.05rem, 2.2vw, 1.25rem);
		font-weight: 500;
		line-height: 1.6;
		letter-spacing: 0.09em;
	}

	.item-details li + li {
		margin-top: 0.35rem;
	}

	.item-heading {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		justify-content: space-between;
	}

	.temperature {
		display: inline-flex;
		flex: 0 0 auto;
		gap: 0.36rem;
		align-items: baseline;
		margin: 0;
		padding: 0.4rem 0.68rem;
		border: 1px solid var(--rule);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.45);
		font-size: clamp(0.84rem, 1.76vw, 1rem);
		font-weight: 700;
		letter-spacing: 0.09em;
		line-height: 1.3;
		text-transform: uppercase;
	}

	.hot {
		color: #b63b32;
	}

	.separator {
		color: var(--ink);
	}

	.iced {
		color: #315f9d;
	}

	.qr-panel {
		display: flex;
		min-width: 0;
		padding-left: 0;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}

	.qr-frame {
		display: block;
		width: min(100%, 13.2rem);
		aspect-ratio: 791 / 895;
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
	}

	@media (max-width: 760px) {
		.menu-shell {
			display: block;
			padding: 0;
		}

		.menu-sheet {
			min-height: 100vh;
			padding: 2rem 1.25rem;
			box-shadow: none;
		}

		.top-row {
			grid-template-columns: minmax(0, 1fr) minmax(8rem, 10rem);
			gap: 1.5rem;
			min-height: 13rem;
		}

		.qr-panel {
			padding-left: 0;
		}

		.qr-frame {
			width: min(100%, 9.5rem);
		}
	}

	@media (max-width: 480px) {
		.top-row {
			grid-template-columns: minmax(0, 1fr) minmax(6.5rem, 7.5rem);
			gap: 1rem;
		}

		h1 {
			font-size: 3.7rem;
		}

		.qr-panel {
			padding-left: 0;
		}

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
			padding: 14mm 12mm;
			border-radius: 0;
			box-shadow: none;
		}
	}
</style>
