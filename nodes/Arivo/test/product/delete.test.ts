import { deleteProduct } from '../../ProductOperations';
import { createMockExecuteFunction } from '../helpers';
import { arivoApiRequest } from '../../GenericFunctions';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Product Delete Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should delete a product by ID', async () => {
		const nodeParameters = {
			productId: '123',
		};

		const deleteResponse = {};
		mockArivoApiRequest.mockResolvedValue(deleteResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/products/123');
		expect(result).toEqual(deleteResponse);
	});

	it('should delete a product with different ID', async () => {
		const nodeParameters = {
			productId: '456',
		};

		const deleteResponse = {};
		mockArivoApiRequest.mockResolvedValue(deleteResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/products/456');
		expect(result).toEqual(deleteResponse);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			productId: '123',
		};

		const error = new Error('Product not found');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(deleteProduct.call(mockExecuteFunction, 0)).rejects.toThrow('Product not found');
	});

	it('should handle numeric product ID', async () => {
		const nodeParameters = {
			productId: 789,
		};

		const deleteResponse = {};
		mockArivoApiRequest.mockResolvedValue(deleteResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/products/789');
		expect(result).toEqual(deleteResponse);
	});

	it('should handle empty response from API', async () => {
		const nodeParameters = {
			productId: '123',
		};

		mockArivoApiRequest.mockResolvedValue(null);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteProduct.call(mockExecuteFunction, 0);

		expect(result).toEqual(null);
	});
});