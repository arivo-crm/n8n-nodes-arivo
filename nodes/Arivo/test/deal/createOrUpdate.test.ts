import * as dealOperations from '../../DealOperations';
import { createMockExecuteFunction, mockDealData } from '../helpers';
import { arivoApiRequest, arivoApiRequestAllItems } from '../../GenericFunctions';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
	arivoApiRequestAllItems: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;
const mockArivoApiRequestAllItems = arivoApiRequestAllItems as jest.MockedFunction<typeof arivoApiRequestAllItems>;

describe('Arivo Deal CreateOrUpdate Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Create new deal (no existing match)', () => {
		it('should create a new deal when no match found by name', async () => {
			const nodeParameters = {
				dealName: 'New Deal',
				additionalFields: {
					description: 'A new business opportunity',
					value: 50000.00,
					company_id: '123',
					contact_id: '456',
					temperature: 'hot',
					estimated_close_date: '2024-06-30',
				},
			};

			const expectedRequestBody = {
				name: 'New Deal',
				description: 'A new business opportunity',
				value: 50000.00,
				company_id: '123',
				contact_id: '456',
				temperature: 'hot',
				estimated_close_date: '2024-06-30',
			};

			const expectedNewDeal = {
				...mockDealData,
				name: 'New Deal',
				description: 'A new business opportunity',
				value: 50000.00,
				company_id: '123',
				contact_id: '456',
				temperature: 'hot',
				estimated_close_date: '2024-06-30',
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(expectedNewDeal);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await dealOperations.createOrUpdateDeal.call(mockExecuteFunction, 0);

			// Verify search was performed by name
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/deals',
				{},
				{ name: 'New Deal' }
			);

			// Verify creation was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/deals', expectedRequestBody);

			// Verify result includes operation metadata
			expect(result).toEqual({
				...expectedNewDeal,
				__n8n_operation: 'created',
			});
		});

		it('should create a new deal with minimal fields', async () => {
			const nodeParameters = {
				dealName: 'Minimal Deal',
				additionalFields: {},
			};

			const expectedRequestBody = {
				name: 'Minimal Deal',
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue({
				...mockDealData,
				name: 'Minimal Deal',
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await dealOperations.createOrUpdateDeal.call(mockExecuteFunction, 0);

			// Verify creation was performed with minimal fields
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/deals', expectedRequestBody);

			expect(result.__n8n_operation).toBe('created');
		});
	});

	describe('Update existing deal (match found)', () => {
		it('should update existing deal when match found by name', async () => {
			const existingDeal = {
				id: '123',
				name: 'Existing Deal',
				description: 'Original description',
				value: 30000.00,
				temperature: 'warm',
			};

			const nodeParameters = {
				dealName: 'Existing Deal',
				additionalFields: {
					description: 'Updated description',
					value: 45000.00,
					temperature: 'hot',
					pipeline_step_id: '3',
				},
			};

			const expectedRequestBody = {
				name: 'Existing Deal',
				description: 'Updated description',
				value: 45000.00,
				temperature: 'hot',
				pipeline_step_id: '3',
			};

			const expectedUpdatedDeal = {
				...existingDeal,
				description: 'Updated description',
				value: 45000.00,
				temperature: 'hot',
				pipeline_step_id: '3',
			};

			// Mock search returning existing deal
			mockArivoApiRequestAllItems.mockResolvedValue([existingDeal]);
			// Mock update
			mockArivoApiRequest.mockResolvedValue(expectedUpdatedDeal);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await dealOperations.createOrUpdateDeal.call(mockExecuteFunction, 0);

			// Verify search was performed
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/deals',
				{},
				{ name: 'Existing Deal' }
			);

			// Verify update was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/deals/123', expectedRequestBody);

			// Verify result includes operation metadata
			expect(result).toEqual({
				...expectedUpdatedDeal,
				__n8n_operation: 'updated',
			});
		});

		it('should update existing deal with status change', async () => {
			const existingDeal = {
				id: '456',
				name: 'Status Change Deal',
				status: 'open',
				temperature: 'warm',
			};

			const nodeParameters = {
				dealName: 'Status Change Deal',
				additionalFields: {
					status: 'won',
					closed_at: '2024-03-15T10:30:00Z',
					temperature: 'hot',
				},
			};

			// Mock search returning existing deal
			mockArivoApiRequestAllItems.mockResolvedValue([existingDeal]);
			// Mock update
			mockArivoApiRequest.mockResolvedValue({
				...existingDeal,
				status: 'won',
				closed_at: '2024-03-15T10:30:00Z',
				temperature: 'hot',
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await dealOperations.createOrUpdateDeal.call(mockExecuteFunction, 0);

			// Verify update was performed with status change
			expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/deals/456', expect.objectContaining({
				name: 'Status Change Deal',
				status: 'won',
				closed_at: '2024-03-15T10:30:00Z',
				temperature: 'hot',
			}));

			expect(result.__n8n_operation).toBe('updated');
		});
	});

	describe('Edge cases and error handling', () => {
		it('should create new deal when search fails due to API error', async () => {
			const nodeParameters = {
				dealName: 'Search Error Deal',
				additionalFields: {
					description: 'Deal with search error',
					value: 25000.00,
				},
			};

			// Mock search throwing an error
			mockArivoApiRequestAllItems.mockRejectedValue(new Error('API Search Error'));
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockDealData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await dealOperations.createOrUpdateDeal.call(mockExecuteFunction, 0);

			// Verify search was attempted
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/deals',
				{},
				{ name: 'Search Error Deal' }
			);

			// Verify creation was performed as fallback
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/deals', expect.objectContaining({
				name: 'Search Error Deal',
				description: 'Deal with search error',
				value: 25000.00,
			}));

			expect(result.__n8n_operation).toBe('created');
		});

		it('should handle deal with complex data including custom fields and tags', async () => {
			const nodeParameters = {
				dealName: 'Complex Deal',
				additionalFields: {
					description: 'A complex deal with all fields',
					value: 75000.00,
					company_id: '789',
					contact_id: '101',
					status: 'open',
					temperature: 'hot',
					opened_at: '2024-01-15T09:00:00Z',
					estimated_close_date: '2024-04-15T00:00:00Z',
					pipeline_id: '2',
					pipeline_step_id: '4',
					customFieldsUi: {
						customFieldsValues: [
							{
								field: 'probability',
								value: '85%',
							},
							{
								field: 'source',
								value: 'referral',
							},
						],
					},
					tags: 'enterprise,high-value,priority',
				},
			};

			const expectedRequestBody = {
				name: 'Complex Deal',
				description: 'A complex deal with all fields',
				value: 75000.00,
				company_id: '789',
				contact_id: '101',
				status: 'open',
				temperature: 'hot',
				opened_at: '2024-01-15T09:00:00Z',
				estimated_close_date: '2024-04-15T00:00:00Z',
				pipeline_id: '2',
				pipeline_step_id: '4',
				custom_fields: {
					probability: '85%',
					source: 'referral',
				},
				tags: ['enterprise', 'high-value', 'priority'],
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue({
				...mockDealData,
				...expectedRequestBody,
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await dealOperations.createOrUpdateDeal.call(mockExecuteFunction, 0);

			// Verify creation was performed with all fields properly transformed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/deals', expectedRequestBody);

			expect(result.__n8n_operation).toBe('created');
		});

		it('should filter out empty custom fields', async () => {
			const nodeParameters = {
				dealName: 'Custom Fields Deal',
				additionalFields: {
					customFieldsUi: {
						customFieldsValues: [
							{
								field: 'valid_field',
								value: 'Valid Value',
							},
							{
								field: '', // Empty field name should be filtered out
								value: 'Some Value',
							},
							{
								field: 'another_field',
								value: '', // Empty value should be filtered out
							},
						],
					},
				},
			};

			const expectedRequestBody = {
				name: 'Custom Fields Deal',
				custom_fields: {
					valid_field: 'Valid Value',
				},
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockDealData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			await dealOperations.createOrUpdateDeal.call(mockExecuteFunction, 0);

			// Verify only valid custom fields were included
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/deals', expectedRequestBody);
		});

		it('should handle empty tags string correctly', async () => {
			const nodeParameters = {
				dealName: 'No Tags Deal',
				additionalFields: {
					tags: '', // Empty tags string should remain as empty string (gets filtered out by .filter(tag => tag !== ''))
					value: 35000.00,
				},
			};

			const expectedRequestBody = {
				name: 'No Tags Deal',
				value: 35000.00,
				tags: '', // Empty string stays as empty string since it's not processed by tag conversion
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockDealData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			await dealOperations.createOrUpdateDeal.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/deals', expectedRequestBody);
		});

		it('should handle tags with extra whitespace and empty elements', async () => {
			const nodeParameters = {
				dealName: 'Messy Tags Deal',
				additionalFields: {
					tags: ' enterprise , , high-value,  priority , ', // Messy tags with extra spaces and empty elements
					value: 65000.00,
				},
			};

			const expectedRequestBody = {
				name: 'Messy Tags Deal',
				value: 65000.00,
				tags: ['enterprise', 'high-value', 'priority'], // Cleaned up tags array
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockDealData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			await dealOperations.createOrUpdateDeal.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/deals', expectedRequestBody);
		});

		it('should handle multiple matches and select the first one', async () => {
			const firstDeal = {
				id: '111',
				name: 'Duplicate Deal',
				value: 40000.00,
			};
			const secondDeal = {
				id: '112',
				name: 'Duplicate Deal',
				value: 50000.00,
			};

			const nodeParameters = {
				dealName: 'Duplicate Deal',
				additionalFields: {
					description: 'Updated duplicate deal',
					value: 60000.00,
				},
			};

			// Mock search returning multiple results
			mockArivoApiRequestAllItems.mockResolvedValue([firstDeal, secondDeal]);
			// Mock update on the first result
			mockArivoApiRequest.mockResolvedValue({
				...firstDeal,
				description: 'Updated duplicate deal',
				value: 60000.00,
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await dealOperations.createOrUpdateDeal.call(mockExecuteFunction, 0);

			// Verify update was performed on the first match
			expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/deals/111', expect.objectContaining({
				name: 'Duplicate Deal',
				description: 'Updated duplicate deal',
				value: 60000.00,
			}));

			expect(result.__n8n_operation).toBe('updated');
		});

		it('should handle numeric string conversion for value field', async () => {
			const nodeParameters = {
				dealName: 'Numeric Deal',
				additionalFields: {
					value: '125000.50', // String number is passed as-is (no conversion in deal operations)
				},
			};

			const expectedRequestBody = {
				name: 'Numeric Deal',
				value: '125000.50', // Passed as string (no conversion logic in deal operations)
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockDealData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			await dealOperations.createOrUpdateDeal.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/deals', expectedRequestBody);
		});

		it('should handle empty search results array correctly', async () => {
			const nodeParameters = {
				dealName: 'Empty Results Deal',
				additionalFields: {
					value: 40000.00,
				},
			};

			// Mock search returning empty array (not null or undefined)
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockDealData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await dealOperations.createOrUpdateDeal.call(mockExecuteFunction, 0);

			// Verify creation was performed since no matches were found
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/deals', expect.objectContaining({
				name: 'Empty Results Deal',
				value: 40000.00,
			}));

			expect(result.__n8n_operation).toBe('created');
		});

		it('should handle null search results correctly', async () => {
			const nodeParameters = {
				dealName: 'Null Results Deal',
				additionalFields: {
					value: 30000.00,
				},
			};

			// Mock search returning null
			mockArivoApiRequestAllItems.mockResolvedValue(null as any);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockDealData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await dealOperations.createOrUpdateDeal.call(mockExecuteFunction, 0);

			// Verify creation was performed since search returned null
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/deals', expect.objectContaining({
				name: 'Null Results Deal',
				value: 30000.00,
			}));

			expect(result.__n8n_operation).toBe('created');
		});
	});
});