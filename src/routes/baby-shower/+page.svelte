<script lang="ts">
	import { base } from '$app/paths';
	import { onDestroy, onMount, tick } from 'svelte';
	import type {
		FaceDetector as MediaPipeFaceDetector,
		ObjectDetector as MediaPipeObjectDetector
	} from '@mediapipe/tasks-vision';

	type AppState = 'welcome' | 'searching' | 'countdown' | 'captured' | 'creating' | 'result' | 'error';

	let video: HTMLVideoElement;
	let captureCanvas: HTMLCanvasElement;
	let stream: MediaStream | null = null;
	let detector: MediaPipeFaceDetector | null = null;
	let objectDetector: MediaPipeObjectDetector | null = null;
	let detectionTimer: number | null = null;
	let countdownTimer: number | null = null;
	let resultTimer: number | null = null;
	let state: AppState = 'welcome';
	let faceCount = 0;
	let dogCount = 0;
	let detectionTick = 0;
	let stableDetections = 0;
	let captureHasDog = false;
	let capturedPhoto = '';
	let babyImage = '';
	let savedAs = '';
	let errorMessage = '';
	let countdown = 3;
	let cameraDevices: MediaDeviceInfo[] = [];
	let selectedCameraId = '';
	let galleryImages: Array<{ name: string; url: string }> = [];
	$: gallerySlots = Array.from({ length: 9 }, (_, index) => galleryImages[index] || null);

	$: instruction =
		state === 'countdown'
			? dogCount > 0
				? 'Puppy guest spotted — get ready for the secret reveal!'
				: 'Big smiles — it is almost time!'
			: faceCount === 1
				? dogCount > 0
					? 'One person and one puppy found!'
					: 'One lovely face spotted — bring your plus one in!'
				: 'Step inside together and let the camera find you.';

	onMount(() => {
		void loadGallery();
		return () => stopCamera();
	});

	onDestroy(() => stopCamera());

	async function loadGallery() {
		try {
			const response = await fetch('/api/baby-gallery');
			if (!response.ok) return;
			const result = await response.json();
			galleryImages = (result.images || []).slice(0, 9);
		} catch {
			// The gallery will retry after the next successful generation.
		}
	}

	async function startCamera() {
		errorMessage = '';
		try {
			const permissionStream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
				audio: false
			});
			const devices = await navigator.mediaDevices.enumerateDevices();
			const videoInputs = devices.filter((device) => device.kind === 'videoinput');
			const builtInPattern = /facetime|built[ -]?in|integrated|macbook|laptop/i;
			const externalCameras = videoInputs.filter(
				(device) => !builtInPattern.test(device.label)
			);
			cameraDevices = externalCameras.length ? externalCameras : videoInputs;
			const initialDeviceId = permissionStream.getVideoTracks()[0]?.getSettings().deviceId || '';
			selectedCameraId = cameraDevices[0]?.deviceId || initialDeviceId;

			if (selectedCameraId && selectedCameraId !== initialDeviceId) {
				permissionStream.getTracks().forEach((track) => track.stop());
				stream = await getCameraStream(selectedCameraId);
			} else {
				stream = permissionStream;
			}
			video.srcObject = stream;
			await video.play();
			state = 'searching';

			try {
				const { FaceDetector, FilesetResolver, ObjectDetector } =
					await import('@mediapipe/tasks-vision');
				const vision = await FilesetResolver.forVisionTasks(
					`${base}/mediapipe/wasm`
				);
				detector = await FaceDetector.createFromOptions(vision, {
					baseOptions: {
						modelAssetPath: `${base}/mediapipe/blaze_face_short_range.tflite`,
						delegate: 'CPU'
					},
					runningMode: 'VIDEO',
					minDetectionConfidence: 0.45,
					minSuppressionThreshold: 0.3
				});
				objectDetector = await ObjectDetector.createFromOptions(vision, {
					baseOptions: {
						modelAssetPath: `${base}/mediapipe/efficientdet_lite0.tflite`,
						delegate: 'CPU'
					},
					runningMode: 'VIDEO',
					scoreThreshold: 0.25,
					maxResults: 2,
					categoryAllowlist: ['dog', 'teddy bear']
				});
				detectionTimer = window.setInterval(checkFaces, 350);
			} catch (error) {
				state = 'error';
				errorMessage = 'The local face detector could not load. Restart the dev server and try again.';
				console.error('Face detector setup failed:', error);
			}
		} catch (error) {
			state = 'error';
			errorMessage = error instanceof Error && error.name === 'NotAllowedError'
				? 'Camera access was blocked. Please allow it and try again.'
				: 'We could not start your camera. Try opening this page over HTTPS.';
		}
	}

	function getCameraStream(deviceId: string) {
		return navigator.mediaDevices.getUserMedia({
			video: {
				deviceId: { exact: deviceId },
				width: { ideal: 1280 },
				height: { ideal: 720 }
			},
			audio: false
		});
	}

	async function switchCamera(event: Event) {
		const deviceId = (event.currentTarget as HTMLSelectElement).value;
		if (!deviceId || deviceId === selectedCameraId) return;
		selectedCameraId = deviceId;
		stableDetections = 0;
		faceCount = 0;
		dogCount = 0;
		state = 'searching';
		try {
			const nextStream = await getCameraStream(deviceId);
			stream?.getTracks().forEach((track) => track.stop());
			stream = nextStream;
			await tick();
			video.srcObject = stream;
			await video.play();
		} catch {
			state = 'error';
			errorMessage = 'That camera could not be opened. Check its connection and try again.';
		}
	}

	function checkFaces() {
		if (!detector || !video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
		if (state !== 'searching' && state !== 'countdown') return;
		try {
			const now = performance.now();
			const faces = detector.detectForVideo(video, now).detections;
			faceCount = faces.length;
			detectionTick += 1;
			if (objectDetector && detectionTick % 2 === 0) {
				dogCount = objectDetector.detectForVideo(video, now).detections.length;
			}
			const subjectCount = faceCount + dogCount;
			if (subjectCount >= 2) {
				stableDetections += 1;
				if (stableDetections >= 3 && state === 'searching') startCountdown();
			} else {
				stableDetections = 0;
			}
		} catch (error) {
			console.error('Face detection failed:', error);
		}
	}

	function stopCamera() {
		if (detectionTimer) window.clearInterval(detectionTimer);
		if (countdownTimer) window.clearInterval(countdownTimer);
		if (resultTimer) window.clearTimeout(resultTimer);
		detectionTimer = null;
		countdownTimer = null;
		resultTimer = null;
		detector?.close();
		detector = null;
		objectDetector?.close();
		objectDetector = null;
		stream?.getTracks().forEach((track) => track.stop());
		stream = null;
	}

	function startCountdown() {
		if (state === 'countdown') return;
		state = 'countdown';
		countdown = 3;
		countdownTimer = window.setInterval(() => {
			if (countdown <= 1) {
				if (countdownTimer) window.clearInterval(countdownTimer);
				countdownTimer = null;
				takePhoto();
				return;
			}
			countdown -= 1;
		}, 1000);
	}

	function takePhoto() {
		if (!video?.videoWidth) return;
		const captureWidth = Math.min(512, video.videoWidth);
		const captureHeight = Math.round(captureWidth * (video.videoHeight / video.videoWidth));
		captureCanvas.width = captureWidth;
		captureCanvas.height = captureHeight;
		const context = captureCanvas.getContext('2d');
		if (!context) return;
		context.translate(captureCanvas.width, 0);
		context.scale(-1, 1);
		context.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
		capturedPhoto = captureCanvas.toDataURL('image/jpeg', 0.62);
		captureHasDog = dogCount > 0;
		state = 'captured';
		void createBabyReveal();
	}

	async function createBabyReveal() {
		state = 'creating';
		errorMessage = '';
		try {
			const response = await fetch('/api/baby-reveal', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ image: capturedPhoto, dogMode: captureHasDog })
			});
			const result = await response.json();
			if (!response.ok || !result.image_url) throw new Error(result.error || 'The reveal could not be created.');
			babyImage = result.image_url;
			savedAs = result.saved_as || '';
			state = 'result';
			await loadGallery();
			resultTimer = window.setTimeout(tryAgain, 8000);
		} catch (error) {
			state = 'error';
			errorMessage = error instanceof Error ? error.message : 'The reveal could not be created.';
		}
	}

	async function tryAgain() {
		capturedPhoto = '';
		babyImage = '';
		savedAs = '';
		captureHasDog = false;
		stableDetections = 0;
		faceCount = 0;
		dogCount = 0;
		countdown = 3;
		if (resultTimer) window.clearTimeout(resultTimer);
		resultTimer = null;
		if (detector && stream) {
			state = 'searching';
			await tick();
			if (video) {
				video.srcObject = stream;
				await video.play();
			}
		} else {
			stopCamera();
			state = 'welcome';
		}
	}
</script>

<svelte:head>
	<title>Dean & Eric's Baby Shower</title>
	<meta name="description" content="A little baby shower photo booth for Dean and Eric." />
</svelte:head>

<section class="shower-page">
	<div class="cloud cloud-one"></div><div class="cloud cloud-two"></div>
	<header class="hero">
		<p class="eyebrow">A tiny celebration for a very big love</p>
		<h1>Dean <span>&amp;</span> Eric's<br />Baby Shower</h1>
		<div class="rainbow" aria-hidden="true">☁︎ <i></i><i></i><i></i> ☁︎</div>
	</header>

	<main class="experience">
	<section class="booth">
		<div class="camera-card" class:has-photo={state === 'captured' || state === 'creating' || state === 'result'}>
			<div class="frame-top"><span>little one loading...</span><b>✦</b><span>made with love</span></div>
			<div class="camera-window">
				{#if capturedPhoto && (state === 'captured' || state === 'creating')}
					<img src={capturedPhoto} alt="Photo booth portrait" />
				{:else if babyImage && state === 'result'}
					<img src={babyImage} alt="A sweet imagined baby portrait" />
				{:else}
					<video bind:this={video} playsinline muted class="mirrored" aria-label="Camera preview"></video>
					{#if state === 'welcome'}<div class="camera-empty"><span>♡</span><p>Ready for your close-up?</p></div>{/if}
					{#if state === 'searching' || state === 'countdown'}<div class="face-guide"><span></span><span></span></div>{/if}
					{#if state === 'countdown'}<div class="countdown" aria-live="assertive">{countdown}</div>{/if}
				{/if}
				{#if state === 'creating'}<div class="creating"><span>✦</span><p>Dreaming up<br />a little glimpse...</p></div>{/if}
			</div>
			<div class="frame-bottom"><span>baby prediction booth</span><span>♡ 2026 ♡</span></div>
		</div>

		<div class="status-card">
			{#if state === 'welcome'}
				<p>Find someone you love, squeeze into the frame, and make a tiny bit of magic.</p>
				<button class="primary" onclick={startCamera}>Start the photo booth <span>→</span></button>
			{:else if state === 'searching' || state === 'countdown'}
				<p class:ready={state === 'countdown'}><b>{state === 'countdown' ? (dogCount > 0 ? 'Easter egg unlocked!' : 'Two faces found!') : `${faceCount || 'No'} faces found`}</b> {instruction}</p>
				{#if state === 'searching' && cameraDevices.length > 0}
					<label class="camera-picker">
						<span>Camera</span>
						<select value={selectedCameraId} onchange={switchCamera}>
							{#each cameraDevices as camera, index}
								<option value={camera.deviceId}>{camera.label || `External camera ${index + 1}`}</option>
							{/each}
						</select>
					</label>
				{/if}
			{:else if state === 'captured'}
				<p><b>Photo captured!</b> Sending your little glimpse to the stork...</p>
			{:else if state === 'creating'}
				<p><b>One sprinkle of stardust...</b> This can take a little moment.</p>
			{:else if state === 'result'}
				<p><b>Oh, hello little one!</b> A playful imagined peek at your future family.</p>
				{#if savedAs}<small class="save-note">Saved locally as {savedAs}</small>{/if}
				<small class="return-note">Camera returns automatically in 8 seconds.</small>
				<button class="primary" onclick={tryAgain}>Make another memory <span>↻</span></button>
			{:else if state === 'error'}
				<p><b>Oops.</b> {errorMessage}</p>
				<button class="primary" onclick={tryAgain}>Try again <span>↻</span></button>
			{/if}
		</div>
		<p class="privacy">Once two faces are found, your photo is securely sent to create the reveal.</p>
	</section>
	<aside class="gallery-panel" aria-label="Saved baby portraits">
		<div class="gallery-heading">
			<span>Our little gallery</span>
			<b>{galleryImages.length}</b>
		</div>
		<div class="gallery-grid">
			{#each gallerySlots as image, index}
				{#if image}
					<a
						href={image.url}
						target="_blank"
						rel="noreferrer"
						title={image.name}
						class:latest={index === 0}
					>
						<img src={image.url} alt="Saved fictional baby portrait" loading="lazy" />
					</a>
				{:else}
					<div class="gallery-slot" aria-label="Empty gallery position">
						<span>♡</span>
					</div>
				{/if}
			{/each}
		</div>
		{#if !galleryImages.length}<p class="gallery-message">Your baby portraits will appear here.</p>{/if}
	</aside>
	</main>
	<footer>made with love, just for today <span>♥</span></footer>
</section>

<canvas bind:this={captureCanvas} class="sr-only"></canvas>

<style>
	:global(body) { background: #fff9f1; }
	.shower-page { --ink:#5f4c55; --peach:#f8b5a1; --cream:#fffaf2; width:100%; height:100dvh; min-height:0; overflow:hidden; position:relative; display:grid; grid-template-rows:auto minmax(0,1fr) auto; padding:clamp(.75rem,2.5vh,1.75rem) 1.25rem clamp(.55rem,1.5vh,1rem); color:var(--ink); background:radial-gradient(circle at 50% 15%,#fff 0 10%,transparent 45%),#fff3e6; font-family: Georgia, 'Times New Roman', serif; }
	.hero, .experience, footer { position:relative; z-index:1; text-align:center; }
	.eyebrow { color:#c8887c; font:600 .68rem/1.2 ui-rounded, system-ui, sans-serif; letter-spacing:.16em; text-transform:uppercase; }
	h1 { font-size:clamp(2rem,min(5vw,6vh),4rem); line-height:.92; font-weight:400; letter-spacing:-.06em; margin:.35rem 0 .35rem; }
	h1 span { color:#e99c8e; font-style:italic; }
	.rainbow { color:#dab8bd; letter-spacing:.2em; font-size:.9rem; line-height:1; } .rainbow i { display:inline-block; width:10px; height:16px; margin:0 -3px; border:2px solid; border-bottom:0; border-radius:14px 14px 0 0; } .rainbow i:nth-child(2){border-color:#f3c0a4}.rainbow i:nth-child(3){border-color:#f1df9f}
	.experience{width:min(100%,820px);min-height:0;margin:clamp(.5rem,1.7vh,1rem) auto 0;display:grid;grid-template-columns:minmax(0,460px) minmax(170px,260px);gap:clamp(.75rem,2vw,1.35rem);align-items:start;justify-content:center;overflow:visible}.booth { width:100%; min-width:0; align-self:start; }.camera-card { padding:8px; background:#fffdf7; border:2px solid #e9bdb3; border-radius:26px; box-shadow:0 10px 0 #e3a79b,0 18px 30px #bc796936; transform:rotate(-.6deg); }.frame-top,.frame-bottom { height:clamp(26px,4vh,32px); display:flex; justify-content:space-between; align-items:center; padding:0 7px; color:#c28e89; font:700 .52rem/1 ui-rounded, system-ui, sans-serif; letter-spacing:.08em; text-transform:uppercase; }.frame-top b{font-size:1rem}.camera-window { aspect-ratio:4/3; max-height:calc(100dvh - 325px); overflow:hidden; position:relative; background:#e8d8d2; border-radius:17px; }.camera-window img,video { width:100%; height:100%; object-fit:cover; display:block; }.mirrored { transform:scaleX(-1); }.camera-empty { position:absolute; inset:0; display:grid; place-content:center; color:#b6898b; }.camera-empty span{font-size:2.4rem}.camera-empty p{margin-top:.2rem; font-style:italic}.face-guide{position:absolute; inset:16% 9%; display:flex; justify-content:space-around; pointer-events:none}.face-guide span{width:34%; height:58%; border:2px dashed #fff9; border-radius:46% 46% 42% 42%; box-shadow:0 0 0 5px #8c686d18}.creating{position:absolute;inset:0;display:grid;place-content:center;background:#604b5ab8;color:#fff;backdrop-filter:blur(3px);font-style:italic;font-size:1.05rem}.creating span{font-size:2.1rem}.countdown{position:absolute;inset:0;display:grid;place-content:center;color:#fff;font:400 clamp(5rem,15vh,8rem)/.8 Georgia,serif;text-shadow:0 4px 18px #44323f99;background:#5d445226;animation:pop .8s ease-out}.status-card{margin:clamp(.65rem,1.8vh,1rem) auto 0;background:#fffdf9d9;border:1px solid #f3d8cc;border-radius:16px;padding:clamp(.65rem,1.4vh,.9rem) .85rem;box-shadow:0 7px 18px #c9806b12;font-family:ui-rounded, system-ui, sans-serif}.status-card p{font-size:clamp(.76rem,1.7vh,.88rem);line-height:1.35;margin:0 auto .65rem;max-width:390px}.status-card p:last-child{margin-bottom:0}.status-card b{color:#bf7d7d}.status-card p.ready b{color:#72a69c}.camera-picker{display:flex;align-items:center;justify-content:center;gap:.45rem;margin:.1rem auto 0;color:#a7837e;font:700 .59rem ui-rounded,system-ui,sans-serif;text-transform:uppercase;letter-spacing:.07em}.camera-picker select{max-width:220px;border:1px solid #e8c8bd;border-radius:999px;background:#fff9f4;color:#68515d;padding:.3rem 1.7rem .3rem .65rem;font:600 .66rem ui-rounded,system-ui,sans-serif;outline:none}.save-note{display:block;margin:-.25rem auto .35rem;color:#a48682;font:500 .58rem/1.2 ui-monospace,monospace;overflow-wrap:anywhere}.return-note{display:block;margin:0 auto .5rem;color:#bf7d7d;font:700 .61rem/1.2 ui-rounded,system-ui,sans-serif}.primary{border:0;border-radius:999px;padding:.62rem 1rem;font:700 .74rem ui-rounded,system-ui,sans-serif;cursor:pointer;letter-spacing:.01em;background:#5e4b58;color:#fff;box-shadow:0 3px 0 #3f303a}.primary span{margin-left:.3rem;font-size:.9rem}.privacy{margin:clamp(.45rem,1vh,.7rem) 0 0;font:500 .59rem ui-rounded,system-ui,sans-serif;color:#ad9992}.gallery-panel{height:auto;min-height:0;overflow:visible;align-self:start;background:#fffdf9e8;border:1px solid #f0d4c9;border-radius:20px;padding:.75rem;box-shadow:0 10px 24px #c9806b16}.gallery-heading{display:flex;justify-content:space-between;align-items:center;margin-bottom:.65rem;color:#a27272;font:700 .64rem ui-rounded,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}.gallery-heading b{display:grid;place-content:center;width:1.35rem;height:1.35rem;border-radius:50%;background:#f8dfd4;color:#936467}.gallery-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.45rem}.gallery-grid a,.gallery-slot{display:block;aspect-ratio:1;border-radius:10px;overflow:hidden;background:#f1dfd8;box-shadow:0 2px 8px #8e5f561c;transition:transform .25s ease,box-shadow .25s ease}.gallery-slot{display:grid;place-content:center;border:1px dashed #debcb5;background:#fff9f4;color:#d6b6b0;font-size:1rem;box-shadow:none}.gallery-grid a.latest{position:relative;z-index:2;transform:scale(1.06) rotate(-1deg);outline:2px solid #f2b6a8;box-shadow:0 7px 18px #8e5f5640;animation:gallery-pop .65s cubic-bezier(.2,.9,.3,1.25)}.gallery-grid img{width:100%;height:100%;display:block;object-fit:cover}.gallery-message{margin:.65rem 0 0;color:#b99b96;font:italic .7rem/1.3 Georgia,serif}.cloud{position:absolute;width:190px;height:46px;border-radius:999px;background:#fffaf4;opacity:.85}.cloud:before,.cloud:after{content:'';position:absolute;border-radius:50%;background:inherit}.cloud:before{width:72px;height:72px;left:28px;bottom:0}.cloud:after{width:92px;height:92px;right:22px;bottom:0}.cloud-one{left:-48px;top:270px}.cloud-two{right:-68px;top:105px;transform:scale(.7)}footer{align-self:end;margin-top:.35rem;color:#ba918a;font:600 .58rem ui-rounded,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}footer span{color:#ef9e93}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}@keyframes pop{from{transform:scale(1.4);opacity:.1}to{transform:scale(1);opacity:1}}@keyframes gallery-pop{0%{transform:scale(.35) rotate(-5deg);opacity:0}70%{transform:scale(1.12) rotate(1deg);opacity:1}100%{transform:scale(1.06) rotate(-1deg)}}@media(max-width:620px){.shower-page{padding-inline:.6rem}.experience{grid-template-columns:minmax(0,1fr) 118px;gap:.55rem}.gallery-panel{padding:.5rem;border-radius:15px}.gallery-grid{gap:.25rem}.gallery-heading span{font-size:.52rem}.camera-picker{display:none}.camera-card{border-radius:21px}.frame-top,.frame-bottom{height:25px}}@media(max-height:680px){.eyebrow,.rainbow,footer{display:none}h1{font-size:1.9rem}.experience{margin-top:.35rem}.camera-window{max-height:calc(100dvh - 240px)}.privacy{display:none}}
</style>
