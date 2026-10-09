import { logError } from '@/utils/helpers';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
	children?: ReactNode;
}

interface State {
	hasError: boolean;
}

// Components
import ErrorScreen from './components/errorScreen';

class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		// The initial state
		this.state = {
			hasError: false
		};

		// Being able to clear this error
		this.clearError = this.clearError.bind(this);
	}

	public static getDerivedStateFromError(_: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		logError(`phone.crashBoundary`, error, { errorInfo });
	}

	public clearError() {
		this.setState({ hasError: false });
	}

	public render() {
		if (this.state.hasError) {
			return <ErrorScreen clearError={this.clearError} />;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
