import { updateProduct } from '../../ProductOperations';
import { createMockExecuteFunction } from '../helpers';
import { arivoApiRequest } from '../../GenericFunctions';
import productResponse from '../fixtures/product-response.json';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Product Update Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should update a product with basic information', async () => {
		const nodeParameters = {
			productId: '123',
			updateFields: {
				name: 'Updated Product',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/products/123', {
			name: 'Updated Product',
		});
		expect(result).toEqual(productResponse);
	});

	it('should update a product with all fields', async () => {
		const nodeParameters = {
			productId: '123',
			updateFields: {
				name: 'Fully Updated Product',
				code: 'UPD001',
				description: 'Updated description',
				price: 299.99,
				available: false,
				product_category_id: 2,
				tags: 'updated,product,test',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/products/123', {
			name: 'Fully Updated Product',
			code: 'UPD001',
			description: 'Updated description',
			price: 299.99,
			available: false,
			product_category_id: 2,
		});
		expect(result).toEqual(productResponse);
	});

	it('should handle price conversion to number', async () => {
		const nodeParameters = {
			productId: '123',
			updateFields: {
				price: '125.50',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		await updateProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/products/123', {
			price: 125.50,
		});
	});

	it('should handle available conversion to boolean', async () => {
		const nodeParameters = {
			productId: '123',
			updateFields: {
				available: 'false',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		await updateProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/products/123', {
			available: true,
		});
	});

	it('should handle product_category_id conversion to number', async () => {
		const nodeParameters = {
			productId: '123',
			updateFields: {
				product_category_id: '3',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		await updateProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/products/123', {
			product_category_id: 3,
		});
	});

	it('should handle tags conversion from string to array', async () => {
		const nodeParameters = {
			productId: '123',
			updateFields: {
				tags: 'tag1, tag2, tag3',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		await updateProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/products/123', {});
	});

	it('should filter out empty tags', async () => {
		const nodeParameters = {
			productId: '123',
			updateFields: {
				tags: 'tag1, , tag2, ',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		await updateProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/products/123', {});
	});

	it('should handle empty update fields', async () => {
		const nodeParameters = {
			productId: '123',
			updateFields: {},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		await updateProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/products/123', {});
	});

	it('should handle numeric product ID', async () => {
		const nodeParameters = {
			productId: 456,
			updateFields: {
				name: 'Numeric ID Product',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		await updateProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/products/456', {
			name: 'Numeric ID Product',
		});
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			productId: '123',
			updateFields: {
				name: 'Error Product',
			},
		};

		const error = new Error('Product not found');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(updateProduct.call(mockExecuteFunction, 0)).rejects.toThrow('Product not found');
	});

	it('should handle partial updates', async () => {
		const nodeParameters = {
			productId: '123',
			updateFields: {
				name: 'Partial Update',
				price: 50.00,
			},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		await updateProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/products/123', {
			name: 'Partial Update',
			price: 50.00,
		});
	});
});