import { useEffect, useRef } from 'react';
import { isDevServer } from '@/utils/helpers';

// Dependencies
import Axios from 'axios';

const Component = (props: ExpectedAny) => {
	const cssVersion = useRef<number>(0);

	const loadStylesheets = async (cssVersioning: number) => {
		try {
			// Fetching the CSS Content from that path
			// In the future: Find a way to restrict access to this specific file UNLESS they have something in the headers.
			const { data: cssContent } = await Axios(`/assets/css/style.css`);

			// If it's a hot reload..
			if (cssVersioning !== cssVersion.current) {
				const currentCss = document.getElementById(`style-${cssVersion.current}`);
				if (currentCss?.innerText === cssContent) {
					return false; /// CSS Is the Same. No point in reloading.
				}
			}

			// Creating the element..
			const style = document.createElement('style');
			style.innerHTML = `${cssContent}`;
			style.id = `style-${cssVersioning}`;

			// When the newer css is loaded..
			style.onload = () => {
				// Informing the parent component that we loaded this css version
				props.onLoad(cssVersion);

				// If it's not the same we need to remove the older css versioning..
				if (cssVersioning !== cssVersion.current) {
					const currVersion = cssVersion.current;

					// Eliminating the older css..
					setTimeout(() => {
						const doc = document.getElementById(`style-${currVersion}`);
						if (!doc) return false;
						doc.remove();
					}, 200); // Must allow 200 ms so the newer css is loaded right.

					cssVersion.current++;
				}
			};

			// Adding it to the header tag..
			document.getElementsByTagName('head')[0].appendChild(style);
		} catch (err) {
			console.error(`Failed to load the main css.`);
		}
	};

	useEffect(() => {
		if (window.mp.fake) {
			document.body.className = `fake-game-background`;
		}

		// This function will load the main CSS and it will make sure that the rest of the script won't load until the css is loaded.
		loadStylesheets(cssVersion.current);

		// Listener so we can hot reload the CSS.
		if (isDevServer() && import.meta.hot) {
			import.meta.hot.on('reloadAppStylesheet', () => {
				loadStylesheets(cssVersion.current + 1);
			});
		}
	}, []);

	return null;
};

export default Component;
