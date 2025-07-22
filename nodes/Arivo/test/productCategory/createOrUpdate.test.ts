import * as productCategoryOperations from '../../ProductCategoryOperations';
import { createMockExecuteFunction } from '../helpers';
import { arivoApiRequest, arivoApiRequestAllItems } from '../../GenericFunctions';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
	arivoApiRequestAllItems: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;
const mockArivoApiRequestAllItems = arivoApiRequestAllItems as jest.MockedFunction<typeof arivoApiRequestAllItems>;

// Mock product category data for testing
const mockProductCategoryData = {
	id: '1',
	object: 'product_category',
	name: 'Test Category',
	code: 'TC001',
	created_at: '2024-01-15T10:30:00-03:00',
	updated_at: '2024-01-15T10:30:00-03:00',
};

describe('Arivo ProductCategory CreateOrUpdate Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Create new product category (no existing match)', () => {
		it('should create a new product category when no match found by name', async () => {
			const nodeParameters = {
				categoryName: 'New Category',
				matchField: 'name',
				additionalFields: {
					code: 'NC001',
				},
			};

			const expectedRequestBody = {
				name: 'New Category',
				code: 'NC001',
			};

			const expectedNewCategory = {
				...mockProductCategoryData,
				name: 'New Category',
				code: 'NC001',
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(expectedNewCategory);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productCategoryOperations.createOrUpdateProductCategory.call(mockExecuteFunction, 0);

			// Verify search was performed
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/product_categories',
				{},
				{ name: 'New Category' }
			);

			// Verify creation was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/product_categories', expectedRequestBody);

			// Verify result includes operation metadata
			expect(result).toEqual({
				...expectedNewCategory,
				__n8n_operation: 'created',
			});
		});

		it('should create a new product category when no match found by code', async () => {
			const nodeParameters = {
				categoryName: 'Code Category',
				matchField: 'code',
				additionalFields: {
					code: 'CC001',
				},
			};

			const expectedRequestBody = {
				name: 'Code Category',
				code: 'CC001',
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockProductCategoryData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productCategoryOperations.createOrUpdateProductCategory.call(mockExecuteFunction, 0);

			// Verify search was performed with code
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/product_categories',
				{},
				{ code: 'CC001' }
			);

			// Verify creation was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/product_categories', expectedRequestBody);

			expect(result.__n8n_operation).toBe('created');
		});
	});

	describe('Update existing product category (match found)', () => {
		it('should update existing product category when match found by name', async () => {
			const existingCategory = {
				id: '123',
				name: 'Existing Category',
				code: 'EXIST001',
			};

			const nodeParameters = {
				categoryName: 'Existing Category',
				matchField: 'name',
				additionalFields: {
					code: 'UPDATED001',
				},
			};

			const expectedRequestBody = {
				name: 'Existing Category',
				code: 'UPDATED001',
			};

			const expectedUpdatedCategory = {
				...existingCategory,
				code: 'UPDATED001',
			};

			// Mock search returning existing category
			mockArivoApiRequestAllItems.mockResolvedValue([existingCategory]);
			// Mock update
			mockArivoApiRequest.mockResolvedValue(expectedUpdatedCategory);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productCategoryOperations.createOrUpdateProductCategory.call(mockExecuteFunction, 0);

			// Verify search was performed
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/product_categories',
				{},
				{ name: 'Existing Category' }
			);

			// Verify update was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/product_categories/123', expectedRequestBody);

			// Verify result includes operation metadata
			expect(result).toEqual({
				...expectedUpdatedCategory,
				__n8n_operation: 'updated',
			});
		});

		it('should update existing product category when match found by code', async () => {
			const existingCategory = {
				id: '456',
				name: 'Code Category',
				code: 'CODE123',
			};

			const nodeParameters = {
				categoryName: 'Updated Code Category',
				matchField: 'code',
				additionalFields: {
					code: 'CODE123',
				},
			};

			// Mock search returning existing category
			mockArivoApiRequestAllItems.mockResolvedValue([existingCategory]);
			// Mock update
			mockArivoApiRequest.mockResolvedValue({
				...existingCategory,
				name: 'Updated Code Category',
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productCategoryOperations.createOrUpdateProductCategory.call(mockExecuteFunction, 0);

			// Verify search was performed with code
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/product_categories',
				{},
				{ code: 'CODE123' }
			);

			// Verify update was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/product_categories/456', expect.objectContaining({
				name: 'Updated Code Category',
				code: 'CODE123',
			}));

			expect(result.__n8n_operation).toBe('updated');
		});
	});

	describe('Edge cases and error handling', () => {
		it('should create new product category when search value is missing for code match', async () => {
			const nodeParameters = {
				categoryName: 'No Code Category',
				matchField: 'code',
				additionalFields: {
					// No code provided
				},
			};

			// Mock creation (search should be skipped)
			mockArivoApiRequest.mockResolvedValue(mockProductCategoryData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productCategoryOperations.createOrUpdateProductCategory.call(mockExecuteFunction, 0);

			// Verify search was NOT performed since no code was provided
			expect(mockArivoApiRequestAllItems).not.toHaveBeenCalled();

			// Verify creation was performed instead
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/product_categories', expect.objectContaining({
				name: 'No Code Category',
			}));

			expect(result.__n8n_operation).toBe('created');
		});

		it('should create new product category when search fails due to API error', async () => {
			const nodeParameters = {
				categoryName: 'Search Error Category',
				matchField: 'name',
				additionalFields: {
					code: 'ERROR001',
				},
			};

			// Mock search throwing an error
			mockArivoApiRequestAllItems.mockRejectedValue(new Error('API Search Error'));
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockProductCategoryData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productCategoryOperations.createOrUpdateProductCategory.call(mockExecuteFunction, 0);

			// Verify search was attempted
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/product_categories',
				{},
				{ name: 'Search Error Category' }
			);

			// Verify creation was performed as fallback
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/product_categories', expect.objectContaining({
				name: 'Search Error Category',
				code: 'ERROR001',
			}));

			expect(result.__n8n_operation).toBe('created');
		});

		it('should handle product category with minimal fields', async () => {
			const nodeParameters = {
				categoryName: 'Minimal Category',
				matchField: 'name',
				additionalFields: {
					// Only name is provided, no additional fields
				},
			};

			const expectedRequestBody = {
				name: 'Minimal Category',
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue({
				...mockProductCategoryData,
				name: 'Minimal Category',
				code: null,
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productCategoryOperations.createOrUpdateProductCategory.call(mockExecuteFunction, 0);

			// Verify creation was performed with minimal fields
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/product_categories', expectedRequestBody);

			expect(result.__n8n_operation).toBe('created');
		});

		it('should handle multiple matches and select the first one', async () => {
			const firstCategory = {
				id: '123',
				name: 'Duplicate Category',
				code: 'DUP001',
			};
			const secondCategory = {
				id: '124',
				name: 'Duplicate Category',
				code: 'DUP002',
			};

			const nodeParameters = {
				categoryName: 'Duplicate Category',
				matchField: 'name',
				additionalFields: {
					code: 'UPDATED_DUP',
				},
			};

			// Mock search returning multiple results
			mockArivoApiRequestAllItems.mockResolvedValue([firstCategory, secondCategory]);
			// Mock update on the first result
			mockArivoApiRequest.mockResolvedValue({
				...firstCategory,
				code: 'UPDATED_DUP',
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productCategoryOperations.createOrUpdateProductCategory.call(mockExecuteFunction, 0);

			// Verify update was performed on the first match
			expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/product_categories/123', expect.objectContaining({
				name: 'Duplicate Category',
				code: 'UPDATED_DUP',
			}));

			expect(result.__n8n_operation).toBe('updated');
		});

		it('should preserve all additional fields during update', async () => {
			const existingCategory = {
				id: '789',
				name: 'Complex Category',
				code: 'COMPLEX001',
			};

			const nodeParameters = {
				categoryName: 'Complex Category Updated',
				matchField: 'name',
				additionalFields: {
					code: 'COMPLEX_UPDATED',
					customField1: 'Custom Value 1',
					customField2: 'Custom Value 2',
				},
			};

			const expectedRequestBody = {
				name: 'Complex Category Updated',
				code: 'COMPLEX_UPDATED',
				customField1: 'Custom Value 1',
				customField2: 'Custom Value 2',
			};

			// Mock search returning existing category
			mockArivoApiRequestAllItems.mockResolvedValue([{ ...existingCategory, name: 'Complex Category' }]);
			// Mock update
			mockArivoApiRequest.mockResolvedValue({
				...existingCategory,
				...expectedRequestBody,
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productCategoryOperations.createOrUpdateProductCategory.call(mockExecuteFunction, 0);

			// Verify all fields are included in update
			expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/product_categories/789', expectedRequestBody);

			expect(result.__n8n_operation).toBe('updated');
		});

		it('should handle empty search results array correctly', async () => {
			const nodeParameters = {
				categoryName: 'Empty Results Category',
				matchField: 'name',
				additionalFields: {
					code: 'EMPTY001',
				},
			};

			// Mock search returning empty array (not null or undefined)
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockProductCategoryData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productCategoryOperations.createOrUpdateProductCategory.call(mockExecuteFunction, 0);

			// Verify creation was performed since no matches were found
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/product_categories', expect.objectContaining({
				name: 'Empty Results Category',
				code: 'EMPTY001',
			}));

			expect(result.__n8n_operation).toBe('created');
		});

		it('should handle null search results correctly', async () => {
			const nodeParameters = {
				categoryName: 'Null Results Category',
				matchField: 'name',
				additionalFields: {
					code: 'NULL001',
				},
			};

			// Mock search returning null
			mockArivoApiRequestAllItems.mockResolvedValue(null as any);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockProductCategoryData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productCategoryOperations.createOrUpdateProductCategory.call(mockExecuteFunction, 0);

			// Verify creation was performed since search returned null
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/product_categories', expect.objectContaining({
				name: 'Null Results Category',
				code: 'NULL001',
			}));

			expect(result.__n8n_operation).toBe('created');
		});
	});
});