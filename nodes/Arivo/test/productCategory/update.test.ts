import { updateProductCategory } from '../../ProductCategoryOperations';
import { createMockExecuteFunction } from '../helpers';
import { arivoApiRequest } from '../../GenericFunctions';
import productCategoryResponse from '../fixtures/product-category-response.json';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo ProductCategory Update Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should update a product category with name only', async () => {
		const nodeParameters = {
			categoryId: '123',
			updateFields: {
				name: 'Updated Category Name',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productCategoryResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateProductCategory.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/product_categories/123', {
			name: 'Updated Category Name',
		});
		expect(result).toEqual(productCategoryResponse);
	});

	it('should update a product category with code only', async () => {
		const nodeParameters = {
			categoryId: '123',
			updateFields: {
				code: 'UPD001',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productCategoryResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateProductCategory.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/product_categories/123', {
			code: 'UPD001',
		});
		expect(result).toEqual(productCategoryResponse);
	});

	it('should update a product category with all fields', async () => {
		const nodeParameters = {
			categoryId: '123',
			updateFields: {
				name: 'Fully Updated Category',
				code: 'FULL001',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productCategoryResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateProductCategory.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/product_categories/123', {
			name: 'Fully Updated Category',
			code: 'FULL001',
		});
		expect(result).toEqual(productCategoryResponse);
	});

	it('should handle empty update fields', async () => {
		const nodeParameters = {
			categoryId: '123',
			updateFields: {},
		};

		mockArivoApiRequest.mockResolvedValue(productCategoryResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateProductCategory.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/product_categories/123', {});
		expect(result).toEqual(productCategoryResponse);
	});

	it('should handle numeric category ID', async () => {
		const nodeParameters = {
			categoryId: 456,
			updateFields: {
				name: 'Numeric ID Category',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productCategoryResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateProductCategory.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/product_categories/456', {
			name: 'Numeric ID Category',
		});
		expect(result).toEqual(productCategoryResponse);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			categoryId: '123',
			updateFields: {
				name: 'Error Category',
			},
		};

		const error = new Error('Product category not found');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(updateProductCategory.call(mockExecuteFunction, 0)).rejects.toThrow('Product category not found');
	});

	it('should handle null/undefined update fields', async () => {
		const nodeParameters = {
			categoryId: '123',
			updateFields: {
				name: null,
				code: undefined,
			},
		};

		mockArivoApiRequest.mockResolvedValue(productCategoryResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateProductCategory.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/product_categories/123', {
			name: null,
			code: undefined,
		});
		expect(result).toEqual(productCategoryResponse);
	});

	it('should handle partial updates', async () => {
		const nodeParameters = {
			categoryId: '123',
			updateFields: {
				name: 'Partial Update',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productCategoryResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateProductCategory.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/product_categories/123', {
			name: 'Partial Update',
		});
		expect(result).toEqual(productCategoryResponse);
	});

	it('should handle permission denied error', async () => {
		const nodeParameters = {
			categoryId: '123',
			updateFields: {
				name: 'Permission Test',
			},
		};

		const error = new Error('Permission denied');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(updateProductCategory.call(mockExecuteFunction, 0)).rejects.toThrow('Permission denied');
	});

	it('should handle 404 not found error', async () => {
		const nodeParameters = {
			categoryId: '999',
			updateFields: {
				name: 'Non-existent Category',
			},
		};

		const error = new Error('Not found');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(updateProductCategory.call(mockExecuteFunction, 0)).rejects.toThrow('Not found');
	});
});