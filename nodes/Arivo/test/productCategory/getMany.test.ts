import { getProductCategories } from '../../ProductCategoryOperations';
import { createMockExecuteFunction } from '../helpers';
import { arivoApiRequestAllItems } from '../../GenericFunctions';
import productCategoriesResponse from '../fixtures/product-categories-response.json';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequestAllItems: jest.fn(),
}));

const mockArivoApiRequestAllItems = arivoApiRequestAllItems as jest.MockedFunction<typeof arivoApiRequestAllItems>;

describe('Arivo ProductCategory GetMany Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should get product categories with default parameters', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productCategoriesResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProductCategories.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/product_categories', {}, {});
		expect(result).toEqual(productCategoriesResponse);
	});

	it('should filter product categories by name', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {
				name: 'Armas',
			},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productCategoriesResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProductCategories.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/product_categories', {}, {
			name: 'Armas',
		});
		expect(result).toEqual(productCategoriesResponse);
	});

	it('should filter product categories by code', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {
				code: '7A',
			},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productCategoriesResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProductCategories.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/product_categories', {}, {
			code: '7A',
		});
		expect(result).toEqual(productCategoriesResponse);
	});

	it('should filter product categories by multiple criteria', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {
				name: 'Armas',
				code: '7A',
			},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productCategoriesResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProductCategories.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/product_categories', {}, {
			name: 'Armas',
			code: '7A',
		});
		expect(result).toEqual(productCategoriesResponse);
	});

	it('should sort product categories by name ascending', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {},
			options: {
				sort_field: 'name',
				sort_order: 'asc',
			},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productCategoriesResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProductCategories.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/product_categories', {}, {
			sort_field: 'name',
			sort_order: 'asc',
		});
		expect(result).toEqual(productCategoriesResponse);
	});

	it('should sort product categories by created_at descending', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {},
			options: {
				sort_field: 'created_at',
				sort_order: 'desc',
			},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productCategoriesResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProductCategories.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/product_categories', {}, {
			sort_field: 'created_at',
			sort_order: 'desc',
		});
		expect(result).toEqual(productCategoriesResponse);
	});

	it('should handle empty filters object', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productCategoriesResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProductCategories.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/product_categories', {}, {});
		expect(result).toEqual(productCategoriesResponse);
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

		await expect(getProductCategories.call(mockExecuteFunction, 0)).rejects.toThrow('API request failed');
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
		const result = await getProductCategories.call(mockExecuteFunction, 0);

		expect(result).toEqual([]);
	});

	it('should ignore empty filter values', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: {
				name: '',
				code: null,
			},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productCategoriesResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProductCategories.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/product_categories', {}, {});
		expect(result).toEqual(productCategoriesResponse);
	});

	it('should handle undefined filters and options', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 50,
			filters: undefined,
			options: undefined,
		};

		mockArivoApiRequestAllItems.mockResolvedValue(productCategoriesResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getProductCategories.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/product_categories', {}, {});
		expect(result).toEqual(productCategoriesResponse);
	});
});