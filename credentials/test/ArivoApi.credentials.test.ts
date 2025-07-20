import { ArivoApi } from '../ArivoApi.credentials';

describe('ArivoApi Credentials', () => {
	let arivoApiCredentials: ArivoApi;

	beforeEach(() => {
		arivoApiCredentials = new ArivoApi();
	});

	describe('Credential Properties', () => {
		it('should have correct credential properties', () => {
			expect(arivoApiCredentials.name).toBe('arivoApi');
			expect(arivoApiCredentials.displayName).toBe('Arivo API');
			expect(arivoApiCredentials.documentationUrl).toBe('https://arivo.docs.apiary.io');
			expect(arivoApiCredentials.properties).toHaveLength(1);
		});

		it('should have API key property correctly configured', () => {
			const apiKeyProperty = arivoApiCredentials.properties[0];
			
			expect(apiKeyProperty.displayName).toBe('API Key');
			expect(apiKeyProperty.name).toBe('apiKey');
			expect(apiKeyProperty.type).toBe('string');
			expect(apiKeyProperty.typeOptions?.password).toBe(true);
			expect(apiKeyProperty.required).toBe(true);
			expect(apiKeyProperty.default).toBe('');
			expect(apiKeyProperty.placeholder).toBe('key1234567890abcdefkey1234567890');
		});
	});

	describe('Authentication', () => {
		it('should have correct authentication configuration', () => {
			expect(arivoApiCredentials.authenticate).toBeDefined();
			expect(arivoApiCredentials.authenticate.type).toBe('generic');
			expect(arivoApiCredentials.authenticate.properties).toBeDefined();
			expect(arivoApiCredentials.authenticate.properties.headers).toBeDefined();
		});

		it('should have correct authorization header template', () => {
			const authHeaders = arivoApiCredentials.authenticate.properties.headers;
			expect(authHeaders).toBeDefined();
			if (authHeaders) {
				expect(authHeaders['Authorization']).toBe('=Token token={{$credentials.apiKey}}');
				expect(authHeaders['Content-Type']).toBe('application/json');
			}
		});
	});

	describe('Test Endpoint', () => {
		it('should have correct test endpoint configuration', () => {
			expect(arivoApiCredentials.test).toBeDefined();
			expect(arivoApiCredentials.test.request).toBeDefined();
			expect(arivoApiCredentials.test.request.url).toBe('/teams?per_page=1');
		});
	});
});