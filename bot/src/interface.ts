export interface DeeplResponseType {
	translations: Array<{
		detected_source_language: string;
		text: string;
	}>;
}
