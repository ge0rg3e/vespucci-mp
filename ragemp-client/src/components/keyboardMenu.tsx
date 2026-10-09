import { key } from '@/definitions/keys';
import React, { useEffect, useRef, useState } from 'react';

const Component = (props: Props) => {
	const [keyPressed, setKeyPressed] = useState<ExpectedAny>(null);

	const selectedIndexRef = useRef(props.selectedIndex);
	const refs = useRef<ExpectedAny>({
		entries: []
	});

	useEffect(() => {
		refs.current = {
			entries: props.data,
			disableNavigation: props.disableNavigation || false
		};
	}, [props.data, props.disableNavigation]);

	// @Workaround for the "cached" functions onCallback.
	useEffect(() => {
		if (keyPressed === null) return;

		// When they tap enter..
		if (keyPressed && props.onCallbacks && props.onCallbacks.onKeyPressed) {
			props.onCallbacks.onKeyPressed(keyPressed, props.data[props.selectedIndex]);
		}

		setKeyPressed(null);
	}, [keyPressed]);

	const onKeyDown = (e: ExpectedAny) => {
		// @bugfix: preventing any issue with scrolls.
		const inputFocused = document.activeElement;
		if (inputFocused && ['input', 'textarea'].includes(inputFocused.localName)) return true;

		// @Bugfix:Prevent control of the scroll container by Arrows.
		if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
			e.preventDefault();
		}

		// Is either only A & D , Left , Right Arrows.
		if (![13, 8, 27, 37, 39, 65, 68].includes(e.keyCode)) return false;

		let val = selectedIndexRef.current;
		const items = refs.current.entries;
		let limitReached = false;

		if (!refs.current.disableNavigation) {
			if (key(e, 'ArrowLeft') || key(e, 'A')) {
				if (val === 0 || val === -1) {
					if (props.onLimitReachedReset) {
						val = items.length - 1;
						limitReached = true;
					}
				} else {
					val--;
				}
			}

			if (key(e, 'ArrowRight') || key(e, 'D')) {
				if (val === items.length - 1) {
					if (props.onLimitReachedReset) {
						val = 0;
						limitReached = true;
					}
				} else {
					val++;
				}
			}
		}

		// Keys that must be triggered.
		const keysOfInterest = ['Enter', 'Backspace', 'Escape'];
		keysOfInterest.forEach((k: ExpectedAny) => {
			if (key(e, k) && props.onCallbacks && props.onCallbacks.onKeyPressed) {
				e.preventDefault();
				setKeyPressed(k);
			}
		});

		if (val !== selectedIndexRef.current) {
			e.preventDefault();
			props.setSelectedIndex(val);
			if (limitReached) {
				// @Reminder: if you don't want that animation.
				// scrollIntoView(val, true);
			}
		}

		e.preventDefault();
	};

	useEffect(() => {
		selectedIndexRef.current = props.selectedIndex;

		if (props.selectedIndex !== -1) {
			scrollIntoView(props.selectedIndex);
			if (props.onScroll) {
				props.onScroll(props.selectedIndex);
			}
		}
	}, [props.selectedIndex]);

	const scrollIntoView = (val: number, instant = false) => {
		const selected = document.getElementById(`--comp-slider-entry-${val}`);
		const container = document.getElementById('--comp-slider-container');

		if (!selected || !container) return false;

		if (selected.scrollIntoView)
			selected.scrollIntoView({
				block: 'center',
				inline: 'center', // center da scroll doar cand s-a ajusn la limita, start e cand pe index 0 e primul scroll
				behavior: instant ? 'auto' : 'smooth'
			});

		selected.focus({ preventScroll: true });
	};

	const onEventSetIndex = ({ detail }: ExpectedAny) => {
		props.setSelectedIndex(detail.index);
		scrollIntoView(detail.index, detail.instant ? true : false);
	};

	useEffect(() => {
		document.addEventListener('keyup', onKeyDown);
		document.addEventListener(`horizontalMenu:setIndex`, onEventSetIndex);

		return () => {
			document.removeEventListener('keyup', onKeyDown);
			document.removeEventListener(`horizontalMenu:setIndex`, onEventSetIndex);
		};
	}, []);

	return (
		<React.Fragment>
			<div
				id="--comp-slider-container"
				className={`shared-comp-keyboard-menu  ${props.className || ''}`}
			>
				{props.data.map((entry, ix) => (
					<div
						id={`--comp-slider-entry-${ix}`}
						className={`--entry ${props.entryClassName(
							entry,
							props.selectedIndex === ix ? true : false
						)}`}
						key={ix}
					>
						{props.renderEntry(entry, ix)}
					</div>
				))}
			</div>
		</React.Fragment>
	);
};

type Props = {
	selectedIndex: number;
	setSelectedIndex: ExpectedAny;
	ref?: ExpectedAny;
	data: Array<ExpectedAny>;
	entryClassName: (entryData?: ExpectedAny, isSelected?: boolean) => string;
	className?: string;
	renderEntry?: ExpectedAny;
	onLimitReachedReset?: boolean;
	onCallbacks?: {
		onKeyPressed?: (key: string, entryFocused: ExpectedAny) => void;
	};
	onScroll?: (newIndex: number) => void;
	disableNavigation?: boolean;
};
export default Component;
