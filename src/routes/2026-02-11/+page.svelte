<script>
	import { browser } from '$app/environment';

	if (browser) {
		document.title = 'Lunar New Year Menu';
	}
</script>

<svelte:head>
	<title>Lunar New Year Menu</title>
</svelte:head>

<style>
	:global(body) {
		font-family: 'Georgia', 'Garamond', serif;
		background: linear-gradient(135deg, #f5f1e8 0%, #faf7f2 100%);
		color: #3d3d3d;
		line-height: 1.8;
		margin: 0;
		padding: 0;
	}

	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 60px 40px;
		background-color: rgba(255, 255, 255, 0.95);
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
		border: 2px solid #d4c5b0;
	}

	.header {
		text-align: center;
		margin-bottom: 60px;
		border-bottom: 2px dashed #d4c5b0;
		padding-bottom: 30px;
	}

	.date {
		font-size: 14px;
		letter-spacing: 2px;
		color: #8b7355;
		margin-bottom: 15px;
		text-transform: uppercase;
	}

	.title {
		font-size: 48px;
		color: #6b5344;
		font-weight: normal;
		letter-spacing: 3px;
		margin-bottom: 10px;
		font-variant: small-caps;
	}

	.subtitle {
		font-size: 16px;
		color: #a89080;
		letter-spacing: 1px;
		font-style: italic;
	}

	.section {
		margin-bottom: 50px;
	}

	.section-title {
		font-size: 28px;
		color: #8b6f47;
		text-align: center;
		margin-bottom: 40px;
		position: relative;
		padding: 20px 0;
		letter-spacing: 2px;
	}

	.section-title::before,
	.section-title::after {
		content: "✦";
		color: #d4af37;
		margin: 0 20px;
	}

	.menu-item {
		margin-bottom: 35px;
		padding-bottom: 25px;
		border-bottom: 1px dotted #e0d5c7;
	}

	.menu-item:last-child {
		border-bottom: none;
	}

	.dish-name {
		font-size: 20px;
		color: #6b5344;
		font-weight: 600;
		margin-bottom: 8px;
		letter-spacing: 1px;
	}

	.dish-description {
		font-size: 14px;
		color: #5a5a5a;
		margin-bottom: 8px;
		line-height: 1.7;
		font-style: italic;
	}

	.ingredients {
		font-size: 13px;
		color: #7a7a7a;
		margin-left: 20px;
		line-height: 1.6;
	}

	.ingredient-label {
		font-weight: 600;
		color: #8b7355;
		display: inline-block;
		min-width: 80px;
	}

	.sauce-list {
		margin-left: 20px;
		margin-top: 12px;
		font-size: 13px;
		color: #7a7a7a;
	}

	.sauce-item {
		margin-bottom: 12px;
		padding-left: 15px;
		position: relative;
	}

	.sauce-item::before {
		content: "•";
		position: absolute;
		left: 0;
		color: #d4af37;
	}

	.sauce-name {
		font-weight: 600;
		color: #8b7355;
	}

	.sauce-ingredients {
		font-size: 12px;
		color: #888;
		margin-top: 5px;
		margin-left: 10px;
		font-style: italic;
	}

	.footer {
		text-align: center;
		margin-top: 60px;
		padding-top: 30px;
		border-top: 2px dashed #d4c5b0;
		font-size: 13px;
		color: #a89080;
		letter-spacing: 1px;
	}

	@media print {
		:global(body) {
			background: white;
		}
		.container {
			box-shadow: none;
			border: 1px solid #ddd;
			max-width: 100%;
		}
	}
</style>

<div class="container">
	<div class="header">
		<div class="date">February 11, 2026</div>
		<div class="title">A Horse of a Different Flavor</div>
		<div class="subtitle">Galloping into the Year of the Horse</div>
	</div>

	<!-- APPETIZERS -->
	<div class="section">
		<div class="section-title">Appetizers</div>

		<div class="menu-item">
			<div class="dish-name">Cold Beef Tongue Salad</div>
			<div class="dish-description">
				Delicate slices of tender beef tongue tossed in a vibrant negishio dressing with bright notes of citrus
			</div>
			<div class="ingredients">
				<div class="ingredient-label">Prepared with:</div> Negishio sauce and fresh lemon juice
			</div>
		</div>

		<div class="menu-item">
			<div class="dish-name">Gyoza</div>
			<div class="dish-description">
				Hand-crafted pork and cabbage dumplings infused with the warmth of ginger and garlic, perfectly pan-fried to a golden finish
			</div>
			<div class="ingredients">
				<div class="ingredient-label">Dipping sauce:</div> Must be carefully prepared by each guest at table
			</div>
		</div>
	</div>

	<!-- MAIN COURSES -->
	<div class="section">
		<div class="section-title">Main Courses</div>

		<div class="menu-item">
			<div class="dish-name">Service One — Mala Tofu Udon</div>
			<div class="dish-description">
				Silken tofu luxuriously coated in a velvety creamy sauce with stir-fried minced pork, perfumed with the signature numbing heat of Chinese peppercorn, finished over tender udon noodles
			</div>
			<div class="ingredients">
				<div class="ingredient-label">Signature spice:</div> Mala peppercorn blend
			</div>
		</div>

		<div class="menu-item">
			<div class="dish-name">Service Two — Toro Tan (Fatty Beef Tongue)</div>
			<div class="dish-description">
				The finest cut of beef tongue, expertly seared to develop a delicate crust while preserving the tender, buttery center. A premium delicacy meant to be savored with our curated sauce selection. Served with optional rice — must request in advance
			</div>

			<div class="sauce-list">
				<div class="sauce-item">
					<span class="sauce-name">Negishio Sauce</span>
					<div class="sauce-ingredients">Chinese leek, toasted sesame oil, lemon, honey, garlic, yellow miso, and soy</div>
				</div>
				<div class="sauce-item">
					<span class="sauce-name">Coarse Sea Salt</span>
					<div class="sauce-ingredients">Premium finishing salt</div>
				</div>
				<div class="sauce-item">
					<span class="sauce-name">Wasabi Paste</span>
					<div class="sauce-ingredients">Sharp, clean heat to complement the rich beef</div>
				</div>
			</div>
		</div>

		<div class="menu-item">
			<div class="dish-name">Complement — Seasonal Chinese Vegetables</div>
			<div class="dish-description">
				Lightly boiled fresh seasonal vegetables, carefully sourced from Kim Phat at the finest sale price of the day. Selected to provide essential vitamins and minerals that balance and elevate the rich mains
			</div>
		</div>
	</div>

	<!-- DESSERT -->
	<div class="section">
		<div class="section-title">Dessert</div>

		<div class="menu-item">
			<div class="dish-name">Layered Creamsicle Terrine</div>
			<div class="dish-description">
				A delicate tri-color composition featuring premium Uji matcha from Kyoto, velvety Hokkaido milk, and the subtle earthiness of Azuki red bean. Each layer represents a distinct flavor note in perfect harmony
			</div>
		</div>
	</div>

	<div class="footer">
		✦ Crafted with intention and care ✦
	</div>
</div>
