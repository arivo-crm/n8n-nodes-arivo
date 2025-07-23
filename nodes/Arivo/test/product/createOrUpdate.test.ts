import * as productOperations from '../../ProductOperations';
import { createMockExecuteFunction } from '../helpers';
import { arivoApiRequest, arivoApiRequestAllItems } from '../../GenericFunctions';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
	arivoApiRequestAllItems: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;
const mockArivoApiRequestAllItems = arivoApiRequestAllItems as jest.MockedFunction<typeof arivoApiRequestAllItems>;

// Mock product data for testing
const mockProductData = {
	id: '1',
	object: 'product',
	name: 'Test Product',
	code: 'TEST001',
	description: 'A test product',
	price: 99.99,
	available: true,
	product_category_id: '1',
	tags: ['test', 'sample'],
	created_at: '2024-01-15T10:30:00-03:00',
	updated_at: '2024-01-15T10:30:00-03:00',
};

describe('Arivo Product CreateOrUpdate Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Create new product (no existing match)', () => {
		it('should create a new product when no match found by name', async () => {
			const nodeParameters = {
				productName: 'New Product',
				matchField: 'name',
				additionalFields: {
					code: 'NEW001',
					description: 'A new product',
					price: 149.99,
					available: true,
				},
			};

			const expectedRequestBody = {
				name: 'New Product',
				code: 'NEW001',
				description: 'A new product',
				price: 149.99,
				available: true,
			};

			const expectedNewProduct = {
				...mockProductData,
				name: 'New Product',
				code: 'NEW001',
				description: 'A new product',
				price: 149.99,
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(expectedNewProduct);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productOperations.createOrUpdateProduct.call(mockExecuteFunction, 0);

			// Verify search was performed
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/products',
				{},
				{ name: 'New Product' }
			);

			// Verify creation was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', expectedRequestBody);

			// Verify result includes operation metadata
			expect(result).toEqual({
				...expectedNewProduct,
				__n8n_operation: 'created',
			});
		});

		it('should create a new product when no match found by code', async () => {
			const nodeParameters = {
				productName: 'Code Product',
				matchField: 'code',
				additionalFields: {
					code: 'CODE001',
					description: 'A product with code',
					price: 199.99,
				},
			};

			const expectedRequestBody = {
				name: 'Code Product',
				code: 'CODE001',
				description: 'A product with code',
				price: 199.99,
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockProductData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productOperations.createOrUpdateProduct.call(mockExecuteFunction, 0);

			// Verify search was performed with code
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/products',
				{},
				{ code: 'CODE001' }
			);

			// Verify creation was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', expectedRequestBody);

			expect(result.__n8n_operation).toBe('created');
		});
	});

	describe('Update existing product (match found)', () => {
		it('should update existing product when match found by name', async () => {
			const existingProduct = {
				id: '123',
				name: 'Existing Product',
				code: 'EXIST001',
				price: 99.99,
			};

			const nodeParameters = {
				productName: 'Existing Product',
				matchField: 'name',
				additionalFields: {
					description: 'Updated description',
					price: 129.99,
					available: false,
				},
			};

			const expectedRequestBody = {
				name: 'Existing Product',
				description: 'Updated description',
				price: 129.99,
				available: false,
			};

			const expectedUpdatedProduct = {
				...existingProduct,
				description: 'Updated description',
				price: 129.99,
				available: false,
			};

			// Mock search returning existing product
			mockArivoApiRequestAllItems.mockResolvedValue([existingProduct]);
			// Mock update
			mockArivoApiRequest.mockResolvedValue(expectedUpdatedProduct);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productOperations.createOrUpdateProduct.call(mockExecuteFunction, 0);

			// Verify search was performed
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/products',
				{},
				{ name: 'Existing Product' }
			);

			// Verify update was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/products/123', expectedRequestBody);

			// Verify result includes operation metadata
			expect(result).toEqual({
				...expectedUpdatedProduct,
				__n8n_operation: 'updated',
			});
		});

		it('should update existing product when match found by code', async () => {
			const existingProduct = {
				id: '456',
				name: 'Code Product',
				code: 'CODE123',
				price: 89.99,
			};

			const nodeParameters = {
				productName: 'Updated Code Product',
				matchField: 'code',
				additionalFields: {
					code: 'CODE123',
					description: 'Updated via code match',
					price: 109.99,
				},
			};

			// Mock search returning existing product
			mockArivoApiRequestAllItems.mockResolvedValue([existingProduct]);
			// Mock update
			mockArivoApiRequest.mockResolvedValue({
				...existingProduct,
				name: 'Updated Code Product',
				description: 'Updated via code match',
				price: 109.99,
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productOperations.createOrUpdateProduct.call(mockExecuteFunction, 0);

			// Verify search was performed with code
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/products',
				{},
				{ code: 'CODE123' }
			);

			// Verify update was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/products/456', expect.objectContaining({
				name: 'Updated Code Product',
				description: 'Updated via code match',
				price: 109.99,
			}));

			expect(result.__n8n_operation).toBe('updated');
		});
	});

	describe('Edge cases and error handling', () => {
		it('should create new product when search value is missing for code match', async () => {
			const nodeParameters = {
				productName: 'No Code Product',
				matchField: 'code',
				additionalFields: {
					// No code provided
					description: 'Product without code',
					price: 59.99,
				},
			};

			// Mock creation (search should be skipped)
			mockArivoApiRequest.mockResolvedValue(mockProductData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productOperations.createOrUpdateProduct.call(mockExecuteFunction, 0);

			// Verify search was NOT performed since no code was provided
			expect(mockArivoApiRequestAllItems).not.toHaveBeenCalled();

			// Verify creation was performed instead
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', expect.objectContaining({
				name: 'No Code Product',
				description: 'Product without code',
				price: 59.99,
			}));

			expect(result.__n8n_operation).toBe('created');
		});

		it('should create new product when search fails due to API error', async () => {
			const nodeParameters = {
				productName: 'Search Error Product',
				matchField: 'name',
				additionalFields: {
					description: 'Product with search error',
					price: 79.99,
				},
			};

			// Mock search throwing an error
			mockArivoApiRequestAllItems.mockRejectedValue(new Error('API Search Error'));
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockProductData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productOperations.createOrUpdateProduct.call(mockExecuteFunction, 0);

			// Verify search was attempted
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/products',
				{},
				{ name: 'Search Error Product' }
			);

			// Verify creation was performed as fallback
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', expect.objectContaining({
				name: 'Search Error Product',
				description: 'Product with search error',
				price: 79.99,
			}));

			expect(result.__n8n_operation).toBe('created');
		});

		it('should handle product with all optional fields including tags and category', async () => {
			const nodeParameters = {
				productName: 'Complete Product',
				matchField: 'name',
				additionalFields: {
					code: 'COMPLETE001',
					description: 'A complete product with all fields',
					price: '299.99', // String price should be converted to number
					available: 'true', // String boolean should be converted
					product_category_id: '5', // String should be converted to number
					tags: 'electronics,premium,bestseller', // Comma-separated string should become array
				},
			};

			const expectedRequestBody = {
				name: 'Complete Product',
				code: 'COMPLETE001',
				description: 'A complete product with all fields',
				price: 299.99, // Converted to number
				available: true, // Converted to boolean
				product_category_id: 5, // Converted to number
				tags: ['electronics', 'premium', 'bestseller'], // Converted to array
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue({
				...mockProductData,
				...expectedRequestBody,
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await productOperations.createOrUpdateProduct.call(mockExecuteFunction, 0);

			// Verify creation was performed with all fields properly transformed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', expectedRequestBody);

			expect(result.__n8n_operation).toBe('created');
		});

		it('should handle empty tags string correctly', async () => {
			const nodeParameters = {
				productName: 'No Tags Product',
				matchField: 'name',
				additionalFields: {
					tags: '', // Empty tags string stays as empty string (falsy, so not processed)
					price: 49.99,
				},
			};

			const expectedRequestBody = {
				name: 'No Tags Product',
				price: 49.99,
				tags: '', // Empty string stays as empty string because the condition body.tags && typeof body.tags === 'string' is false for empty string
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockProductData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			await productOperations.createOrUpdateProduct.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', expectedRequestBody);
		});

		it('should handle tags with extra whitespace and empty elements', async () => {
			const nodeParameters = {
				productName: 'Messy Tags Product',
				matchField: 'name',
				additionalFields: {
					tags: ' electronics , , premium,  bestseller , ', // Messy tags with extra spaces and empty elements
					price: 199.99,
				},
			};

			const expectedRequestBody = {
				name: 'Messy Tags Product',
				price: 199.99,
				tags: ['electronics', 'premium', 'bestseller'], // Cleaned up tags array
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockProductData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			await productOperations.createOrUpdateProduct.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', expectedRequestBody);
		});

		it('should handle empty product_category_id correctly', async () => {
			const nodeParameters = {
				productName: 'No Category Product',
				matchField: 'name',
				additionalFields: {
					product_category_id: '', // Empty category ID should be passed through but not converted
					price: 39.99,
				},
			};

			const expectedRequestBody = {
				name: 'No Category Product',
				price: 39.99,
				product_category_id: '', // Empty string is passed through since conversion logic only applies when !== ''
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockProductData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			await productOperations.createOrUpdateProduct.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', expectedRequestBody);
		});

		it('should handle numeric strings properly for price and category', async () => {
			const nodeParameters = {
				productName: 'Numeric Fields Product',
				matchField: 'name',
				additionalFields: {
					price: '159.50', // String number
					product_category_id: '3', // String number
				},
			};

			const expectedRequestBody = {
				name: 'Numeric Fields Product',
				price: 159.50, // Converted to number
				product_category_id: 3, // Converted to number
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockProductData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			await productOperations.createOrUpdateProduct.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', expectedRequestBody);
		});

		it('should handle boolean field conversions correctly', async () => {
			const nodeParameters = {
				productName: 'Boolean Product',
				matchField: 'name',
				additionalFields: {
					available: false, // Boolean false
					price: 89.99,
				},
			};

			const expectedRequestBody = {
				name: 'Boolean Product',
				available: false, // Should remain boolean false
				price: 89.99,
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockProductData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			await productOperations.createOrUpdateProduct.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', expectedRequestBody);
		});
	});
});