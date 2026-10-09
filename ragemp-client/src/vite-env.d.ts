/// <reference types="vite/client" />

interface Window {
	rpc: typeof import('rage-rpc');
}

declare const __CLIENT_VERSION__: string;
declare const __LOGZ__KEY__: string;
declare const __LOGZ__HOST__: string;
declare const __ENVIRONMENT__: string;
declare const __AMPLITUDE_KEY__: string;
declare const __DEV_LANGUAGE__: string;
declare const __DEV_USERNAME__: string;
declare const __ASSETS__: string;
declare const __PANEL_API__: string;
declare const __VESPIFY_API__: string;
declare const __VESPIFY_KEY__: string;
