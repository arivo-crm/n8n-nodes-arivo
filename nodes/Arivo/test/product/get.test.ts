import { getProduct } from '../../ProductOperations';
import { createMockExecuteFunction } from '../helpers';
import { arivoApiRequest } from '../../GenericFunctions';
import productResponse from '../fixtures/product-response.json';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Product Get Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should get a product by ID', async () => {
		const nodeParameters = {
			productId: '123',
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/products/123');
		expect(result).toEqual(productResponse);
	});

	it('should get a product with different ID', async () => {
		const nodeParameters = {
			productId: '456',
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/products/456');
		expect(result).toEqual(productResponse);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			productId: '123',
		};

		const error = new Error('Product not found');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(getProduct.call(mockExecuteFunction, 0)).rejects.toThrow('Product not found');
	});

	it('should handle numeric product ID', async () => {
		const nodeParameters = {
			productId: 789,
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/products/789');
		expect(result).toEqual(productResponse);
	});
});
