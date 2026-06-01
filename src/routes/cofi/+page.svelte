<script lang="ts">
	interface FinancialInputs {
		currentAge: number;
		retirementAge: number;
		currentSavings: number;
		monthlyContribution: number;
		annualReturn: number;
		inflationRate: number;
		annualExpenses: number;
		safeWithdrawalRate: number;
	}

	interface Phase {
		name: string;
		ageStart: number;
		ageEnd: number;
		annualContribution: number;
	}

	interface PhaseConfig {
		enabled: boolean;
		phases: Phase[];
	}

	interface DataPoint {
		age: number;
		netWorth: number;
		retirementNumber: number;
		coastFireNumber: number | null;
		isCoastFire: boolean;
		isFinancialIndependence: boolean;
		phaseNetWorth?: number | null;
	}

	const defaultInputs: FinancialInputs = {
		currentAge: 30,
		retirementAge: 65,
		currentSavings: 100000,
		monthlyContribution: 2000,
		annualReturn: 7,
		inflationRate: 3,
		annualExpenses: 40000,
		safeWithdrawalRate: 4
	};

	const defaultPhaseConfig: PhaseConfig = {
		enabled: false,
		phases: [
			{ name: 'Aggressive', ageStart: 20, ageEnd: 30, annualContribution: 96000 },
			{ name: 'Balanced', ageStart: 30, ageEnd: 32, annualContribution: 20000 },
			{ name: 'Freedom & Family', ageStart: 32, ageEnd: 36, annualContribution: 10000 },
			{ name: 'Coast FIRE', ageStart: 36, ageEnd: 39, annualContribution: 5000 },
			{ name: 'Barista FIRE', ageStart: 39, ageEnd: 42, annualContribution: 0 },
			{ name: 'Retirement', ageStart: 42, ageEnd: 100, annualContribution: 0 }
		]
	};

	let inputs = $state<FinancialInputs>({ ...defaultInputs });
	let phaseConfig = $state<PhaseConfig>({
		enabled: defaultPhaseConfig.enabled,
		phases: defaultPhaseConfig.phases.map((phase) => ({ ...phase }))
	});
	let showingPhaseEditor = $state(false);
	let hoveredIndex = $state<number | null>(null);
	let isChartFullscreen = $state(false);
	let isScrubbingChart = $state(false);
	let chartSvg = $state<SVGSVGElement | null>(null);

	const chartWidth = 920;
	const chartHeight = 420;
	const pad = { top: 28, right: 34, bottom: 42, left: 92 };
	const plotWidth = chartWidth - pad.left - pad.right;
	const plotHeight = chartHeight - pad.top - pad.bottom;

	function calculateProjection(currentInputs: FinancialInputs): DataPoint[] {
		const {
			currentAge,
			retirementAge,
			currentSavings,
			monthlyContribution,
			annualReturn,
			inflationRate,
			annualExpenses,
			safeWithdrawalRate
		} = currentInputs;

		const data: DataPoint[] = [];
		const years = Math.max(0, retirementAge - currentAge);
		const monthlyRate = annualReturn / 100 / 12;
		const retirementNumberAtRetirement = annualExpenses / (safeWithdrawalRate / 100);

		for (let year = 0; year <= years; year++) {
			const age = currentAge + year;
			const yearsToRetirement = retirementAge - age;
			const monthsElapsed = year * 12;
			const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + annualReturn / 100, year);
			let futureValueOfContributions = 0;

			if (year > 0) {
				if (monthlyRate === 0) {
					futureValueOfContributions = monthlyContribution * monthsElapsed;
				} else {
					futureValueOfContributions =
						monthlyContribution *
						((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate) *
						(1 + monthlyRate);
				}
			}

			const netWorth = futureValueOfCurrentSavings + futureValueOfContributions;
			const inflationFactor = Math.pow(1 + inflationRate / 100, year);
			const retirementNumberAtAge = retirementNumberAtRetirement * inflationFactor;
			const coastFireNumber =
				yearsToRetirement > 0
					? (retirementNumberAtRetirement * inflationFactor) /
						Math.pow(1 + annualReturn / 100, yearsToRetirement)
					: retirementNumberAtAge;

			data.push({
				age,
				netWorth,
				retirementNumber: retirementNumberAtAge,
				coastFireNumber: yearsToRetirement > 0 ? coastFireNumber : null,
				isCoastFire: netWorth >= coastFireNumber && yearsToRetirement > 0,
				isFinancialIndependence: netWorth >= retirementNumberAtAge
			});
		}

		return data;
	}

	function calculateProjectionWithPhases(
		currentInputs: FinancialInputs,
		currentPhaseConfig: PhaseConfig
	): DataPoint[] {
		const {
			currentAge,
			retirementAge,
			currentSavings,
			annualReturn,
			inflationRate,
			annualExpenses,
			safeWithdrawalRate
		} = currentInputs;

		const data: DataPoint[] = [];
		const years = Math.max(0, retirementAge - currentAge);
		const retirementNumberAtRetirement = annualExpenses / (safeWithdrawalRate / 100);
		let currentNetWorth = currentSavings;

		for (let year = 0; year <= years; year++) {
			const age = currentAge + year;
			const yearsToRetirement = retirementAge - age;
			const currentPhase = currentPhaseConfig.phases.find(
				(phase) => age >= phase.ageStart && age < phase.ageEnd
			);

			if (year > 0) {
				currentNetWorth *= 1 + annualReturn / 100;
				if (currentPhase) currentNetWorth += currentPhase.annualContribution;
			}

			const inflationFactor = Math.pow(1 + inflationRate / 100, year);
			const retirementNumberAtAge = retirementNumberAtRetirement * inflationFactor;
			const coastFireNumber =
				yearsToRetirement > 0
					? (retirementNumberAtRetirement * inflationFactor) /
						Math.pow(1 + annualReturn / 100, yearsToRetirement)
					: retirementNumberAtAge;

			data.push({
				age,
				netWorth: 0,
				retirementNumber: retirementNumberAtAge,
				coastFireNumber: yearsToRetirement > 0 ? coastFireNumber : null,
				isCoastFire: currentNetWorth >= coastFireNumber && yearsToRetirement > 0,
				isFinancialIndependence: currentNetWorth >= retirementNumberAtAge,
				phaseNetWorth: currentNetWorth
			});
		}

		return data;
	}

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(value);
	}

	function formatCompactCurrency(value: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			notation: 'compact',
			maximumFractionDigits: 1
		}).format(value);
	}

	function firstAge(
		data: DataPoint[],
		valueSelector: (point: DataPoint) => number | null | undefined,
		targetSelector: (point: DataPoint) => number | null | undefined
	): number | null {
		const point = data.find((item) => {
			const value = valueSelector(item);
			const target = targetSelector(item);
			return value != null && target != null && value >= target;
		});

		return point?.age ?? null;
	}

	function pathFor(
		data: DataPoint[],
		valueSelector: (point: DataPoint) => number | null | undefined,
		yMax: number
	): string {
		return data
			.map((point, index) => {
				const value = valueSelector(point);
				if (value == null) return '';
				const x = pad.left + (data.length <= 1 ? 0 : (index / (data.length - 1)) * plotWidth);
				const y = pad.top + plotHeight - (Math.min(value, yMax) / yMax) * plotHeight;
				return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
			})
			.filter(Boolean)
			.join(' ');
	}

	function areaFor(
		data: DataPoint[],
		valueSelector: (point: DataPoint) => number | null | undefined,
		yMax: number
	): string {
		const path = pathFor(data, valueSelector, yMax);
		if (!path || data.length === 0) return '';

		const firstX = xFor(0, data.length);
		const lastX = xFor(data.length - 1, data.length);
		const baseY = pad.top + plotHeight;
		return `${path} L ${lastX.toFixed(2)} ${baseY.toFixed(2)} L ${firstX.toFixed(2)} ${baseY.toFixed(2)} Z`;
	}

	function yFor(value: number, yMax: number): number {
		return pad.top + plotHeight - (Math.min(value, yMax) / yMax) * plotHeight;
	}

	function xFor(index: number, total: number): number {
		return pad.left + (total <= 1 ? 0 : (index / (total - 1)) * plotWidth);
	}

	function indexForPointer(event: PointerEvent): number {
		if (!chartSvg || projectionData.length <= 1) return 0;

		const bounds = chartSvg.getBoundingClientRect();
		const chartX = ((event.clientX - bounds.left) / bounds.width) * chartWidth;
		const ratio = (chartX - pad.left) / plotWidth;
		const index = Math.round(ratio * (projectionData.length - 1));
		return Math.max(0, Math.min(projectionData.length - 1, index));
	}

	function scrubChart(event: PointerEvent): void {
		event.preventDefault();
		hoveredIndex = indexForPointer(event);
	}

	function startChartScrub(event: PointerEvent): void {
		isScrubbingChart = true;
		(event.currentTarget as SVGRectElement).setPointerCapture(event.pointerId);
		scrubChart(event);
	}

	function moveChartScrub(event: PointerEvent): void {
		if (event.pointerType === 'mouse' || isScrubbingChart) scrubChart(event);
	}

	function endChartScrub(event: PointerEvent): void {
		const scrubber = event.currentTarget as SVGRectElement;
		isScrubbingChart = false;
		if (scrubber.hasPointerCapture(event.pointerId))
			scrubber.releasePointerCapture(event.pointerId);
	}

	function leaveChartScrub(event: PointerEvent): void {
		if (event.pointerType === 'mouse' && !isChartFullscreen) hoveredIndex = null;
	}

	function stepHoveredIndex(direction: -1 | 1): void {
		const currentIndex = hoveredIndex ?? 0;
		hoveredIndex = Math.max(0, Math.min(projectionData.length - 1, currentIndex + direction));
	}

	function handleWindowKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape' && isChartFullscreen) {
			isChartFullscreen = false;
		}
	}

	function handleScrubKeydown(event: KeyboardEvent): void {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			stepHoveredIndex(-1);
		}
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			stepHoveredIndex(1);
		}
		if (event.key === 'Escape' && isChartFullscreen) {
			event.preventDefault();
			isChartFullscreen = false;
		}
	}

	let standardData = $derived(calculateProjection(inputs));
	let phaseData = $derived(
		phaseConfig.enabled ? calculateProjectionWithPhases(inputs, phaseConfig) : []
	);
	let projectionData = $derived(
		standardData.map((point, index) => ({
			...point,
			phaseNetWorth: phaseData[index]?.phaseNetWorth ?? null
		}))
	);
	let finalPoint = $derived(projectionData[projectionData.length - 1]);
	let coastAge = $derived(
		firstAge(
			projectionData,
			(point) => point.netWorth,
			(point) => point.coastFireNumber
		)
	);
	let fireAge = $derived(
		firstAge(
			projectionData,
			(point) => point.netWorth,
			(point) => point.retirementNumber
		)
	);
	let phaseCoastAge = $derived(
		phaseConfig.enabled
			? firstAge(
					projectionData,
					(point) => point.phaseNetWorth,
					(point) => point.coastFireNumber
				)
			: null
	);
	let yMax = $derived(
		Math.max(
			1,
			...projectionData.flatMap((point) => [
				point.netWorth,
				point.retirementNumber,
				point.coastFireNumber ?? 0,
				point.phaseNetWorth ?? 0
			])
		) * 1.08
	);
	let yTicks = $derived(Array.from({ length: 5 }, (_, index) => (yMax / 4) * index));
	let xTicks = $derived(
		projectionData.filter((_, index) => {
			const interval = Math.max(1, Math.floor((projectionData.length - 1) / 5));
			return index === 0 || index === projectionData.length - 1 || index % interval === 0;
		})
	);
	let hoveredPoint = $derived(hoveredIndex == null ? null : projectionData[hoveredIndex]);
	let tooltipX = $derived(
		hoveredIndex == null
			? 0
			: Math.min(xFor(hoveredIndex, projectionData.length) + 16, chartWidth - pad.right - 208)
	);
	let tooltipY = $derived(
		hoveredPoint == null
			? 0
			: Math.max(
					pad.top + 10,
					Math.min(
						yFor(
							Math.max(
								hoveredPoint.netWorth,
								hoveredPoint.retirementNumber,
								hoveredPoint.coastFireNumber ?? 0,
								hoveredPoint.phaseNetWorth ?? 0
							),
							yMax
						) - 20,
						chartHeight - pad.bottom - (phaseConfig.enabled ? 138 : 116)
					)
				)
	);
</script>

<svelte:head>
	<title>cofi</title>
</svelte:head>

<svelte:window onkeydown={handleWindowKeydown} />

<div class="cofi-page">
	<header class="intro">
		<p class="eyebrow">cofi</p>
	</header>

	<section class="summary" aria-label="Projection summary">
		<div>
			<span>Coast FI age</span>
			<strong>{coastAge ?? 'not reached'}</strong>
		</div>
		<div>
			<span>Full FI age</span>
			<strong>{fireAge ?? 'not reached'}</strong>
		</div>
		<div>
			<span>Retirement target</span>
			<strong>{formatCurrency(finalPoint?.retirementNumber ?? 0)}</strong>
		</div>
		<div>
			<span>Projected net worth</span>
			<strong>{formatCurrency(finalPoint?.netWorth ?? 0)}</strong>
		</div>
	</section>

	<section class="tool-grid">
		<div class="control-card" class:flipped={showingPhaseEditor}>
			<div class="control-card-inner">
				<form class="panel inputs card-face card-front" aria-label="Financial inputs">
					<div class="panel-heading">
						<h2>Inputs</h2>
						<div class="button-row">
							<button type="button" onclick={() => (inputs = { ...defaultInputs })}>Reset</button>
							<button type="button" onclick={() => (showingPhaseEditor = true)}>Phases</button>
						</div>
					</div>

					<label>
						<span>Current age</span>
						<input type="number" bind:value={inputs.currentAge} min="0" />
					</label>

					<label>
						<span>Retirement age</span>
						<input
							class:invalid={inputs.retirementAge < inputs.currentAge}
							type="number"
							bind:value={inputs.retirementAge}
							aria-invalid={inputs.retirementAge < inputs.currentAge}
						/>
					</label>

					<label>
						<span>Current savings</span>
						<input type="number" bind:value={inputs.currentSavings} min="0" step="1000" />
						<input
							type="range"
							bind:value={inputs.currentSavings}
							min="0"
							max="2000000"
							step="1000"
						/>
					</label>

					<label>
						<span>Monthly contribution</span>
						<input type="number" bind:value={inputs.monthlyContribution} min="0" step="100" />
						<input
							type="range"
							bind:value={inputs.monthlyContribution}
							min="0"
							max="20000"
							step="100"
						/>
					</label>

					<label class="range">
						<span>Annual return <strong>{inputs.annualReturn.toFixed(1)}%</strong></span>
						<input type="range" bind:value={inputs.annualReturn} min="0" max="15" step="0.1" />
					</label>

					<label class="range">
						<span>Inflation <strong>{inputs.inflationRate.toFixed(1)}%</strong></span>
						<input type="range" bind:value={inputs.inflationRate} min="0" max="10" step="0.1" />
					</label>

					<label>
						<span>Annual retirement expenses</span>
						<input type="number" bind:value={inputs.annualExpenses} min="0" step="1000" />
						<input
							type="range"
							bind:value={inputs.annualExpenses}
							min="0"
							max="250000"
							step="1000"
						/>
					</label>

					<label class="range">
						<span>Withdrawal rate <strong>{inputs.safeWithdrawalRate.toFixed(1)}%</strong></span>
						<input
							type="range"
							bind:value={inputs.safeWithdrawalRate}
							min="1"
							max="10"
							step="0.1"
						/>
					</label>
				</form>

				<section class="panel phases card-face card-back" aria-label="6-phase inputs">
					<div class="phase-header">
						<div>
							<h2>6-phase approach</h2>
							<label class="toggle">
								<input type="checkbox" bind:checked={phaseConfig.enabled} />
								<span>{phaseConfig.enabled ? 'Enabled' : 'Disabled'}</span>
							</label>
						</div>
						<button type="button" onclick={() => (showingPhaseEditor = false)}>Inputs</button>
					</div>

					<div class="phase-list compact">
						{#each phaseConfig.phases as phase}
							<div class="phase-row">
								<label class="phase-name">
									<span>Name</span>
									<input bind:value={phase.name} />
								</label>
								<label>
									<span>Start</span>
									<input type="number" bind:value={phase.ageStart} />
								</label>
								<label>
									<span>End</span>
									<input type="number" bind:value={phase.ageEnd} />
								</label>
								<label class="phase-contribution">
									<span
										>Contribution <strong>{formatCurrency(phase.annualContribution)}</strong></span
									>
									<input type="number" bind:value={phase.annualContribution} step="1000" />
									<input
										type="range"
										bind:value={phase.annualContribution}
										min="0"
										max="150000"
										step="1000"
									/>
								</label>
							</div>
						{/each}
					</div>
				</section>
			</div>
		</div>

		<section
			class="panel chart-panel"
			class:fullscreen={isChartFullscreen}
			aria-label="Financial projection chart"
		>
			<div class="panel-heading">
				<h2>Projection</h2>
				<div class="chart-actions">
					<div class="legend" aria-label="Chart legend">
						<span><i class="net"></i>Net worth</span>
						<span><i class="coast"></i>Coast FI</span>
						<span><i class="retire"></i>Retirement target</span>
						{#if phaseConfig.enabled}
							<span><i class="phase"></i>6-phase</span>
						{/if}
					</div>
					<button
						class="fullscreen-toggle"
						type="button"
						aria-label={isChartFullscreen ? 'Exit fullscreen chart' : 'Open fullscreen chart'}
						aria-pressed={isChartFullscreen}
						onclick={() => {
							isChartFullscreen = !isChartFullscreen;
							hoveredIndex ??= Math.max(0, projectionData.length - 1);
						}}
					>
						{isChartFullscreen ? 'Close' : 'Fullscreen'}
					</button>
				</div>
			</div>

			<div class="chart-wrap">
				<svg
					bind:this={chartSvg}
					viewBox={`0 0 ${chartWidth} ${chartHeight}`}
					role="img"
					aria-label="Projection line chart"
				>
					<defs>
						<linearGradient id="net-worth-fill" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0%" stop-color="#d69b2d" stop-opacity="0.42" />
							<stop offset="72%" stop-color="#f6d28a" stop-opacity="0.18" />
							<stop offset="100%" stop-color="#fffaf1" stop-opacity="0" />
						</linearGradient>
					</defs>
					<rect class="chart-bg" x={pad.left} y={pad.top} width={plotWidth} height={plotHeight} />
					{#each yTicks as tick}
						<line
							class="grid-line"
							x1={pad.left}
							x2={pad.left + plotWidth}
							y1={yFor(tick, yMax)}
							y2={yFor(tick, yMax)}
						/>
						<text class="axis-label y-label" x={pad.left - 12} y={yFor(tick, yMax) + 4}>
							{formatCompactCurrency(tick)}
						</text>
					{/each}
					{#each xTicks as tick}
						{@const index = projectionData.findIndex((point) => point.age === tick.age)}
						<text
							class="axis-label"
							x={xFor(index, projectionData.length)}
							y={chartHeight - 13}
							text-anchor="middle"
						>
							{tick.age}
						</text>
					{/each}
					<path
						class="line retirement"
						d={pathFor(projectionData, (point) => point.retirementNumber, yMax)}
					/>
					<path
						class="line coast"
						d={pathFor(projectionData, (point) => point.coastFireNumber, yMax)}
					/>
					<path
						class="area net-area"
						d={areaFor(projectionData, (point) => point.netWorth, yMax)}
					/>
					<path class="line net" d={pathFor(projectionData, (point) => point.netWorth, yMax)} />
					{#if phaseConfig.enabled}
						<path
							class="line phase"
							d={pathFor(projectionData, (point) => point.phaseNetWorth, yMax)}
						/>
					{/if}

					{#if hoveredPoint != null && hoveredIndex != null}
						{@const hoverX = xFor(hoveredIndex, projectionData.length)}
						{@const netY = yFor(hoveredPoint.netWorth, yMax)}
						{@const retireY = yFor(hoveredPoint.retirementNumber, yMax)}
						{@const coastY =
							hoveredPoint.coastFireNumber == null
								? null
								: yFor(hoveredPoint.coastFireNumber, yMax)}
						{@const phaseY =
							hoveredPoint.phaseNetWorth == null ? null : yFor(hoveredPoint.phaseNetWorth, yMax)}
						{@const markerTop = Math.min(
							netY,
							retireY,
							coastY ?? chartHeight,
							phaseY ?? chartHeight
						)}
						{@const markerBottom = Math.max(netY, retireY, coastY ?? 0, phaseY ?? 0)}
						<g class="hover-inspector" aria-hidden="true">
							<line
								class="hover-crosshair"
								x1={hoverX}
								x2={hoverX}
								y1={pad.top}
								y2={pad.top + plotHeight}
							/>
							<line class="candle-wick" x1={hoverX} x2={hoverX} y1={markerTop} y2={markerBottom} />
							<rect
								class="candle-body"
								x={hoverX - 5}
								y={Math.min(netY, retireY)}
								width="10"
								height={Math.max(8, Math.abs(netY - retireY))}
								rx="2"
							/>
							<circle class="hover-dot net-dot" cx={hoverX} cy={netY} r="5" />
							{#if coastY != null}
								<circle class="hover-dot coast-dot" cx={hoverX} cy={coastY} r="4.5" />
							{/if}
							<circle class="hover-dot retire-dot" cx={hoverX} cy={retireY} r="4.5" />
							{#if phaseConfig.enabled && phaseY != null}
								<circle class="hover-dot phase-dot" cx={hoverX} cy={phaseY} r="5" />
							{/if}
							<g class="chart-tooltip" transform={`translate(${tooltipX}, ${tooltipY})`}>
								<rect width="196" height={phaseConfig.enabled ? 128 : 106} rx="7" />
								<text class="tooltip-title" x="12" y="22">Age {hoveredPoint.age}</text>
								<text x="12" y="44">Net worth</text>
								<text class="tooltip-value" x="184" y="44"
									>{formatCurrency(hoveredPoint.netWorth)}</text
								>
								<text x="12" y="64">Coast FI</text>
								<text class="tooltip-value" x="184" y="64">
									{hoveredPoint.coastFireNumber == null
										? 'Retired'
										: formatCurrency(hoveredPoint.coastFireNumber)}
								</text>
								<text x="12" y="84">Target</text>
								<text class="tooltip-value" x="184" y="84">
									{formatCurrency(hoveredPoint.retirementNumber)}
								</text>
								{#if phaseConfig.enabled}
									<text x="12" y="106">6-phase</text>
									<text class="tooltip-value" x="184" y="106">
										{hoveredPoint.phaseNetWorth == null
											? 'n/a'
											: formatCurrency(hoveredPoint.phaseNetWorth)}
									</text>
								{/if}
							</g>
						</g>
					{/if}

					<rect
						class="scrub-zone"
						x={pad.left}
						y={pad.top}
						width={plotWidth}
						height={plotHeight}
						tabindex="0"
						role="slider"
						aria-label="Projection year scrubber"
						aria-valuemin={projectionData[0]?.age ?? inputs.currentAge}
						aria-valuemax={finalPoint?.age ?? inputs.retirementAge}
						aria-valuenow={hoveredPoint?.age ?? finalPoint?.age ?? inputs.currentAge}
						aria-valuetext={hoveredPoint
							? `Age ${hoveredPoint.age}, predicted net worth ${formatCurrency(hoveredPoint.netWorth)}`
							: 'No year selected'}
						onpointerdown={startChartScrub}
						onpointermove={moveChartScrub}
						onpointerup={endChartScrub}
						onpointercancel={endChartScrub}
						onpointerleave={leaveChartScrub}
						onfocus={() => (hoveredIndex ??= 0)}
						onblur={() => {
							if (!isChartFullscreen) hoveredIndex = null;
						}}
						onkeydown={handleScrubKeydown}
					/>
				</svg>
			</div>

			<div class="chart-notes">
				<p>
					Coast FI means the amount invested today can grow to the retirement target by retirement
					age without more contributions.
				</p>
				{#if phaseConfig.enabled}
					<p>6-phase Coast FI age: <strong>{phaseCoastAge ?? 'not reached'}</strong></p>
				{/if}
			</div>
		</section>
	</section>
</div>

<style>
	:global(main) {
		max-width: 1500px;
	}

	.cofi-page {
		display: flex;
		flex-direction: column;
		gap: 1.35rem;
		margin: -1rem;
		min-height: calc(100vh - 4rem);
		padding: clamp(1.1rem, 3vw, 2rem);
		background:
			linear-gradient(180deg, rgba(255, 248, 234, 0.8), rgba(247, 247, 242, 0.96) 32rem), #f7f7f2;
		color: #242424;
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
	}

	.intro {
		display: grid;
		gap: 0.25rem;
	}

	.eyebrow,
	.summary span,
	label span,
	.legend,
	.chart-notes {
		font-family: inherit;
	}

	.eyebrow {
		color: #7b6a43;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	h2 {
		color: #242424;
		font-size: clamp(1.1rem, 2vw, 1.45rem);
		font-weight: 750;
		line-height: 1.2;
	}

	.summary {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.85rem;
	}

	.summary div {
		display: grid;
		gap: 0.45rem;
		min-width: 0;
		border: 1px solid rgba(36, 36, 36, 0.08);
		border-radius: 16px;
		background: rgba(255, 255, 255, 0.8);
		padding: 1.05rem 1.15rem;
		box-shadow: 0 18px 46px rgba(63, 54, 37, 0.07);
	}

	.summary span {
		color: #77736b;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.summary strong {
		overflow-wrap: anywhere;
		font-size: clamp(1.35rem, 2.2vw, 2rem);
		font-weight: 760;
		line-height: 1.1;
	}

	.tool-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(320px, 380px);
		gap: 1.1rem;
		align-items: start;
	}

	.control-card {
		order: 2;
		min-height: 820px;
		perspective: 1600px;
	}

	.control-card-inner {
		position: relative;
		min-height: 820px;
		transform-style: preserve-3d;
		transition: transform 0.55s ease;
	}

	.control-card.flipped .control-card-inner {
		transform: rotateY(180deg);
	}

	.card-face {
		position: absolute;
		inset: 0;
		overflow: hidden;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	.card-back {
		transform: rotateY(180deg);
	}

	.panel {
		border: 1px solid rgba(36, 36, 36, 0.08);
		border-radius: 18px;
		background: rgba(255, 255, 255, 0.88);
		box-shadow: 0 20px 60px rgba(63, 54, 37, 0.08);
	}

	.inputs,
	.chart-panel,
	.phases {
		height: 100%;
		padding: 1.15rem;
	}

	.chart-panel {
		order: 1;
		min-height: min(620px, calc(100vh - 11rem));
	}

	.panel-heading,
	.phase-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.9rem;
	}

	.chart-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.8rem;
		min-width: 0;
	}

	.button-row {
		display: flex;
		gap: 0.45rem;
	}

	.panel-heading button,
	.phase-header button,
	.fullscreen-toggle {
		border: 1px solid rgba(36, 36, 36, 0.1);
		border-radius: 999px;
		background: #fff;
		color: #242424;
		padding: 0.55rem 0.9rem;
		font: inherit;
		font-size: 0.82rem;
		font-weight: 700;
		cursor: pointer;
		box-shadow: 0 8px 20px rgba(63, 54, 37, 0.06);
		transition:
			transform 0.18s ease,
			background 0.18s ease,
			box-shadow 0.18s ease;
	}

	.panel-heading button:hover,
	.phase-header button:hover,
	.fullscreen-toggle:hover {
		background: #fff8ea;
		box-shadow: 0 12px 26px rgba(63, 54, 37, 0.1);
		transform: translateY(-1px);
	}

	.inputs {
		display: grid;
		gap: 0.85rem;
	}

	label {
		display: grid;
		gap: 0.35rem;
	}

	label span {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #77736b;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	input {
		width: 100%;
		min-width: 0;
		border: 1px solid rgba(36, 36, 36, 0.1);
		border-radius: 12px;
		background: #fff;
		color: #242424;
		padding: 0.65rem 0.7rem;
		font: inherit;
	}

	input:focus {
		border-color: #c78f2a;
		outline: 4px solid rgba(214, 155, 45, 0.15);
	}

	input.invalid {
		border-color: #dc2626;
		box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.14);
	}

	input.invalid:focus {
		border-color: #dc2626;
		outline: 3px solid rgba(220, 38, 38, 0.18);
	}

	input[type='range'] {
		padding: 0;
		accent-color: #d69b2d;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem 0.9rem;
		color: #77736b;
		font-size: 0.76rem;
		font-weight: 650;
		justify-content: flex-end;
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.legend i {
		width: 18px;
		height: 3px;
		border-radius: 999px;
	}

	.legend .net {
		background: #d69b2d;
	}

	.legend .coast {
		background: #2f8f83;
	}

	.legend .retire {
		background: #be5b50;
	}

	.legend .phase {
		background: #6d62b5;
	}

	.chart-wrap {
		overflow: hidden;
		height: clamp(420px, 57vh, 680px);
		border: 0;
		border-radius: 16px;
		background: linear-gradient(180deg, #fffaf1, #fbf7eb);
	}

	.chart-panel {
		transition:
			inset 0.32s ease,
			border-radius 0.32s ease,
			box-shadow 0.32s ease,
			padding 0.32s ease;
	}

	.chart-panel.fullscreen {
		position: fixed;
		inset: max(0.75rem, env(safe-area-inset-top)) max(0.75rem, env(safe-area-inset-right))
			max(0.75rem, env(safe-area-inset-bottom)) max(0.75rem, env(safe-area-inset-left));
		z-index: 20;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		background: #fffaf1;
		box-shadow: 0 24px 80px rgba(15, 23, 42, 0.26);
		animation: chart-expand 0.32s ease both;
	}

	.chart-panel.fullscreen::before {
		position: fixed;
		inset: 0;
		z-index: -1;
		background: rgba(15, 23, 42, 0.34);
		content: '';
	}

	.chart-panel.fullscreen .chart-wrap {
		overflow: hidden;
		min-height: 0;
		height: auto;
	}

	.chart-panel.fullscreen svg {
		min-width: 0;
		height: 100%;
	}

	svg {
		display: block;
		min-width: 0;
		width: 100%;
		height: 100%;
	}

	.chart-bg {
		fill: transparent;
	}

	.grid-line {
		stroke: rgba(36, 36, 36, 0.07);
		stroke-width: 1;
	}

	.axis-label {
		fill: #8c8577;
		font-family: inherit;
		font-size: 12px;
		font-weight: 650;
	}

	.y-label {
		text-anchor: end;
	}

	.line {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 3.2;
	}

	.line.net {
		stroke: #c98e24;
		stroke-width: 4.3;
	}

	.line.retirement {
		stroke: #be5b50;
		stroke-dasharray: 8 8;
	}

	.line.coast {
		stroke: #2f8f83;
		stroke-dasharray: 5 8;
	}

	.line.phase {
		stroke: #6d62b5;
		stroke-width: 5;
	}

	.area {
		pointer-events: none;
	}

	.net-area {
		fill: url('#net-worth-fill');
	}

	.hover-inspector {
		pointer-events: none;
	}

	.hover-crosshair {
		stroke: rgba(36, 36, 36, 0.28);
		stroke-dasharray: 3 7;
		stroke-width: 1.3;
	}

	.candle-wick {
		stroke: rgba(36, 36, 36, 0.62);
		stroke-width: 2.2;
	}

	.candle-body {
		fill: rgba(214, 155, 45, 0.18);
		stroke: rgba(36, 36, 36, 0.72);
		stroke-width: 1.5;
	}

	.hover-dot {
		fill: #fff;
		stroke-width: 3;
	}

	.net-dot {
		stroke: #c98e24;
	}

	.coast-dot {
		stroke: #2f8f83;
	}

	.retire-dot {
		stroke: #be5b50;
	}

	.phase-dot {
		stroke: #6d62b5;
	}

	.chart-tooltip rect {
		fill: rgba(36, 36, 36, 0.92);
		stroke: rgba(255, 255, 255, 0.14);
		stroke-width: 1;
	}

	.chart-tooltip text {
		fill: rgba(255, 255, 255, 0.72);
		font-family: inherit;
		font-size: 12px;
	}

	.chart-tooltip .tooltip-title {
		fill: #fff;
		font-size: 13px;
		font-weight: 700;
	}

	.chart-tooltip .tooltip-value {
		fill: #fff;
		font-weight: 700;
		text-anchor: end;
	}

	.scrub-zone {
		fill: transparent;
		cursor: crosshair;
		touch-action: none;
	}

	.scrub-zone:focus {
		outline: none;
	}

	@keyframes chart-expand {
		from {
			opacity: 0.92;
			transform: scale(0.985);
		}

		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.chart-notes {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.75rem;
		margin-top: 0.8rem;
		color: #77736b;
		font-size: 0.78rem;
		line-height: 1.5;
	}

	.chart-notes p {
		max-width: 42rem;
	}

	.toggle {
		display: inline-flex;
		grid-template-columns: auto auto;
		align-items: center;
		gap: 0.45rem;
		white-space: nowrap;
	}

	.toggle input {
		width: auto;
		accent-color: #d69b2d;
	}

	.phase-list {
		display: grid;
		gap: 0.42rem;
	}

	.phase-list.compact {
		gap: 0.42rem;
	}

	.phase-row {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) 3.8rem 3.8rem minmax(0, 1.15fr);
		align-items: end;
		gap: 0.38rem;
		border: 1px solid rgba(36, 36, 36, 0.07);
		border-radius: 14px;
		background: #fffaf1;
		padding: 0.45rem;
	}

	.phase-contribution {
		grid-column: auto;
	}

	.phase-row input {
		padding: 0.36rem 0.45rem;
		font-size: 0.78rem;
	}

	.phase-row label {
		gap: 0.18rem;
	}

	.phase-row label span {
		font-size: 0.66rem;
		line-height: 1;
	}

	.phase-row input[type='range'] {
		padding: 0;
		height: 0.9rem;
	}

	@media (max-width: 980px) {
		.summary {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.tool-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.cofi-page {
			gap: 1rem;
		}

		.summary {
			grid-template-columns: 1fr;
		}

		.panel-heading,
		.phase-header,
		.chart-notes {
			align-items: flex-start;
			flex-direction: column;
		}

		.chart-actions {
			align-items: flex-start;
			flex-direction: column;
			width: 100%;
		}

		.legend {
			justify-content: flex-start;
		}

		.fullscreen-toggle {
			width: 100%;
		}

		.chart-panel.fullscreen {
			inset: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom)
				env(safe-area-inset-left);
			border-radius: 0;
			padding: 0.75rem;
		}

		.chart-panel.fullscreen .panel-heading {
			gap: 0.65rem;
			margin-bottom: 0.65rem;
		}

		.chart-panel.fullscreen .chart-notes {
			display: none;
		}

		.button-row {
			display: grid;
			grid-template-columns: 1fr;
			width: 100%;
		}

		.phase-row {
			grid-template-columns: minmax(0, 1fr) 4.5rem 4.5rem;
			width: 100%;
		}

		.phase-contribution {
			grid-column: 1 / -1;
		}
	}
</style>
