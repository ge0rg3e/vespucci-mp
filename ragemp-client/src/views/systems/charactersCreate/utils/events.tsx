import { useEffect, useState, useRef } from 'react';

const Component = () => {
	const [lastMouseCoords, setLastMouseCoords] = useState({ x: 0, y: 0 });
	const [mousePressed, setMousePressed] = useState(false);
	const [lastAngle, setlastAngle] = useState(180); // Camera of character creator
	const mousePressedRef: UndefinedAny = useRef(false);
	const lastMouseCoordsRef: ExpectedAny = useRef({ x: 0, y: 0 });
	const lastAngleRef: { current: number } = useRef(180);

	useEffect(() => {
		mousePressedRef.current = mousePressed;
		lastMouseCoordsRef.current = lastMouseCoords;
		lastAngleRef.current = lastAngle;
	}, [mousePressed, lastMouseCoords, lastAngle]);

	const onWheelEvent = (ev: UndefinedAny) => {
		if (window.mp.fake) {
			return;
		}

		const { clientX, clientY } = ev;
		const elements = document.elementsFromPoint(clientX, clientY);

		if (elements.length > 4) return false;

		const zoomedIn = ev.wheelDelta > 0;
		window.rpc.triggerClient('charCreator:onZoom', JSON.stringify({ zoomedIn }));
	};

	const onMouseMove = (ev: UndefinedAny) => {
		if (window.mp.fake) {
			return;
		}

		const { clientX, clientY } = ev;

		const elements = document.elementsFromPoint(clientX, clientY);
		// console.log('pressed', elements, mousePressedRef.current);
		if (elements.length > 4) return false;

		if (mousePressedRef.current === true) {
			const { x, y } = ev;
			const currentCoords = { ...lastMouseCoordsRef.current };

			setLastMouseCoords({ x, y });

			let newAngle = lastAngleRef.current;

			if (currentCoords.x > x) {
				newAngle -= 5.5;

				if (newAngle < 0) {
					newAngle = 360;
				}
			} else if (currentCoords.x < x) {
				newAngle += 5.5;

				if (newAngle > 360) {
					newAngle = 0;
				}
			}

			setlastAngle(newAngle);
			window.rpc.triggerClient('charCreator:onRotation', JSON.stringify({ newAngle }));
		}
		// setMouseCoords({ x: ev.x, y: ev.y });
	};

	const onMouseUp = (ev: UndefinedAny) => {
		if (ev.which == 2) return false;
		ev.preventDefault();
		setMousePressed(false);
	};

	const onMouseDown = (ev: UndefinedAny) => {
		if (ev.which === 2) return false;
		ev.preventDefault();
		setMousePressed(true);
	};

	useEffect(() => {
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('wheel', onWheelEvent);
		document.addEventListener('mouseup', onMouseUp);
		document.addEventListener('mousedown', onMouseDown);

		return () => {
			document.removeEventListener('wheel', onWheelEvent);
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
			document.removeEventListener('mousedown', onMouseDown);
		};
	}, []);

	return null;
};

export default Component;
