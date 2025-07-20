import { getProductCategory } from '../../ProductCategoryOperations';
import { createMockExecuteFunction } from '../helpers';
import { arivoApiRequest } from '../../GenericFunctions';
import productCategoryResponse from '../fixtures/product-category-response.json';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo ProductCategory Get Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should get a product category by ID', async () => {
		const nodeParameters = {
			categoryId: '123',
		};

		mockArivoApiRequest.mockResolvedValue(productCategoryResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProductCategory.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/product_categories/123');
		expect(result).toEqual(productCategoryResponse);
	});

	it('should get a product category with different ID', async () => {
		const nodeParameters = {
			categoryId: '456',
		};

		mockArivoApiRequest.mockResolvedValue(productCategoryResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProductCategory.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/product_categories/456');
		expect(result).toEqual(productCategoryResponse);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			categoryId: '123',
		};

		const error = new Error('Product category not found');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(getProductCategory.call(mockExecuteFunction, 0)).rejects.toThrow('Product category not found');
	});

	it('should handle numeric category ID', async () => {
		const nodeParameters = {
			categoryId: 789,
		};

		mockArivoApiRequest.mockResolvedValue(productCategoryResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProductCategory.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/product_categories/789');
		expect(result).toEqual(productCategoryResponse);
	});

	it('should handle empty response from API', async () => {
		const nodeParameters = {
			categoryId: '123',
		};

		mockArivoApiRequest.mockResolvedValue(null);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProductCategory.call(mockExecuteFunction, 0);

		expect(result).toEqual(null);
	});

	it('should handle 404 not found error', async () => {
		const nodeParameters = {
			categoryId: '999',
		};

		const error = new Error('Not found');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(getProductCategory.call(mockExecuteFunction, 0)).rejects.toThrow('Not found');
	});
});