import { getProducts } from '../../ProductOperations';
import { createMockExecuteFunction } from '../helpers';
import { arivoApiRequestAllItems } from '../../GenericFunctions';
import productsListResponse from '../fixtures/products-list-response.json';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequestAllItems: jest.fn(),
}));

const mockArivoApiRequestAllItems = arivoApiRequestAllItems as jest.MockedFunction<typeof arivoApiRequestAllItems>;

describe('Arivo Product GetMany Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should get products with default parameters', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productsListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProducts.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/products', {}, {});
		expect(result).toEqual(productsListResponse);
	});

	it('should filter products by name', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {
				name: 'Bumerangue',
			},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productsListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProducts.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/products', {}, {
			name: 'Bumerangue',
		});
		expect(result).toEqual(productsListResponse);
	});

	it('should filter products by code', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {
				code: '77A',
			},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productsListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProducts.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/products', {}, {
			code: '77A',
		});
		expect(result).toEqual(productsListResponse);
	});

	it('should filter products by availability', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {
				available: true,
			},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productsListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProducts.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/products', {}, {
			available: true,
		});
		expect(result).toEqual(productsListResponse);
	});

	it('should filter products by product category ID', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {
				product_category_id: 1,
			},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productsListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProducts.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/products', {}, {
			product_category_id: 1,
		});
		expect(result).toEqual(productsListResponse);
	});

	it('should filter products by tags', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {
				tags: 'electronics,weapons',
			},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productsListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProducts.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/products', {}, {
			tags: 'electronics,weapons',
		});
		expect(result).toEqual(productsListResponse);
	});

	it('should filter products by multiple criteria', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {
				name: 'Bumerangue',
				available: true,
				product_category_id: 1,
			},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productsListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProducts.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/products', {}, {
			name: 'Bumerangue',
			available: true,
			product_category_id: 1,
		});
		expect(result).toEqual(productsListResponse);
	});

	it('should sort products by name ascending', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {},
			options: {
				sort_field: 'name',
				sort_order: 'asc',
			},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productsListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProducts.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/products', {}, {
			sort_field: 'name',
			sort_order: 'asc',
		});
		expect(result).toEqual(productsListResponse);
	});

	it('should sort products by price descending', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {},
			options: {
				sort_field: 'price',
				sort_order: 'desc',
			},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productsListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProducts.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/products', {}, {
			sort_field: 'price',
			sort_order: 'desc',
		});
		expect(result).toEqual(productsListResponse);
	});

	it('should handle empty filters object', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productsListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProducts.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/products', {}, {});
		expect(result).toEqual(productsListResponse);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {},
			options: {},
		};

		const error = new Error('API request failed');
		mockArivoApiRequestAllItems.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(getProducts.call(mockExecuteFunction, 0)).rejects.toThrow('API request failed');
	});

	it('should return empty array for no results', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue([]);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProducts.call(mockExecuteFunction, 0);

		expect(result).toEqual([]);
	});

	it('should ignore empty filter values', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {
				name: '',
				code: null,
				available: undefined,
				product_category_id: 1,
			},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productsListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProducts.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/products', {}, {
			product_category_id: 1,
		});
		expect(result).toEqual(productsListResponse);
	});
});
