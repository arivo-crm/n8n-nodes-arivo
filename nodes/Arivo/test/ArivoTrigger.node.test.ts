import { ArivoTrigger } from '../ArivoTrigger.node';
import { createMockHookFunction } from './helpers';
import { IWebhookFunctions } from 'n8n-workflow';
import * as GenericFunctions from '../GenericFunctions';

// Mock the arivoApiRequest function
jest.mock('../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

describe('ArivoTrigger Node', () => {
	let arivoTrigger: ArivoTrigger;

	beforeEach(() => {
		arivoTrigger = new ArivoTrigger();
		jest.clearAllMocks();
		// Clear the mocked arivoApiRequest
		const mockApiRequest = GenericFunctions.arivoApiRequest as jest.MockedFunction<typeof GenericFunctions.arivoApiRequest>;
		mockApiRequest.mockReset();
	});

	describe('Node Properties', () => {
		it('should have correct node properties', () => {
			expect(arivoTrigger.description.displayName).toBe('Arivo CRM Trigger');
			expect(arivoTrigger.description.name).toBe('arivoTrigger');
			expect(arivoTrigger.description.group).toEqual(['trigger']);
			expect(arivoTrigger.description.version).toBe(1);
			expect(arivoTrigger.description.description).toBe('Starts the workflow when Arivo events occur');
		});

		it('should have correct credentials configuration', () => {
			expect(arivoTrigger.description.credentials).toEqual([
				{
					name: 'arivoApi',
					required: true,
				},
			]);
		});

		it('should have webhook configuration', () => {
			expect(arivoTrigger.description.webhooks).toHaveLength(1);
			expect(arivoTrigger.description.webhooks?.[0].name).toBe('default');
			expect(arivoTrigger.description.webhooks?.[0].httpMethod).toBe('POST');
			expect(arivoTrigger.description.webhooks?.[0].responseMode).toBe('onReceived');
			expect(arivoTrigger.description.webhooks?.[0].path).toBe('webhook');
		});

		it('should have correct event options', () => {
			const eventProperty = arivoTrigger.description.properties.find(
				(prop) => prop.name === 'event',
			);
			expect(eventProperty).toBeDefined();
			expect(eventProperty?.options).toContainEqual({
				name: 'Person Created',
				value: 'contact.person.created',
			});
			expect(eventProperty?.options).toContainEqual({
				name: 'Person Updated',
				value: 'contact.person.updated',
			});
			expect(eventProperty?.options).toContainEqual({
				name: 'Person Deleted',
				value: 'contact.person.deleted',
			});
			expect(eventProperty?.options).toContainEqual({
				name: 'Company Created',
				value: 'contact.company.created',
			});
			expect(eventProperty?.options).toContainEqual({
				name: 'Deal Created',
				value: 'deal.created',
			});
			expect(eventProperty?.options).toContainEqual({
				name: 'Deal Lost',
				value: 'deal.lost',
			});
			expect(eventProperty?.options).toContainEqual({
				name: 'Deal Reopened',
				value: 'deal.reopen',
			});
			expect(eventProperty?.options).toContainEqual({
				name: 'Deal Won',
				value: 'deal.won',
			});
			expect(eventProperty?.options).toContainEqual({
				name: 'Task Created',
				value: 'task.created',
			});
			expect(eventProperty?.options).toContainEqual({
				name: 'Note Created',
				value: 'note.created',
			});
		});
	});

	describe('Webhook Methods', () => {
		describe('checkExists', () => {
			it('should return true if webhook already exists', async () => {
				const nodeParameters = {
					event: 'contact.person.created',
				};

				const webhookUrl = 'https://test-webhook.n8n.cloud/webhook/default';
				const webhookData = {};
				const mockHookFunction = createMockHookFunction(nodeParameters);
				mockHookFunction.getNodeWebhookUrl = jest.fn().mockReturnValue(webhookUrl);
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue(webhookData);

				// Mock arivoApiRequest to return direct array (not wrapped in data)
				const mockApiRequest = GenericFunctions.arivoApiRequest as jest.MockedFunction<typeof GenericFunctions.arivoApiRequest>;
				mockApiRequest.mockResolvedValue([
					{
						id: '123',
						callback_url: webhookUrl,
						event: 'contact.person.created',
						status: 'active',
					},
				]);

				const result = await arivoTrigger.webhookMethods!.default.checkExists!.call(
					mockHookFunction,
				);

				expect(result).toBe(true);
				expect(mockApiRequest).toHaveBeenCalledWith('GET', '/webhooks');
				expect(webhookData).toHaveProperty('webhookId', '123');
			});

			it('should return false if webhook does not exist', async () => {
				const nodeParameters = {
					event: 'contact.person.created',
				};

				const webhookUrl = 'https://test-webhook.n8n.cloud/webhook/default';
				const mockHookFunction = createMockHookFunction(nodeParameters);
				mockHookFunction.getNodeWebhookUrl = jest.fn().mockReturnValue(webhookUrl);
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue({});

				// Mock arivoApiRequest with no matching webhook
				const mockApiRequest = GenericFunctions.arivoApiRequest as jest.MockedFunction<typeof GenericFunctions.arivoApiRequest>;
				mockApiRequest.mockResolvedValue([
					{
						id: '456',
						callback_url: 'https://other-webhook.example.com',
						event: 'deal.created',
						status: 'active',
					},
				]);

				const result = await arivoTrigger.webhookMethods!.default.checkExists!.call(
					mockHookFunction,
				);

				expect(result).toBe(false);
			});

			it('should return false if no webhooks exist', async () => {
				const nodeParameters = {
					event: 'contact.person.created',
				};

				const mockHookFunction = createMockHookFunction(nodeParameters);
				mockHookFunction.getNodeWebhookUrl = jest.fn().mockReturnValue('https://test-webhook.n8n.cloud/webhook/default');
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue({});

				// Mock arivoApiRequest with empty array
				const mockApiRequest = GenericFunctions.arivoApiRequest as jest.MockedFunction<typeof GenericFunctions.arivoApiRequest>;
				mockApiRequest.mockResolvedValue([]);

				const result = await arivoTrigger.webhookMethods!.default.checkExists!.call(
					mockHookFunction,
				);

				expect(result).toBe(false);
			});
		});

		describe('create', () => {
			it('should create a new webhook', async () => {
				const nodeParameters = {
					event: 'contact.person.created',
				};

				const webhookUrl = 'https://test-webhook.n8n.cloud/webhook/default';
				const webhookData = {};
				const mockHookFunction = createMockHookFunction(nodeParameters);
				mockHookFunction.getNodeWebhookUrl = jest.fn().mockReturnValue(webhookUrl);
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue(webhookData);

				const expectedWebhookData = {
					id: '789',
					callback_url: webhookUrl,
					event: 'contact.person.created',
					status: 'active',
				};

				// Mock arivoApiRequest
				const mockApiRequest = GenericFunctions.arivoApiRequest as jest.MockedFunction<typeof GenericFunctions.arivoApiRequest>;
				mockApiRequest.mockResolvedValue(expectedWebhookData);

				const result = await arivoTrigger.webhookMethods!.default.create!.call(
					mockHookFunction,
				);

				expect(result).toBe(true);
				expect(mockApiRequest).toHaveBeenCalledWith('POST', '/webhooks', {
					callback_url: webhookUrl,
					event: 'contact.person.created',
				});

				// Verify that webhook ID is stored in static data
				expect(webhookData).toHaveProperty('webhookId', '789');
			});

			it('should handle single event', async () => {
				const nodeParameters = {
					event: 'contact.deleted',
				};

				const webhookUrl = 'https://test-webhook.n8n.cloud/webhook/default';
				const webhookData = {};
				const mockHookFunction = createMockHookFunction(nodeParameters);
				mockHookFunction.getNodeWebhookUrl = jest.fn().mockReturnValue(webhookUrl);
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue(webhookData);

				const expectedWebhookData = {
					id: '101',
					callback_url: webhookUrl,
					event: 'contact.deleted',
					status: 'active',
				};

				// Mock arivoApiRequest
				const mockApiRequest = GenericFunctions.arivoApiRequest as jest.MockedFunction<typeof GenericFunctions.arivoApiRequest>;
				mockApiRequest.mockResolvedValue(expectedWebhookData);

				const result = await arivoTrigger.webhookMethods!.default.create!.call(
					mockHookFunction,
				);

				expect(result).toBe(true);
				expect(mockApiRequest).toHaveBeenCalledWith('POST', '/webhooks', {
					callback_url: webhookUrl,
					event: 'contact.deleted',
				});
			});

			it('should create webhook for deal.won event', async () => {
				const nodeParameters = {
					event: 'deal.won',
				};

				const webhookUrl = 'https://test-webhook.n8n.cloud/webhook/default';
				const webhookData = {};
				const mockHookFunction = createMockHookFunction(nodeParameters);
				mockHookFunction.getNodeWebhookUrl = jest.fn().mockReturnValue(webhookUrl);
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue(webhookData);

				const expectedWebhookData = {
					id: '201',
					callback_url: webhookUrl,
					event: 'deal.won',
					status: 'active',
				};

				// Mock arivoApiRequest
				const mockApiRequest = GenericFunctions.arivoApiRequest as jest.MockedFunction<typeof GenericFunctions.arivoApiRequest>;
				mockApiRequest.mockResolvedValue(expectedWebhookData);

				const result = await arivoTrigger.webhookMethods!.default.create!.call(
					mockHookFunction,
				);

				expect(result).toBe(true);
				expect(mockApiRequest).toHaveBeenCalledWith('POST', '/webhooks', {
					callback_url: webhookUrl,
					event: 'deal.won',
				});
				expect(webhookData).toHaveProperty('webhookId', '201');
			});

			it('should create webhook for deal.lost event', async () => {
				const nodeParameters = {
					event: 'deal.lost',
				};

				const webhookUrl = 'https://test-webhook.n8n.cloud/webhook/default';
				const webhookData = {};
				const mockHookFunction = createMockHookFunction(nodeParameters);
				mockHookFunction.getNodeWebhookUrl = jest.fn().mockReturnValue(webhookUrl);
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue(webhookData);

				const expectedWebhookData = {
					id: '202',
					callback_url: webhookUrl,
					event: 'deal.lost',
					status: 'active',
				};

				// Mock arivoApiRequest
				const mockApiRequest = GenericFunctions.arivoApiRequest as jest.MockedFunction<typeof GenericFunctions.arivoApiRequest>;
				mockApiRequest.mockResolvedValue(expectedWebhookData);

				const result = await arivoTrigger.webhookMethods!.default.create!.call(
					mockHookFunction,
				);

				expect(result).toBe(true);
				expect(mockApiRequest).toHaveBeenCalledWith('POST', '/webhooks', {
					callback_url: webhookUrl,
					event: 'deal.lost',
				});
				expect(webhookData).toHaveProperty('webhookId', '202');
			});

			it('should create webhook for deal.reopen event', async () => {
				const nodeParameters = {
					event: 'deal.reopen',
				};

				const webhookUrl = 'https://test-webhook.n8n.cloud/webhook/default';
				const webhookData = {};
				const mockHookFunction = createMockHookFunction(nodeParameters);
				mockHookFunction.getNodeWebhookUrl = jest.fn().mockReturnValue(webhookUrl);
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue(webhookData);

				const expectedWebhookData = {
					id: '203',
					callback_url: webhookUrl,
					event: 'deal.reopen',
					status: 'active',
				};

				// Mock arivoApiRequest
				const mockApiRequest = GenericFunctions.arivoApiRequest as jest.MockedFunction<typeof GenericFunctions.arivoApiRequest>;
				mockApiRequest.mockResolvedValue(expectedWebhookData);

				const result = await arivoTrigger.webhookMethods!.default.create!.call(
					mockHookFunction,
				);

				expect(result).toBe(true);
				expect(mockApiRequest).toHaveBeenCalledWith('POST', '/webhooks', {
					callback_url: webhookUrl,
					event: 'deal.reopen',
				});
				expect(webhookData).toHaveProperty('webhookId', '203');
			});
		});

		describe('delete', () => {
			it('should delete existing webhook', async () => {
				const nodeParameters = {
					event: 'contact.person.created',
				};

				const mockHookFunction = createMockHookFunction(nodeParameters);
				const staticData = { webhookId: '123' };
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue(staticData);

				// Mock arivoApiRequest
				const mockApiRequest = GenericFunctions.arivoApiRequest as jest.MockedFunction<typeof GenericFunctions.arivoApiRequest>;
				mockApiRequest.mockResolvedValue({ success: true });

				const result = await arivoTrigger.webhookMethods!.default.delete!.call(
					mockHookFunction,
				);

				expect(result).toBe(true);
				expect(mockApiRequest).toHaveBeenCalledWith('DELETE', '/webhooks/123');
			});

			it('should handle missing webhook ID gracefully', async () => {
				const nodeParameters = {
					event: 'contact.person.created',
				};

				const mockHookFunction = createMockHookFunction(nodeParameters);
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue({});

				// Mock arivoApiRequest
				const mockApiRequest = GenericFunctions.arivoApiRequest as jest.MockedFunction<typeof GenericFunctions.arivoApiRequest>;
				mockApiRequest.mockResolvedValue({ success: true });

				const result = await arivoTrigger.webhookMethods!.default.delete!.call(
					mockHookFunction,
				);

				expect(result).toBe(true);
				expect(mockApiRequest).not.toHaveBeenCalled();
			});
		});
	});

	describe('Webhook Execution', () => {
		it('should process contact.person.created webhook payload', async () => {
			const mockWebhookFunction = {
				getBodyData: jest.fn().mockReturnValue({
					event: 'contact.person.created',
					data: {
						id: 123,
						name: 'John Doe',
						contact_type: 'person',
						email: 'john.doe@example.com',
					},
				}),
				getHeaderData: jest.fn().mockReturnValue({
					'x-arivo-event': 'contact.person.created',
					'x-arivo-signature': 'test-signature',
				}),
				helpers: {
					returnJsonArray: jest.fn().mockImplementation((data) => 
						data.map((item: any) => ({ json: item }))
					),
				},
			} as unknown as IWebhookFunctions;

			const result = await arivoTrigger.webhook!.call(mockWebhookFunction);

			expect(result).toEqual({
				workflowData: [
					[
						{
							json: {
								event: 'contact.person.created',
								data: {
									id: 123,
									name: 'John Doe',
									contact_type: 'person',
									email: 'john.doe@example.com',
								},
							},
						},
					],
				],
			});
		});

		it('should process contact.updated webhook payload', async () => {
			const mockWebhookFunction = {
				getBodyData: jest.fn().mockReturnValue({
					event: 'contact.updated',
					data: {
						id: 123,
						name: 'John Updated',
						contact_type: 'person',
					},
				}),
				getHeaderData: jest.fn().mockReturnValue({
					'x-arivo-event': 'contact.updated',
				}),
				helpers: {
					returnJsonArray: jest.fn().mockImplementation((data) => 
						data.map((item: any) => ({ json: item }))
					),
				},
			} as unknown as IWebhookFunctions;

			const result = await arivoTrigger.webhook!.call(mockWebhookFunction);

			expect(result).toEqual({
				workflowData: [
					[
						{
							json: {
								event: 'contact.updated',
								data: {
									id: 123,
									name: 'John Updated',
									contact_type: 'person',
								},
							},
						},
					],
				],
			});
		});

		it('should process contact.deleted webhook payload', async () => {
			const mockWebhookFunction = {
				getBodyData: jest.fn().mockReturnValue({
					event: 'contact.deleted',
					data: {
						id: 123,
					},
				}),
				getHeaderData: jest.fn().mockReturnValue({
					'x-arivo-event': 'contact.deleted',
				}),
				helpers: {
					returnJsonArray: jest.fn().mockImplementation((data) => 
						data.map((item: any) => ({ json: item }))
					),
				},
			} as unknown as IWebhookFunctions;

			const result = await arivoTrigger.webhook!.call(mockWebhookFunction);

			expect(result).toEqual({
				workflowData: [
					[
						{
							json: {
								event: 'contact.deleted',
								data: {
									id: 123,
								},
							},
						},
					],
				],
			});
		});

		it('should process deal.won webhook payload', async () => {
			const mockWebhookFunction = {
				getBodyData: jest.fn().mockReturnValue({
					event: 'deal.won',
					data: {
						id: 456,
						name: 'Big Deal',
						status: 'won',
						value: '50000.00',
						closed_at: '2024-01-15T10:30:00-03:00',
					},
				}),
				getHeaderData: jest.fn().mockReturnValue({
					'x-arivo-event': 'deal.won',
				}),
				helpers: {
					returnJsonArray: jest.fn().mockImplementation((data) => 
						data.map((item: any) => ({ json: item }))
					),
				},
			} as unknown as IWebhookFunctions;

			const result = await arivoTrigger.webhook!.call(mockWebhookFunction);

			expect(result).toEqual({
				workflowData: [
					[
						{
							json: {
								event: 'deal.won',
								data: {
									id: 456,
									name: 'Big Deal',
									status: 'won',
									value: '50000.00',
									closed_at: '2024-01-15T10:30:00-03:00',
								},
							},
						},
					],
				],
			});
		});

		it('should process deal.lost webhook payload', async () => {
			const mockWebhookFunction = {
				getBodyData: jest.fn().mockReturnValue({
					event: 'deal.lost',
					data: {
						id: 789,
						name: 'Lost Opportunity',
						status: 'lost',
						value: '25000.00',
						closed_at: '2024-01-15T14:45:00-03:00',
					},
				}),
				getHeaderData: jest.fn().mockReturnValue({
					'x-arivo-event': 'deal.lost',
				}),
				helpers: {
					returnJsonArray: jest.fn().mockImplementation((data) => 
						data.map((item: any) => ({ json: item }))
					),
				},
			} as unknown as IWebhookFunctions;

			const result = await arivoTrigger.webhook!.call(mockWebhookFunction);

			expect(result).toEqual({
				workflowData: [
					[
						{
							json: {
								event: 'deal.lost',
								data: {
									id: 789,
									name: 'Lost Opportunity',
									status: 'lost',
									value: '25000.00',
									closed_at: '2024-01-15T14:45:00-03:00',
								},
							},
						},
					],
				],
			});
		});

		it('should process deal.reopen webhook payload', async () => {
			const mockWebhookFunction = {
				getBodyData: jest.fn().mockReturnValue({
					event: 'deal.reopen',
					data: {
						id: 321,
						name: 'Reopened Deal',
						status: 'open',
						value: '35000.00',
						closed_at: null,
					},
				}),
				getHeaderData: jest.fn().mockReturnValue({
					'x-arivo-event': 'deal.reopen',
				}),
				helpers: {
					returnJsonArray: jest.fn().mockImplementation((data) => 
						data.map((item: any) => ({ json: item }))
					),
				},
			} as unknown as IWebhookFunctions;

			const result = await arivoTrigger.webhook!.call(mockWebhookFunction);

			expect(result).toEqual({
				workflowData: [
					[
						{
							json: {
								event: 'deal.reopen',
								data: {
									id: 321,
									name: 'Reopened Deal',
									status: 'open',
									value: '35000.00',
									closed_at: null,
								},
							},
						},
					],
				],
			});
		});

		it('should handle empty webhook payload', async () => {
			const mockWebhookFunction = {
				getBodyData: jest.fn().mockReturnValue({}),
				getHeaderData: jest.fn().mockReturnValue({}),
				helpers: {
					returnJsonArray: jest.fn().mockImplementation((data) => 
						data.map((item: any) => ({ json: item }))
					),
				},
			} as unknown as IWebhookFunctions;

			const result = await arivoTrigger.webhook!.call(mockWebhookFunction);

			expect(result).toEqual({
				workflowData: [
					[
						{
							json: {},
						},
					],
				],
			});
		});
	});
});
