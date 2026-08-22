import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

function localBabyRevealApi(apiKey: string): Plugin {
	const photoDirectory = resolve(process.cwd(), 'baby-shower-photos');
	const portraitVariations = [
		'a younger baby with a round face, very full cheeks, wide curious eyes, fine wispy hair, and a tiny delighted smile',
		'an older baby with an oval face, bright almond-shaped eyes, fluffy curls, clear dimples, and a mischievous grin',
		'a sleepy baby with a heart-shaped face, soft hooded eyes, sparse side-swept hair, a button nose, and a tiny yawn',
		'a cheerful baby with a softly squared face, expressive eyebrows, short tousled hair, a broad gummy laugh, and rosy cheeks',
		'a curious baby with a delicate oval face, large sparkling eyes, a small pout, soft curls, and an alert expression',
		'a playful baby with a round chin, crinkled smiling eyes, a little cowlick, pronounced dimples, and a cheeky expression',
		'a calm baby with gently sculpted cheeks, deep-set attentive eyes, silky straight hair, and a peaceful half-smile',
		'an energetic baby with a tapered face, animated eyes, fluffy wavy hair, raised eyebrows, and an open-mouthed giggle',
		'a cuddly baby with plush cheeks, softly arched brows, a tiny nose, feathery hair, and a comically serious expression'
	];
	let portraitVariationIndex = Math.floor(Math.random() * portraitVariations.length);

	return {
		name: 'local-baby-reveal-api',
		configureServer(server) {
			server.middlewares.use('/api/baby-gallery', async (request, response, next) => {
				if (request.method !== 'GET') return next();

				try {
					await mkdir(photoDirectory, { recursive: true });
					const filenames = (await readdir(photoDirectory))
						.filter(
							(filename) =>
								filename.startsWith('baby-reveal-') && /\.(png|jpe?g)$/i.test(filename)
						)
						.sort()
						.reverse();

					response.setHeader('content-type', 'application/json');
					response.end(
						JSON.stringify({
							images: filenames.map((filename) => ({
								name: filename,
								url: `/api/baby-photo?name=${encodeURIComponent(filename)}`
							}))
						})
					);
				} catch (error) {
					response.statusCode = 500;
					response.end(
						JSON.stringify({
							error: error instanceof Error ? error.message : 'Could not load the gallery.'
						})
					);
				}
			});

			server.middlewares.use('/api/baby-photo', async (request, response, next) => {
				if (request.method !== 'GET') return next();

				try {
					const url = new URL(request.url || '/', 'http://localhost');
					const filename = url.searchParams.get('name') || '';
					if (
						basename(filename) !== filename ||
						!filename.startsWith('baby-reveal-') ||
						!/^baby-reveal-.+\.(png|jpe?g)$/i.test(filename)
					) {
						response.statusCode = 400;
						response.end('Invalid photo name.');
						return;
					}

					const image = await readFile(resolve(photoDirectory, filename));
					response.setHeader(
						'content-type',
						/\.png$/i.test(filename) ? 'image/png' : 'image/jpeg'
					);
					response.setHeader('cache-control', 'no-store');
					response.end(image);
				} catch {
					response.statusCode = 404;
					response.end('Photo not found.');
				}
			});

			server.middlewares.use('/api/baby-reveal', async (request, response, next) => {
				if (request.method !== 'POST') return next();

				response.setHeader('content-type', 'application/json');

				try {
					if (!apiKey) {
						response.statusCode = 503;
						response.end(
							JSON.stringify({
								error: 'Add OPENAI_API_KEY to .env.local, then restart the local server.'
							})
						);
						return;
					}

					const chunks: Buffer[] = [];
					let totalBytes = 0;
					for await (const chunk of request) {
						const buffer = Buffer.from(chunk);
						totalBytes += buffer.length;
						if (totalBytes > 15_000_000) throw new Error('The captured photo is too large.');
						chunks.push(buffer);
					}

					const { image, dogMode } = JSON.parse(Buffer.concat(chunks).toString('utf8')) as {
						image?: string;
						dogMode?: boolean;
					};
					const match = image?.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
					if (!match) {
						response.statusCode = 400;
						response.end(JSON.stringify({ error: 'A valid camera photo is required.' }));
						return;
					}
					const portraitVariation =
						portraitVariations[portraitVariationIndex % portraitVariations.length];
					portraitVariationIndex += 1;

					const form = new FormData();
					form.append('model', 'gpt-image-2');
					form.append(
						'prompt',
						dogMode
							? `EASTER EGG: Create a funny, adorable, family-friendly fictional human-puppy baby hybrid as the only subject. Blend a sweet human infant with recognizable features inspired by the dog and person in the reference photo, such as soft puppy ears, a tiny puppy nose, fluffy accents, and playful paws, while keeping the result cute, warm, and not disturbing. Make the hybrid baby's pose and expression humorously echo the visible pose, expressions, and body language of the person and plush dog in the reference photo. Facial variation for this generation: ${portraitVariation}. Show the hybrid baby’s full body from head to toe. Compose it like a polished professional lifestyle photoshoot captured with an 85mm prime lens at a wide aperture, crisp focus on the subject, soft flattering natural light, realistic detail, and a strongly blurred creamy bokeh background. Do not show the original adult, dog, parents, hands, other animals, or additional people. No text, collage, border, or watermark.`
							: `Create a polished, photorealistic professional portrait of exactly one human baby. Show the baby’s full body from head to toe, with the baby as the only subject. Use the two adults in the reference photo as gentle visual inspiration for the fictional baby. Make the baby's pose, expression, and comic energy visibly echo the adults' pose, facial expressions, gestures, and body language in the reference photo; exaggerate that echo slightly when it creates a charming funny result. Facial variation for this generation: ${portraitVariation}. Ensure this baby's face is visibly distinct from previous generic baby portraits. Compose it like a high-end lifestyle baby photoshoot captured with a beautiful 85mm prime lens at a wide aperture, with crisp focus on the baby, soft flattering natural light, realistic skin texture, and a strongly blurred creamy bokeh background. Use tasteful neutral, peach, and butter-yellow styling with a simple comfortable baby outfit. Keep the entire baby clearly visible and in focus. Do not show adults, parents, hands, siblings, animals, pets, or any other people. This is a playful imagined family keepsake, not an accurate prediction. No text, collage, border, or watermark.`
					);
					form.append('size', '1024x1024');
					form.append('quality', 'low');
					form.append('output_format', 'jpeg');
					form.append('output_compression', '55');
					form.append(
						'image',
						new Blob([Buffer.from(match[2], 'base64')], { type: match[1] }),
						'parents.jpg'
					);

					const openAIResponse = await fetch('https://api.openai.com/v1/images/edits', {
						method: 'POST',
						headers: { Authorization: `Bearer ${apiKey}` },
						body: form
					});
					const result = (await openAIResponse.json()) as {
						data?: Array<{ b64_json?: string; url?: string }>;
						error?: { message?: string };
					};

					if (!openAIResponse.ok) {
						response.statusCode = openAIResponse.status;
						response.end(
							JSON.stringify({
								error: result.error?.message || 'OpenAI could not create the reveal.'
							})
						);
						return;
					}

					const generated = result.data?.[0];
					const imageUrl = generated?.b64_json
						? `data:image/jpeg;base64,${generated.b64_json}`
						: generated?.url;
					if (!imageUrl) throw new Error('OpenAI returned no image.');

					const imageBytes = generated?.b64_json
						? Buffer.from(generated.b64_json, 'base64')
						: Buffer.from(await (await fetch(imageUrl)).arrayBuffer());
					await mkdir(photoDirectory, { recursive: true });
					const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
					const filename = `baby-reveal-${timestamp}.jpg`;
					await writeFile(resolve(photoDirectory, filename), imageBytes);

					response.statusCode = 200;
					response.end(
						JSON.stringify({
							image_url: imageUrl,
							saved_as: `baby-shower-photos/${filename}`
						})
					);
				} catch (error) {
					response.statusCode = 500;
					response.end(
						JSON.stringify({
							error:
								error instanceof Error
									? error.message
									: 'Something went wrong creating the reveal.'
						})
					);
				}
			});
		}
	};
}

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [localBabyRevealApi(env.OPENAI_API_KEY || ''), sveltekit()]
	};
});
