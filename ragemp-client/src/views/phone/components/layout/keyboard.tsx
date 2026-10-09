import { ClickAwayListener } from '@mui/material';
import React, { useEffect, useState } from 'react';

// Components
import Button from '@phone/components/ui/button';

// Context
import { PhoneState } from '@phone/index';

// Dependencies
import { key } from '@/definitions/keys';

const Component = () => {
	const { route } = PhoneState();
	const [data, setData] = useState<ExpectedAny>(null);
	const [localValue, setLocalValue] = useState<ExpectedAny>(null);
	const [validationMessage, setValidationMessage] = useState<ExpectedAny>(null);
	const saveMsg = window.language == 'RO' ? 'Salvează' : 'Save';

	const onClickAway = (ev: UndefinedAny) => {
		if (data === null) return false;
		if (
			ev.path.find(
				(elm: UndefinedAny) => elm.className && elm.className.includes(`device-screen`)
			)
		) {
			cancelKeyboard();
		}
	};

	const cancelKeyboard = () => {
		if (data.onCancel) {
			data.onCancel({ dismiss: () => setData(null) });
		} else {
			setData(null);
		}
	};

	window.phone.showKeyboard = ({
		inputData,
		onSubmit,
		validationOptions = {},
		validationFunc = null
	}) => {
		setData({
			inputData,
			onSubmit,
			validationFunc,
			validationOptions
		});
		setLocalValue(inputData.defaultValue);
	};

	const validateField = () => {
		if (!(localValue !== null && data !== null && data.validationFunc !== null)) return false;
		const msg: string | null = data.validationFunc(localValue);
		setValidationMessage(typeof msg === 'string' ? msg : null);
	};

	useEffect(() => {
		validateField();
		// eslint-disable-next-line
	}, [localValue]);

	useEffect(() => {
		setData(null); // When the route is changing we need to hide the keyboard.
		// eslint-disable-next-line
	}, [route]);

	const getInputProps = () => {
		if (data.inputData.type === 'number') {
			return {
				type: 'number',
				onKeyDown: (e: UndefinedAny) => {
					if (key(e, 'Enter')) return submitFunc!();
				}
			};
		}

		return {
			onKeyDown: (e: UndefinedAny) => {
				if (key(e, 'Enter')) return submitFunc!();
			}
		};
	};

	const isFieldValid = () => {
		// Allow the fields to be empty..
		if (data.validationOptions.isEmpty === false && localValue.length < 1) {
			return false;
		}

		// Validating using the custom func..
		if (data !== null && data.validationFunc) {
			return typeof data.validationFunc(localValue) !== 'string' ? true : false;
		}

		return true;
	};

	const submitFunc = data
		? () => data.onSubmit(localValue, { dismiss: () => setData(null) })
		: null;

	if (data === null) return null;

	// For the future:
	// If the problem with the "input not visible when keyboard is present" keeps being there: https://pastebin.com/twYQWNbQ
	// As of the moment It was looking ugly, the code was almost there.

	return (
		<React.Fragment>
			<ClickAwayListener onClickAway={onClickAway}>
				<div
					id="virtual-keyboard"
					className={`device-component-keyboard ${window.phone.theme}`}
				>
					{validationMessage !== null && (
						<div className="component-validation">
							<div className="message">{validationMessage}</div>
						</div>
					)}
					<div className="component-content" id="virtual-keyboard-content">
						{data.inputData.instructions && (
							<div className="instructions">{data.inputData.instructions}</div>
						)}
						<input
							onChange={(ev: UndefinedAny) => setLocalValue(ev.target.value)}
							className={`component-input ${data.inputData.type}`}
							placeholder={data.inputData.placeholder}
							value={localValue}
							type={data.inputData.type}
							{...getInputProps()}
						/>
						<div className="buttons">
							<Button
								theme="light"
								color="blue"
								disabled={!isFieldValid()}
								onClick={submitFunc!}
								variant={'standard'}
							>
								{saveMsg}
							</Button>
							{data.hideCancel !== true && (
								<Button
									theme="light"
									color="red"
									onClick={() => cancelKeyboard()}
									variant={'standard'}
								>
									{window.language === 'EN' ? 'Cancel' : 'Anulează'}
								</Button>
							)}
						</div>
					</div>
				</div>
			</ClickAwayListener>
		</React.Fragment>
	);
};

export default Component;

interface inputData {
	defaultValue: ExpectedAny;
	type: 'text' | 'number';
	placeholder?: string;
	instructions?: string;
}

declare global {
	interface Phone {
		showKeyboard: (params: {
			inputData: inputData;
			hideCancel?: boolean;
			validationOptions?: {
				isEmpty?: boolean;
			};
			onSubmit: (value: ExpectedAny, { dismiss }: { dismiss: FixableAny }) => void;
			onCancel?: ({ dismiss }: { dismiss: FixableAny }) => void;
			validationFunc?: (value: ExpectedAny) => string | boolean;
		}) => void;
	}
}
