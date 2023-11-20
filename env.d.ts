/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_URL: string;
	readonly VITE_API_KEY: string;
	readonly VITE_API_UPLOAD: string;
}

declare module '@kangc/v-md-editor/lib/preview';
declare module '@kangc/v-md-editor/lib/theme/github.js';