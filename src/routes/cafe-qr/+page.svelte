<script>
	const drinks = [
		{
			number: '01',
			name: 'Matcha Latte',
			japanese: '抹茶ラテ',
			description: 'Ceremonial matcha · milk or oat · syrup',
			notes: 'ICED'
		},
		{
			number: '02',
			name: 'SAN “G”',
			japanese: 'グァバ・ぶどう・ジャスミン',
			description: 'Guava · green grape · jasmine tea'
		},
		{
			number: '03',
			name: 'Salty Canadian',
			japanese: 'ソルティ・カナディアン',
			description: 'Maple syrup · milk · buttermilk · salt',
			extra: 'HOT / ICED'
		},
		{
			number: '04',
			name: 'Espresso',
			japanese: 'エスプレッソ',
			description: 'Latte · Americano',
			notes: 'SWEETENER PROVIDED',
			extra: 'HOT / COLD'
		}
	];
</script>

<svelte:head>
	<title>Menu</title>
	<meta name="description" content="A quiet, Japandi-inspired drinks menu." />
</svelte:head>

<main class="menu-shell">
	<article class="menu-sheet" aria-labelledby="menu-title">
		<header class="top-row">
			<div class="menu-header">
				<p class="eyebrow">DRINKS · お飲みもの</p>
				<h1 id="menu-title">Menu</h1>
				<p class="subtitle">メニューは変更になる場合があります</p>
			</div>

			<aside class="qr-panel" aria-label="QR code placeholder">
				<div class="qr-placeholder" role="img" aria-label="QR code image coming soon">
					<span>QR CODE</span>
					<small>PLACEHOLDER</small>
				</div>
				<p class="qr-note">QR IMAGE TO BE ADDED</p>
			</aside>
		</header>

		<div class="rule"></div>

		<section class="menu-grid" aria-label="Drink menu">
			{#each drinks as drink}
				<article class="menu-item">
					<p class="item-number">{drink.number}</p>
					<h2>{drink.name}</h2>
					<p class="japanese">{drink.japanese}</p>
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
			<p>日本語で書くなら、なんで翻訳っぽい日本語なの？</p>
		</footer>
	</article>
</main>

<style>
	:global(body) {
		margin: 0;
		color: #25241f;
		background:
			radial-gradient(circle at 16% 18%, rgba(255, 255, 255, 0.26), transparent 24%),
			radial-gradient(circle at 82% 76%, rgba(68, 60, 47, 0.08), transparent 30%), #b9b2a5;
		font-family: 'Avenir Next', Avenir, 'Helvetica Neue', Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
	}

	.menu-shell,
	.menu-shell * {
		box-sizing: border-box;
	}

	.menu-shell {
		--ink: #25241f;
		--muted-ink: #6f6a5f;
		--paper: #e8e1d1;
		--rule: rgba(37, 36, 31, 0.42);
		--sans: 'Avenir Next', Avenir, 'Helvetica Neue', Arial, sans-serif;
		--serif:
			'Iowan Old Style', Baskerville, 'Times New Roman', 'YuMincho', 'Hiragino Mincho ProN', serif;
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
		background:
			radial-gradient(circle at 12% 19%, rgba(64, 56, 42, 0.055) 0 0.7px, transparent 0.9px),
			radial-gradient(circle at 74% 68%, rgba(255, 255, 255, 0.2) 0 0.8px, transparent 1px),
			linear-gradient(104deg, rgba(255, 255, 255, 0.13), transparent 31%, rgba(52, 45, 32, 0.035)),
			var(--paper);
		background-size:
			7px 7px,
			11px 11px,
			auto,
			auto;
		box-shadow: 0 28px 75px rgba(57, 51, 43, 0.3);
	}

	.menu-sheet::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 2;
		pointer-events: none;
		border: 1px solid rgba(255, 255, 255, 0.3);
		box-shadow: inset 0 0 70px rgba(84, 75, 59, 0.08);
	}

	.top-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(8rem, 11rem);
		gap: clamp(2rem, 6vw, 4rem);
		align-items: center;
		min-height: 13rem;
	}

	.menu-header {
		min-width: 0;
	}

	.eyebrow,
	.subtitle,
	.item-number,
	.japanese,
	.item-details,
	.extra,
	footer,
	.qr-note,
	.qr-placeholder {
		text-transform: uppercase;
		letter-spacing: 0.16em;
	}

	.eyebrow {
		margin: 0 0 1rem;
		font-size: 0.58rem;
		font-weight: 600;
	}

	h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(3.5rem, 7vw, 6rem);
		font-weight: 400;
		letter-spacing: -0.055em;
		line-height: 0.9;
	}

	.subtitle {
		margin: 1.15rem 0 0;
		color: var(--muted-ink);
		font-size: 0.48rem;
	}

	.rule {
		height: 1px;
		background: var(--rule);
	}

	.menu-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-template-rows: repeat(2, minmax(0, 1fr));
		flex: 1;
	}

	.menu-item {
		min-height: 15rem;
		padding: 2rem 2rem 1.75rem 0;
		border-bottom: 1px solid var(--rule);
	}

	.menu-item:nth-child(even) {
		padding-right: 0;
		padding-left: 2rem;
		border-left: 1px solid var(--rule);
	}

	.item-number {
		margin: 0 0 1.5rem;
		color: var(--muted-ink);
		font-size: 0.52rem;
	}

	h2 {
		max-width: 13ch;
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(1.25rem, 2.6vw, 1.85rem);
		font-weight: 400;
		letter-spacing: -0.025em;
		line-height: 1.05;
		text-transform: uppercase;
	}

	.japanese {
		margin: 0.6rem 0 0;
		color: var(--muted-ink);
		font-size: 0.47rem;
		line-height: 1.6;
	}

	.item-details {
		margin-top: 1.5rem;
		color: var(--muted-ink);
		font-size: 0.49rem;
		line-height: 1.75;
	}

	.item-details p,
	footer p {
		margin: 0;
	}

	.extra {
		display: inline-block;
		margin: 1rem 0 0;
		padding: 0.4rem 0.58rem;
		border: 1px solid var(--rule);
		border-radius: 999px;
		font-size: 0.43rem;
	}

	footer {
		margin-top: auto;
		padding-top: 2rem;
		color: var(--muted-ink);
		font-size: 0.43rem;
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

	.qr-placeholder {
		position: relative;
		display: grid;
		width: min(100%, 9rem);
		aspect-ratio: 1;
		margin: 0 0 0.85rem;
		place-content: center;
		border: 1px dashed var(--rule);
		color: var(--muted-ink);
		text-align: center;
	}

	.qr-placeholder::before,
	.qr-placeholder::after {
		content: '';
		position: absolute;
		width: 2rem;
		height: 2rem;
		border-color: var(--ink);
	}

	.qr-placeholder::before {
		top: 0.7rem;
		left: 0.7rem;
		border-top: 3px solid;
		border-left: 3px solid;
	}

	.qr-placeholder::after {
		right: 0.7rem;
		bottom: 0.7rem;
		border-right: 3px solid;
		border-bottom: 3px solid;
	}

	.qr-placeholder span,
	.qr-placeholder small {
		display: block;
	}

	.qr-placeholder span {
		font-family: var(--serif);
		font-size: 1rem;
		letter-spacing: 0.12em;
	}

	.qr-placeholder small {
		margin-top: 0.45rem;
		font-size: 0.4rem;
	}

	.qr-note {
		width: 100%;
		margin: 0;
		color: var(--muted-ink);
		font-size: 0.43rem;
		text-align: center;
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

		.qr-placeholder {
			width: min(100%, 7.5rem);
			margin: 0 0 0.7rem;
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
			box-shadow: none;
		}
	}
</style>
