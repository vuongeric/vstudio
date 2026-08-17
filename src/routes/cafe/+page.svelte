<script>
	const drinks = [
		{
			number: '01',
			name: 'Hand Drip',
			japanese: 'ハンドドリップ',
			description: 'Ethiopian beans · brewed to order',
			notes: 'LIGHT - FLORAL - CLARITY - STONEFRUIT - SWEET',
			option: 'CLASSIC / FLASH BREW'
		},
		{
			number: '02',
			name: 'Matcha Latte',
			japanese: '抹茶ラテ',
			description: 'Ceremonial matcha · milk or oat · syrup',
			notes: 'ICED',
			extra: 'Ice cream topping available'
		},
		{
			number: '03',
			name: 'SAN "G"',
			japanese: 'グァバ・ぶどう・ジャスミン',
			description: 'Guava · green grape · jasmine tea',
			notes: 'Slush'
		},
		{
			number: '04',
			name: 'Espresso',
			japanese: 'エスプレッソ',
			description: 'Latte · Americano',
			notes: '',
			option: 'HOT / ICED'
		}
	];
</script>

<svelte:head>
	<title>VUONG CAFE — Menu</title>
	<meta name="description" content="A quiet, Japandi-inspired menu for VUONG CAFE." />
</svelte:head>

<main class="cafe-shell">
	<article class="menu-sheet" aria-labelledby="menu-title">
		<header class="menu-header">
			<div class="house-mark" aria-hidden="true"><span>V</span></div>
			<div class="title-block">
				<p class="kicker">VUONG CAFE · 小さな喫茶</p>
				<h1 id="menu-title">Menu</h1>
				<p class="subtitle">メニューは変更になる場合があります</p>
			</div>
			<p class="season">Summer<span>2026</span></p>
		</header>

		<div class="rule"></div>

		<section class="menu-grid" aria-label="Drink menu">
			{#each drinks as drink}
				<article class="menu-item">
					<p class="item-number">{drink.number}</p>
					<div class="item-heading">
						<div>
							<h2>{drink.name}</h2>
							<p class="japanese">{drink.japanese}</p>
						</div>
					</div>
					<div class="item-details">
						<p>{drink.description}</p>
						{#if drink.notes}<p>{drink.notes}</p>{/if}
						{#if drink.option}<p class="item-option">{drink.option}</p>{/if}
					</div>
					{#if drink.extra}<p class="extra">{drink.extra}</p>{/if}
				</article>
			{/each}
		</section>

		<section class="bakery-section" aria-labelledby="bakery-title">
			<div class="section-label">
				<p>Bakery</p>
				<p id="bakery-title">焼きもの</p>
			</div>
			<article class="bakery-item">
				<p class="item-number">05</p>
				<div class="item-heading">
					<div>
						<h2>Salted Bread</h2>
						<p class="japanese">塩パン</p>
					</div>
				</div>
				<div class="item-details bakery-details">
					<p>Cultured butter · sea salt</p>
					<p>Baked in small batches</p>
				</div>
			</article>
		</section>

		<footer class="menu-footer">
			<div class="footer-note">
				<p>Prepared with care, one cup at a time.</p>
				<p>日本語で書くなら、なんで翻訳っぽい日本語なの？</p>
			</div>
			<div class="wordmark">
				<strong>VUONG CAFE</strong>
				<span>WITH CARE</span>
			</div>
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

	.cafe-shell,
	.cafe-shell * {
		box-sizing: border-box;
	}

	.cafe-shell {
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
		line-height: normal;
	}

	.menu-sheet {
		position: relative;
		width: min(100%, 900px);
		min-height: min(1180px, calc(100vh - 3rem));
		overflow: hidden;
		padding: clamp(2.25rem, 7vw, 6rem) clamp(1.5rem, 7vw, 5.75rem) clamp(1.75rem, 5vw, 4rem);
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
		pointer-events: none;
		border: 1px solid rgba(255, 255, 255, 0.3);
		box-shadow: inset 0 0 70px rgba(84, 75, 59, 0.08);
	}

	.menu-header {
		display: grid;
		grid-template-columns: 5rem 1fr 5rem;
		align-items: start;
		min-height: 12.5rem;
	}

	.house-mark {
		width: 2.6rem;
		height: 2.6rem;
		display: grid;
		place-items: center;
		border: 1px solid var(--ink);
		border-radius: 50%;
		font-family: var(--serif);
		font-size: 1.05rem;
	}

	.house-mark span {
		transform: translateY(-0.04em);
	}

	.title-block {
		text-align: center;
	}

	.kicker,
	.season,
	.item-number,
	.japanese,
	.item-details,
	.extra,
	.footer-note,
	.wordmark span {
		text-transform: uppercase;
		letter-spacing: 0.16em;
	}

	.kicker {
		margin: 0 0 1.25rem;
		font-size: 0.59rem;
		font-weight: 600;
	}

	h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(3.2rem, 9vw, 6.75rem);
		font-weight: 400;
		letter-spacing: -0.055em;
		line-height: 0.75;
		text-transform: uppercase;
	}

	.subtitle {
		margin: 1.4rem 0 0;
		font-family: var(--serif);
		font-size: 0.76rem;
		letter-spacing: 0.16em;
		transform: translateX(0.08em);
	}

	.season {
		justify-self: end;
		margin: 0.65rem 0 0;
		font-size: 0.55rem;
		line-height: 1.6;
		text-align: right;
	}

	.season span {
		display: block;
		color: var(--muted-ink);
	}

	.rule {
		height: 1px;
		background: var(--rule);
	}

	.menu-grid,
	.bakery-section {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.menu-item {
		position: relative;
		min-height: 18.25rem;
		padding: 2.55rem 2.75rem 2.35rem 0;
		border-bottom: 1px solid var(--rule);
	}

	.menu-item:nth-child(even) {
		padding-right: 0;
		padding-left: 2.75rem;
		border-left: 1px solid var(--rule);
	}

	.item-number {
		margin: 0;
		color: var(--muted-ink);
		font-family: var(--sans);
		font-size: 0.49rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		line-height: 1.6;
		text-transform: uppercase;
	}

	.item-number {
		margin-bottom: 2.2rem;
		font-size: 0.56rem;
	}

	.item-heading {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 1rem;
		align-items: start;
	}

	h2 {
		max-width: 13ch;
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(1.35rem, 3vw, 2rem);
		font-weight: 400;
		letter-spacing: -0.025em;
		line-height: 1.03;
		text-transform: uppercase;
	}

	.japanese {
		margin: 0.7rem 0 0;
		color: var(--muted-ink);
		font-size: 0.5rem;
		line-height: 1.6;
	}

	.item-details {
		margin-top: 2.05rem;
		color: var(--muted-ink);
		font-size: 0.54rem;
		line-height: 1.75;
	}

	.item-details p,
	.footer-note p {
		margin: 0;
	}

	.item-details .item-option {
		margin-top: 0.65rem;
		color: var(--ink);
		font-weight: 600;
	}

	.extra {
		display: inline-block;
		margin: 1.35rem 0 0;
		padding: 0.45rem 0.65rem;
		border: 1px solid var(--rule);
		border-radius: 999px;
		font-size: 0.48rem;
	}

	.bakery-section {
		border-bottom: 1px solid var(--rule);
	}

	.section-label {
		padding: 2.55rem 2.75rem 2.35rem 0;
	}

	.section-label p {
		margin: 0;
		font-family: var(--serif);
		font-size: 1rem;
		letter-spacing: 0.08em;
		line-height: 1.4;
		text-transform: uppercase;
	}

	.section-label p:last-child {
		margin-top: 0.35rem;
		color: var(--muted-ink);
		font-family: var(--sans);
		font-size: 0.48rem;
		letter-spacing: 0.22em;
	}

	.bakery-item {
		padding: 2.55rem 0 2.35rem 2.75rem;
		border-left: 1px solid var(--rule);
	}

	.bakery-item .item-number {
		margin-bottom: 1.25rem;
	}

	.bakery-details {
		margin-top: 1.3rem;
	}

	.menu-footer {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 2rem;
		align-items: end;
		padding-top: 2.35rem;
	}

	.footer-note {
		color: var(--muted-ink);
		font-size: 0.48rem;
		line-height: 1.8;
	}

	.wordmark {
		text-align: right;
	}

	.wordmark strong {
		display: block;
		font-family: var(--serif);
		font-size: 1.1rem;
		font-weight: 600;
		letter-spacing: 0.22em;
	}

	.wordmark span {
		display: block;
		margin-top: 0.25rem;
		color: var(--muted-ink);
		font-size: 0.46rem;
	}

	@media (max-width: 680px) {
		.cafe-shell {
			display: block;
			padding: 0;
		}

		.menu-sheet {
			min-height: 100vh;
			padding: 2.25rem 1.4rem 1.75rem;
			box-shadow: none;
		}

		.menu-header {
			grid-template-columns: 3.5rem 1fr 3.5rem;
			min-height: 10rem;
		}

		.house-mark {
			width: 2.15rem;
			height: 2.15rem;
			font-size: 0.85rem;
		}

		.kicker {
			margin-top: 0.25rem;
			margin-bottom: 1.1rem;
			font-size: 0.48rem;
		}

		.season {
			font-size: 0.46rem;
		}

		.menu-item,
		.menu-item:nth-child(even) {
			min-height: 16.5rem;
			padding: 2rem 1.25rem 1.8rem 0;
		}

		.menu-item:nth-child(even) {
			padding-right: 0;
			padding-left: 1.25rem;
		}

		.item-number {
			margin-bottom: 1.65rem;
		}

		.item-heading {
			grid-template-columns: 1fr;
			gap: 0.7rem;
		}

		.item-details {
			margin-top: 1.4rem;
			font-size: 0.48rem;
		}

		.extra {
			margin-top: 0.9rem;
			font-size: 0.42rem;
		}

		.section-label {
			padding: 2rem 1.25rem 1.8rem 0;
		}

		.section-label p {
			font-size: 0.8rem;
		}

		.bakery-item {
			padding: 2rem 0 1.8rem 1.25rem;
		}
	}

	@media (max-width: 440px) {
		.menu-grid,
		.bakery-section {
			grid-template-columns: 1fr;
		}

		.menu-item,
		.menu-item:nth-child(even) {
			min-height: auto;
			padding: 2rem 0;
			border-left: 0;
		}

		.menu-footer {
			grid-template-columns: 1fr;
			gap: 1.25rem;
		}

		.section-label {
			padding: 1.5rem 0 0;
		}

		.bakery-item {
			padding: 1.35rem 0 2rem;
			border-left: 0;
		}

		.wordmark {
			text-align: left;
		}
	}

	@media print {
		:global(body) {
			background: white;
		}

		.cafe-shell {
			display: block;
			padding: 0;
		}

		.menu-sheet {
			width: 210mm;
			min-height: 297mm;
			box-shadow: none;
		}
	}
</style>
