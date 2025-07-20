import { getNotes } from '../../NoteOperations';
import { arivoApiRequestAllItems } from '../../GenericFunctions';
import { createMockExecuteFunction, mockNotesListResponse } from '../helpers';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequestAllItems: jest.fn(),
}));

const mockArivoApiRequestAllItems = arivoApiRequestAllItems as jest.MockedFunction<typeof arivoApiRequestAllItems>;

describe('Arivo Note GetMany Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should get notes with default limit', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockNotesListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getNotes.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/notes', {}, {});
		expect(result).toEqual(mockNotesListResponse.data);
	});

	it('should get limited notes with custom limit', async () => {
		const nodeParameters = {
			limit: 10,
		};

		const limitedResponse = mockNotesListResponse.data.slice(0, 1);
		mockArivoApiRequestAllItems.mockResolvedValue(limitedResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getNotes.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/notes', {}, {});
		expect(result).toEqual(limitedResponse);
	});

	it('should filter notes by contact_id', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {
				contact_id: '123',
			},
			options: {},
		};

		const filteredResponse = [mockNotesListResponse.data[0]]; // First note is linked to contact 123
		mockArivoApiRequestAllItems.mockResolvedValue(filteredResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getNotes.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/notes', {}, {
			contact_id: '123',
		});
		expect(result).toEqual(filteredResponse);
	});

	it('should filter notes by deal_id', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {
				deal_id: '456',
			},
			options: {},
		};

		const filteredResponse = [mockNotesListResponse.data[1]]; // Second note is linked to deal 456
		mockArivoApiRequestAllItems.mockResolvedValue(filteredResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getNotes.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/notes', {}, {
			deal_id: '456',
		});
		expect(result).toEqual(filteredResponse);
	});

	it('should filter notes by task_id', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {
				task_id: '789',
			},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue([]);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getNotes.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/notes', {}, {
			task_id: '789',
		});
		expect(result).toEqual([]);
	});

	it('should filter notes by multiple criteria', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {
				contact_id: '123',
				user_id: '1',
				team_id: '2',
			},
			options: {},
		};

		const filteredResponse = [mockNotesListResponse.data[0]];
		mockArivoApiRequestAllItems.mockResolvedValue(filteredResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getNotes.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/notes', {}, {
			contact_id: '123',
			user_id: '1',
			team_id: '2',
		});
		expect(result).toEqual(filteredResponse);
	});

	it('should handle empty filters object', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockNotesListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getNotes.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/notes', {}, {});
		expect(result).toEqual(mockNotesListResponse.data);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {},
			options: {},
		};

		const apiError = new Error('API request failed');
		mockArivoApiRequestAllItems.mockRejectedValue(apiError);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(getNotes.call(mockExecuteFunction, 0)).rejects.toThrow('API request failed');

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/notes', {}, {});
	});

	it('should return empty array for no results', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue([]);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getNotes.call(mockExecuteFunction, 0);

		expect(result).toEqual([]);
	});

	it('should respect higher limit values', async () => {
		const nodeParameters = {
			limit: 100,
		};

		const largeResponse = [...mockNotesListResponse.data, ...mockNotesListResponse.data]; // Simulate more results
		mockArivoApiRequestAllItems.mockResolvedValue(largeResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getNotes.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/notes', {}, {});
		expect(result).toEqual(largeResponse);
	});
});