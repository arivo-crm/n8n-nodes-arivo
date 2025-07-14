import { createProduct } from '../../ProductOperations';
import { createMockExecuteFunction } from '../helpers';
import { arivoApiRequest } from '../../GenericFunctions';
import productResponse from '../fixtures/product-response.json';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Product Create Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should create a product with basic information', async () => {
		const nodeParameters = {
			productName: 'Test Product',
			additionalFields: {},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', {
			name: 'Test Product',
		});
		expect(result).toEqual(productResponse);
	});

	it('should create a product with all additional fields', async () => {
		const nodeParameters = {
			productName: 'Advanced Product',
			additionalFields: {
				code: 'ADV001',
				description: 'Advanced product description',
				price: 199.99,
				available: true,
				product_category_id: 1,
				tags: 'electronics,advanced,tech',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', {
			name: 'Advanced Product',
			code: 'ADV001',
			description: 'Advanced product description',
			price: 199.99,
			available: true,
			product_category_id: 1,
		});
		expect(result).toEqual(productResponse);
	});

	it('should handle price conversion to number', async () => {
		const nodeParameters = {
			productName: 'Price Test Product',
			additionalFields: {
				price: '150.75',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		await createProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', {
			name: 'Price Test Product',
			price: 150.75,
		});
	});

	it('should handle available conversion to boolean', async () => {
		const nodeParameters = {
			productName: 'Available Test Product',
			additionalFields: {
				available: 'true',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		await createProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', {
			name: 'Available Test Product',
			available: true,
		});
	});

	it('should handle product_category_id conversion to number', async () => {
		const nodeParameters = {
			productName: 'Category Test Product',
			additionalFields: {
				product_category_id: '2',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		await createProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', {
			name: 'Category Test Product',
			product_category_id: 2,
		});
	});

	it('should handle tags conversion from string to array', async () => {
		const nodeParameters = {
			productName: 'Tags Test Product',
			additionalFields: {
				tags: 'tag1, tag2, tag3',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		await createProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', {
			name: 'Tags Test Product',
		});
	});

	it('should filter out empty tags', async () => {
		const nodeParameters = {
			productName: 'Empty Tags Test Product',
			additionalFields: {
				tags: 'tag1, , tag2, ',
			},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		await createProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', {
			name: 'Empty Tags Test Product',
		});
	});

	it('should handle empty additional fields', async () => {
		const nodeParameters = {
			productName: 'Minimal Product',
			additionalFields: {},
		};

		mockArivoApiRequest.mockResolvedValue(productResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		await createProduct.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/products', {
			name: 'Minimal Product',
		});
	});
});