

// see https://developers.figma.com/docs/embeds/embed-figma-file/ for options
export const design = (figmaUrl: string) => {
	const url = new URL(figmaUrl);
	Object.entries({
		mode: "dev",
		footer: false,
		"page-selector": false,
		"viewport-controls": false,
		theme: "light",
	}).forEach(([key, value]) => {
		url.searchParams.set(key, String(value));
	});

	return { design: { type: "figma", url } };
};