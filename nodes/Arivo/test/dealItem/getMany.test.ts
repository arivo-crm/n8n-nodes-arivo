import { IExecuteFunctions } from 'n8n-workflow';
import { getDealItems } from '../../DealItemOperations';
import { createMockExecuteFunction } from '../helpers';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

import { arivoApiRequest } from '../../GenericFunctions';
const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Deal Item GetMany Operation', () => {
	let mockExecuteFunction: IExecuteFunctions;

	beforeEach(() => {
		mockExecuteFunction = createMockExecuteFunction({});
		jest.clearAllMocks();
	});

	it('should get deal items from deal data', async () => {
		const mockDealData = {
			id: '1',
			name: 'Test Deal',
			quote_items: [
				{
					id: '1',
					object: 'quote_item',
					name: 'Product A',
					deal_id: '1',
					price: '100.00',
					quantity: '2',
					total_price: '200.00',
				},
				{
					id: '2',
					object: 'quote_item',
					name: 'Product B',
					deal_id: '1',
					price: '50.00',
					quantity: '1',
					total_price: '50.00',
				},
			],
		};

		mockArivoApiRequest.mockResolvedValue(mockDealData);
		
		mockExecuteFunction.getNodeParameter = jest.fn()
			.mockReturnValueOnce('1') // dealId
			.mockReturnValueOnce({}) // filters
			.mockReturnValueOnce({}) // options
			.mockReturnValueOnce(true); // returnAll

		const result = await getDealItems.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/deals/1');
		expect(result).toEqual(mockDealData.quote_items);
	});

	it('should return empty array when deal has no quote_items', async () => {
		const mockDealData = {
			id: '1',
			name: 'Test Deal',
			// No quote_items field
		};

		mockArivoApiRequest.mockResolvedValue(mockDealData);
		
		mockExecuteFunction.getNodeParameter = jest.fn()
			.mockReturnValueOnce('1') // dealId
			.mockReturnValueOnce({}) // filters
			.mockReturnValueOnce({}) // options
			.mockReturnValueOnce(true); // returnAll

		const result = await getDealItems.call(mockExecuteFunction, 0);

		expect(result).toEqual([]);
	});

	it('should filter deal items by name', async () => {
		const mockDealData = {
			id: '1',
			name: 'Test Deal',
			quote_items: [
				{
					id: '1',
					name: 'Product A',
					price: '100.00',
				},
				{
					id: '2',
					name: 'Service B',
					price: '50.00',
				},
			],
		};

		mockArivoApiRequest.mockResolvedValue(mockDealData);
		
		mockExecuteFunction.getNodeParameter = jest.fn()
			.mockReturnValueOnce('1') // dealId
			.mockReturnValueOnce({ name: 'Product' }) // filters
			.mockReturnValueOnce({}) // options
			.mockReturnValueOnce(true); // returnAll

		const result = await getDealItems.call(mockExecuteFunction, 0);

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('Product A');
	});

	it('should sort deal items by name ascending', async () => {
		const mockDealData = {
			id: '1',
			name: 'Test Deal',
			quote_items: [
				{
					id: '2',
					name: 'Z Product',
					price: '50.00',
				},
				{
					id: '1',
					name: 'A Product',
					price: '100.00',
				},
			],
		};

		mockArivoApiRequest.mockResolvedValue(mockDealData);
		
		mockExecuteFunction.getNodeParameter = jest.fn()
			.mockReturnValueOnce('1') // dealId
			.mockReturnValueOnce({}) // filters
			.mockReturnValueOnce({ sort_field: 'name', sort_order: 'asc' }) // options
			.mockReturnValueOnce(true); // returnAll

		const result = await getDealItems.call(mockExecuteFunction, 0);

		expect(result).toHaveLength(2);
		expect(result[0].name).toBe('A Product');
		expect(result[1].name).toBe('Z Product');
	});

	it('should limit results when returnAll is false', async () => {
		const mockDealData = {
			id: '1',
			name: 'Test Deal',
			quote_items: [
				{ id: '1', name: 'Product A' },
				{ id: '2', name: 'Product B' },
				{ id: '3', name: 'Product C' },
			],
		};

		mockArivoApiRequest.mockResolvedValue(mockDealData);
		
		mockExecuteFunction.getNodeParameter = jest.fn()
			.mockReturnValueOnce('1') // dealId
			.mockReturnValueOnce({}) // filters
			.mockReturnValueOnce({}) // options
			.mockReturnValueOnce(false) // returnAll
			.mockReturnValueOnce(2); // limit

		const result = await getDealItems.call(mockExecuteFunction, 0);

		expect(result).toHaveLength(2);
		expect(result[0].id).toBe('1');
		expect(result[1].id).toBe('2');
	});

	it('should handle API errors gracefully', async () => {
		mockArivoApiRequest.mockRejectedValue(new Error('API Error'));
		
		mockExecuteFunction.getNodeParameter = jest.fn()
			.mockReturnValueOnce('1'); // dealId

		await expect(getDealItems.call(mockExecuteFunction, 0)).rejects.toThrow('API Error');
	});

	it('should handle empty filters and options gracefully', async () => {
		const mockDealData = {
			id: '1',
			name: 'Test Deal',
			quote_items: [
				{ id: '1', name: 'Product A' },
			],
		};

		mockArivoApiRequest.mockResolvedValue(mockDealData);
		
		mockExecuteFunction.getNodeParameter = jest.fn()
			.mockReturnValueOnce('1') // dealId
			.mockReturnValueOnce(null) // filters
			.mockReturnValueOnce(null) // options
			.mockReturnValueOnce(true); // returnAll

		const result = await getDealItems.call(mockExecuteFunction, 0);

		expect(result).toEqual(mockDealData.quote_items);
	});
});