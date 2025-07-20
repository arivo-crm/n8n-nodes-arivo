import { createProductCategory } from '../../ProductCategoryOperations';
import { createMockExecuteFunction } from '../helpers';
import { arivoApiRequest } from '../../GenericFunctions';
import productCategoryResponse from '../fixtures/product-category-response.json';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo ProductCategory Create Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should create a product category with basic information', async () => {
		const nodeParameters = {
			categoryName: 'Test Category',
			additionalFields: {},
		};

		mockArivoApiRequest.mockResolvedValue(productCategoryResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createProductCategory.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/product_categories', {
			name: 'Test Category',
		});
		expect(result).toEqual(productCategoryResponse);
	});

	it('should create a product category with additional fields', async () => {
		const nodeParameters = {
			categoryName: 'Advanced Category',
			additionalFields: {
				code: 'ADV001',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productCategoryResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createProductCategory.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/product_categories', {
			name: 'Advanced Category',
			code: 'ADV001',
		});
		expect(result).toEqual(productCategoryResponse);
	});

	it('should handle empty additional fields', async () => {
		const nodeParameters = {
			categoryName: 'Minimal Category',
			additionalFields: {},
		};

		mockArivoApiRequest.mockResolvedValue(productCategoryResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createProductCategory.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/product_categories', {
			name: 'Minimal Category',
		});
		expect(result).toEqual(productCategoryResponse);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			categoryName: 'Error Category',
			additionalFields: {},
		};

		const error = new Error('API request failed');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(createProductCategory.call(mockExecuteFunction, 0)).rejects.toThrow('API request failed');
	});

	it('should handle null/undefined additional fields gracefully', async () => {
		const nodeParameters = {
			categoryName: 'Null Fields Category',
			additionalFields: {
				code: null,
			},
		};

		mockArivoApiRequest.mockResolvedValue(productCategoryResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createProductCategory.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/product_categories', {
			name: 'Null Fields Category',
			code: null,
		});
		expect(result).toEqual(productCategoryResponse);
	});
});
