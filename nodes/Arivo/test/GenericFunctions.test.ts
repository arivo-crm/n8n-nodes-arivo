import { arivoApiRequest, arivoApiRequestAllItems } from '../GenericFunctions';
import { createMockExecuteFunction } from './helpers';

// Mock the n8n-workflow module
const mockRequestWithAuthentication = jest.fn();

jest.mock('n8n-workflow', () => ({
	NodeApiError: class extends Error {
		constructor(node: any, error: any) {
			super(error.message || 'API Error');
			this.name = 'NodeApiError';
		}
	},
}));

describe('GenericFunctions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Set up default mock behavior
		mockRequestWithAuthentication.mockResolvedValue({
			id: 123,
			name: 'Test Response',
		});
	});

	describe('arivoApiRequest', () => {
		it('should make a successful API request', async () => {
			const expectedResponse = {
				id: 123,
				name: 'John Doe',
				contact_type: 'person',
			};

			mockRequestWithAuthentication.mockResolvedValue(expectedResponse);

			const mockExecuteFunction = createMockExecuteFunction({});
			mockExecuteFunction.helpers.requestWithAuthentication = mockRequestWithAuthentication;

			const result = await arivoApiRequest.call(
				mockExecuteFunction,
				'GET',
				'/contacts/123',
			);

			expect(mockRequestWithAuthentication).toHaveBeenCalledTimes(1);
			expect(mockRequestWithAuthentication).toHaveBeenCalledWith('arivoApi', {
				method: 'GET',
				body: {},
				qs: {},
				url: 'https://test.arivo.com.br/api/v2/contacts/123',
				headers: {
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual(expectedResponse);
		});

		it('should make API request with custom base URL from credentials', async () => {
			const mockExecuteFunction = createMockExecuteFunction({});
			mockExecuteFunction.helpers.requestWithAuthentication = mockRequestWithAuthentication;
			
			// Override the credentials to use a custom URL
			mockExecuteFunction.getCredentials = jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				apiUrl: 'https://custom.arivo.com/api/v2',
			});

			await arivoApiRequest.call(
				mockExecuteFunction,
				'GET',
				'/contacts',
			);

			expect(mockRequestWithAuthentication).toHaveBeenCalledWith('arivoApi', {
				method: 'GET',
				body: {},
				qs: {},
				url: 'https://custom.arivo.com/api/v2/contacts',
				headers: {
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should make API request with body and query parameters', async () => {
			const body = {
				name: 'John Doe',
				contact_type: 'person',
			};

			const query = {
				per_page: 20,
				sort_field: 'created_at',
			};

			const mockExecuteFunction = createMockExecuteFunction({});
			mockExecuteFunction.helpers.requestWithAuthentication = mockRequestWithAuthentication;

			await arivoApiRequest.call(
				mockExecuteFunction,
				'POST',
				'/contacts',
				body,
				query,
			);

			expect(mockRequestWithAuthentication).toHaveBeenCalledWith('arivoApi', {
				method: 'POST',
				body,
				qs: query,
				url: 'https://test.arivo.com.br/api/v2/contacts',
				headers: {
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle additional options', async () => {
			const options = {
				resolveWithFullResponse: true,
				timeout: 30000,
			};

			const mockExecuteFunction = createMockExecuteFunction({});
			mockExecuteFunction.helpers.requestWithAuthentication = mockRequestWithAuthentication;

			await arivoApiRequest.call(
				mockExecuteFunction,
				'GET',
				'/contacts',
				{},
				{},
				options,
			);

			expect(mockRequestWithAuthentication).toHaveBeenCalledWith('arivoApi', {
				method: 'GET',
				body: {},
				qs: {},
				url: 'https://test.arivo.com.br/api/v2/contacts',
				headers: {
					'Content-Type': 'application/json',
				},
				json: true,
				resolveWithFullResponse: true,
				timeout: 30000,
			});
		});

		it('should retry on 429 error with retry-after header', async () => {
			const error429 = {
				statusCode: 429,
				response: {
					headers: {
						'retry-after': '2',
					},
				},
			};

			const successResponse = { id: 123, name: 'Success' };

			mockRequestWithAuthentication
				.mockRejectedValueOnce(error429)
				.mockResolvedValue(successResponse);

			const mockExecuteFunction = createMockExecuteFunction({});
			mockExecuteFunction.helpers.requestWithAuthentication = mockRequestWithAuthentication;

			// Mock setTimeout to resolve immediately for testing
			const originalSetTimeout = global.setTimeout;
			global.setTimeout = jest.fn().mockImplementation((callback) => {
				callback();
				return {} as any;
			}) as any;

			const result = await arivoApiRequest.call(
				mockExecuteFunction,
				'GET',
				'/contacts',
			);

			expect(mockRequestWithAuthentication).toHaveBeenCalledTimes(2);
			expect(result).toEqual(successResponse);

			// Restore original setTimeout
			global.setTimeout = originalSetTimeout;
		});

		it('should retry on 429 error with x-ratelimit-reset header', async () => {
			const error429 = {
				statusCode: 429,
				response: {
					headers: {
						'x-ratelimit-reset': '1672531200', // Unix timestamp
					},
				},
			};

			const successResponse = { id: 123, name: 'Success' };

			mockRequestWithAuthentication
				.mockRejectedValueOnce(error429)
				.mockResolvedValue(successResponse);

			const mockExecuteFunction = createMockExecuteFunction({});
			mockExecuteFunction.helpers.requestWithAuthentication = mockRequestWithAuthentication;

			// Mock setTimeout to resolve immediately for testing
			const originalSetTimeout = global.setTimeout;
			global.setTimeout = jest.fn().mockImplementation((callback) => {
				callback();
				return {} as any;
			}) as any;

			const result = await arivoApiRequest.call(
				mockExecuteFunction,
				'GET',
				'/contacts',
			);

			expect(mockRequestWithAuthentication).toHaveBeenCalledTimes(2);
			expect(result).toEqual(successResponse);

			// Restore original setTimeout
			global.setTimeout = originalSetTimeout;
		});

		it('should exhaust retries and throw error after 3 429 errors', async () => {
			const error429 = {
				statusCode: 429,
				response: {
					headers: {
						'retry-after': '1',
					},
				},
			};

			mockRequestWithAuthentication.mockRejectedValue(error429);

			const mockExecuteFunction = createMockExecuteFunction({});
			mockExecuteFunction.helpers.requestWithAuthentication = mockRequestWithAuthentication;

			// Mock setTimeout to resolve immediately for testing
			const originalSetTimeout = global.setTimeout;
			global.setTimeout = jest.fn().mockImplementation((callback) => {
				callback();
				return {} as any;
			}) as any;

			await expect(arivoApiRequest.call(
				mockExecuteFunction,
				'GET',
				'/contacts',
			)).rejects.toThrow('Could not complete API request. Maximum number of rate-limit retries reached.');

			expect(mockRequestWithAuthentication).toHaveBeenCalledTimes(3);

			// Restore original setTimeout
			global.setTimeout = originalSetTimeout;
		});

		it('should throw NodeApiError for non-429 errors', async () => {
			const apiError = {
				statusCode: 404,
				message: 'Not Found',
			};

			mockRequestWithAuthentication.mockRejectedValue(apiError);

			const mockExecuteFunction = createMockExecuteFunction({});
			mockExecuteFunction.helpers.requestWithAuthentication = mockRequestWithAuthentication;

			await expect(arivoApiRequest.call(
				mockExecuteFunction,
				'GET',
				'/contacts/999',
			)).rejects.toThrow();

			expect(mockRequestWithAuthentication).toHaveBeenCalledTimes(1);
		});
	});

	describe('arivoApiRequestAllItems', () => {
		it('should fetch all items with pagination', async () => {
			const page1Response = {
				body: [
					{ id: 1, name: 'Person 1' },
					{ id: 2, name: 'Person 2' },
				],
				headers: {
					'x-next-page': 'https://arivo.com.br/api/v2/contacts?page=2',
				},
			};

			const page2Response = {
				body: [
					{ id: 3, name: 'Person 3' },
				],
				headers: {
					'x-next-page': null,
				},
			};

			mockRequestWithAuthentication
				.mockResolvedValueOnce(page1Response)
				.mockResolvedValueOnce(page2Response);

			const mockExecuteFunction = createMockExecuteFunction({
				returnAll: true,
			});
			mockExecuteFunction.helpers.requestWithAuthentication = mockRequestWithAuthentication;

			const result = await arivoApiRequestAllItems.call(
				mockExecuteFunction,
				'GET',
				'/contacts',
				{},
				{ contact_type: 'person' },
			);

			expect(mockRequestWithAuthentication).toHaveBeenCalledTimes(2);
			expect(result).toEqual([
				{ id: 1, name: 'Person 1' },
				{ id: 2, name: 'Person 2' },
				{ id: 3, name: 'Person 3' },
			]);
		});

		it('should respect limit when returnAll is false', async () => {
			const response = {
				body: [
					{ id: 1, name: 'Person 1' },
					{ id: 2, name: 'Person 2' },
					{ id: 3, name: 'Person 3' },
				],
				headers: {
					'x-next-page': null,
				},
			};

			mockRequestWithAuthentication.mockResolvedValue(response);

			const mockExecuteFunction = createMockExecuteFunction({
				returnAll: false,
				limit: 2,
			});
			mockExecuteFunction.helpers.requestWithAuthentication = mockRequestWithAuthentication;

			const result = await arivoApiRequestAllItems.call(
				mockExecuteFunction,
				'GET',
				'/contacts',
			);

			expect(result).toHaveLength(2);
			expect(result).toEqual([
				{ id: 1, name: 'Person 1' },
				{ id: 2, name: 'Person 2' },
			]);
		});

		it('should handle rate limiting with proactive waiting', async () => {
			const response = {
				body: [
					{ id: 1, name: 'Person 1' },
				],
				headers: {
					'x-ratelimit-remaining': '3', // Low remaining requests
					'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 60), // Reset in 60 seconds
					'x-next-page': 'https://arivo.com.br/api/v2/contacts?page=2',
				},
			};

			const response2 = {
				body: [
					{ id: 2, name: 'Person 2' },
				],
				headers: {
					'x-next-page': null,
				},
			};

			mockRequestWithAuthentication
				.mockResolvedValueOnce(response)
				.mockResolvedValueOnce(response2);

			const mockExecuteFunction = createMockExecuteFunction({
				returnAll: true,
			});
			mockExecuteFunction.helpers.requestWithAuthentication = mockRequestWithAuthentication;

			// Mock setTimeout to resolve immediately for testing
			const originalSetTimeout = global.setTimeout;
			global.setTimeout = jest.fn().mockImplementation((callback) => {
				callback();
				return {} as any;
			}) as any;

			const result = await arivoApiRequestAllItems.call(
				mockExecuteFunction,
				'GET',
				'/contacts',
			);

			expect(mockRequestWithAuthentication).toHaveBeenCalledTimes(2);
			expect(result).toEqual([
				{ id: 1, name: 'Person 1' },
				{ id: 2, name: 'Person 2' },
			]);

			// Restore original setTimeout
			global.setTimeout = originalSetTimeout;
		});

		it('should handle different response formats', async () => {
			const dataResponse = {
				body: {
					data: [
						{ id: 1, name: 'Person 1' },
					],
				},
				headers: {
					'x-next-page': null,
				},
			};

			mockRequestWithAuthentication.mockResolvedValue(dataResponse);

			const mockExecuteFunction = createMockExecuteFunction({
				returnAll: true,
			});
			mockExecuteFunction.helpers.requestWithAuthentication = mockRequestWithAuthentication;

			const result = await arivoApiRequestAllItems.call(
				mockExecuteFunction,
				'GET',
				'/contacts',
			);

			expect(result).toEqual([
				{ id: 1, name: 'Person 1' },
			]);
		});
	});
});
