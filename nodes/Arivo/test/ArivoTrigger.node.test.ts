import { ArivoTrigger } from '../ArivoTrigger.node';
import { createMockHookFunction } from './helpers';
import { IWebhookFunctions } from 'n8n-workflow';

describe('ArivoTrigger Node', () => {
	let arivoTrigger: ArivoTrigger;

	beforeEach(() => {
		arivoTrigger = new ArivoTrigger();
		jest.clearAllMocks();
	});

	describe('Node Properties', () => {
		it('should have correct node properties', () => {
			expect(arivoTrigger.description.displayName).toBe('Arivo Trigger');
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
				name: 'Contact Created',
				value: 'contact.created',
			});
			expect(eventProperty?.options).toContainEqual({
				name: 'Contact Updated',
				value: 'contact.updated',
			});
			expect(eventProperty?.options).toContainEqual({
				name: 'Contact Deleted',
				value: 'contact.deleted',
			});
		});
	});

	describe('Webhook Methods', () => {
		describe('checkExists', () => {
			it('should return true if webhook already exists', async () => {
				const nodeParameters = {
					event: 'contact.created',
				};

				const webhookUrl = 'https://test-webhook.n8n.cloud/webhook/default';
				const webhookData = {};
				const mockHookFunction = createMockHookFunction(nodeParameters);
				mockHookFunction.getNodeWebhookUrl = jest.fn().mockReturnValue(webhookUrl);
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue(webhookData);

				// Mock helpers.request (not arivoApiRequest) as that's what ArivoTrigger uses
				const mockRequest = jest.fn().mockResolvedValue({
					data: [
						{
							id: '123',
							url: webhookUrl,
							events: ['contact.created'],
							active: true,
						},
					],
				});
				mockHookFunction.helpers.request = mockRequest;

				const result = await arivoTrigger.webhookMethods!.default.checkExists!.call(
					mockHookFunction,
				);

				expect(result).toBe(true);
				expect(mockRequest).toHaveBeenCalledWith({
					method: 'GET',
					url: '/webhooks',
				});
				expect(webhookData).toHaveProperty('webhookId', '123');
			});

			it('should return false if webhook does not exist', async () => {
				const nodeParameters = {
					event: 'contact.created',
				};

				const webhookUrl = 'https://test-webhook.n8n.cloud/webhook/default';
				const mockHookFunction = createMockHookFunction(nodeParameters);
				mockHookFunction.getNodeWebhookUrl = jest.fn().mockReturnValue(webhookUrl);
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue({});

				// Mock helpers.request with no matching webhook
				const mockRequest = jest.fn().mockResolvedValue({
					data: [
						{
							id: '456',
							url: 'https://other-webhook.example.com',
							events: ['deal.created'],
							active: true,
						},
					],
				});
				mockHookFunction.helpers.request = mockRequest;

				const result = await arivoTrigger.webhookMethods!.default.checkExists!.call(
					mockHookFunction,
				);

				expect(result).toBe(false);
			});

			it('should return false if no webhooks exist', async () => {
				const nodeParameters = {
					event: 'contact.created',
				};

				const mockHookFunction = createMockHookFunction(nodeParameters);
				mockHookFunction.getNodeWebhookUrl = jest.fn().mockReturnValue('https://test-webhook.n8n.cloud/webhook/default');
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue({});

				// Mock helpers.request with empty data
				const mockRequest = jest.fn().mockResolvedValue({ data: [] });
				mockHookFunction.helpers.request = mockRequest;

				const result = await arivoTrigger.webhookMethods!.default.checkExists!.call(
					mockHookFunction,
				);

				expect(result).toBe(false);
			});
		});

		describe('create', () => {
			it('should create a new webhook', async () => {
				const nodeParameters = {
					event: 'contact.created',
				};

				const webhookUrl = 'https://test-webhook.n8n.cloud/webhook/default';
				const webhookData = {};
				const mockHookFunction = createMockHookFunction(nodeParameters);
				mockHookFunction.getNodeWebhookUrl = jest.fn().mockReturnValue(webhookUrl);
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue(webhookData);

				const expectedWebhookData = {
					id: '789',
					url: webhookUrl,
					event: 'contact.created',
					active: true,
				};

				// Mock helpers.request (not arivoApiRequest)
				const mockRequest = jest.fn().mockResolvedValue(expectedWebhookData);
				mockHookFunction.helpers.request = mockRequest;

				const result = await arivoTrigger.webhookMethods!.default.create!.call(
					mockHookFunction,
				);

				expect(result).toBe(true);
				expect(mockRequest).toHaveBeenCalledWith({
					method: 'POST',
					url: '/webhooks',
					body: {
						url: webhookUrl,
						event: 'contact.created',
					},
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
					url: webhookUrl,
					event: 'contact.deleted',
					active: true,
				};

				// Mock helpers.request (not arivoApiRequest)
				const mockRequest = jest.fn().mockResolvedValue(expectedWebhookData);
				mockHookFunction.helpers.request = mockRequest;

				const result = await arivoTrigger.webhookMethods!.default.create!.call(
					mockHookFunction,
				);

				expect(result).toBe(true);
				expect(mockRequest).toHaveBeenCalledWith({
					method: 'POST',
					url: '/webhooks',
					body: {
						url: webhookUrl,
						event: 'contact.deleted',
					},
				});
			});
		});

		describe('delete', () => {
			it('should delete existing webhook', async () => {
				const nodeParameters = {
					event: 'contact.created',
				};

				const mockHookFunction = createMockHookFunction(nodeParameters);
				const staticData = { webhookId: '123' };
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue(staticData);

				// Mock helpers.request (not arivoApiRequest)
				const mockRequest = jest.fn().mockResolvedValue({ success: true });
				mockHookFunction.helpers.request = mockRequest;

				const result = await arivoTrigger.webhookMethods!.default.delete!.call(
					mockHookFunction,
				);

				expect(result).toBe(true);
				expect(mockRequest).toHaveBeenCalledWith({
					method: 'DELETE',
					url: '/webhooks/123',
				});
			});

			it('should handle missing webhook ID gracefully', async () => {
				const nodeParameters = {
					event: 'contact.created',
				};

				const mockHookFunction = createMockHookFunction(nodeParameters);
				mockHookFunction.getWorkflowStaticData = jest.fn().mockReturnValue({});

				// Mock helpers.request
				const mockRequest = jest.fn();
				mockHookFunction.helpers.request = mockRequest;

				const result = await arivoTrigger.webhookMethods!.default.delete!.call(
					mockHookFunction,
				);

				expect(result).toBe(true);
				expect(mockRequest).not.toHaveBeenCalled();
			});
		});
	});

	describe('Webhook Execution', () => {
		it('should process contact.created webhook payload', async () => {
			const mockWebhookFunction = {
				getBodyData: jest.fn().mockReturnValue({
					event: 'contact.created',
					data: {
						id: 123,
						name: 'John Doe',
						contact_type: 'person',
						email: 'john.doe@example.com',
					},
				}),
				getHeaderData: jest.fn().mockReturnValue({
					'x-arivo-event': 'contact.created',
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
								event: 'contact.created',
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