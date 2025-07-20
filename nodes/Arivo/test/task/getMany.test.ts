import { getTasks } from '../../TaskOperations';
import { arivoApiRequestAllItems } from '../../GenericFunctions';
import { createMockExecuteFunction, mockTasksListResponse } from '../helpers';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequestAllItems: jest.fn(),
}));

const mockArivoApiRequestAllItems = arivoApiRequestAllItems as jest.MockedFunction<typeof arivoApiRequestAllItems>;

describe('Arivo Task GetMany Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should get tasks with default limit', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockTasksListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getTasks.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/tasks', {}, {});
		expect(result).toEqual(mockTasksListResponse.data);
	});

	it('should get tasks with custom limit', async () => {
		const nodeParameters = {
			limit: 10,
		};

		const limitedResponse = mockTasksListResponse.data.slice(0, 1);
		mockArivoApiRequestAllItems.mockResolvedValue(limitedResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getTasks.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/tasks', {}, {});
		expect(result).toEqual(limitedResponse);
	});

	it('should filter tasks by name', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {
				name: 'contrato',
			},
			options: {},
		};

		const filteredResponse = [mockTasksListResponse.data[0]];
		mockArivoApiRequestAllItems.mockResolvedValue(filteredResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getTasks.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/tasks', {}, {
			name: 'contrato',
		});
		expect(result).toEqual(filteredResponse);
	});

	it('should filter tasks by done status', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {
				done: 'true',
			},
			options: {},
		};

		const filteredResponse = [mockTasksListResponse.data[1]]; // Second task is done
		mockArivoApiRequestAllItems.mockResolvedValue(filteredResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getTasks.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/tasks', {}, {
			done: 'true',
		});
		expect(result).toEqual(filteredResponse);
	});

	it('should filter tasks by task type', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {
				task_type_id: 1,
			},
			options: {},
		};

		const filteredResponse = [mockTasksListResponse.data[0]];
		mockArivoApiRequestAllItems.mockResolvedValue(filteredResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getTasks.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/tasks', {}, {
			task_type_id: 1,
		});
		expect(result).toEqual(filteredResponse);
	});

	it('should filter tasks by contact_id', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {
				contact_id: 123,
			},
			options: {},
		};

		const filteredResponse = [mockTasksListResponse.data[0]];
		mockArivoApiRequestAllItems.mockResolvedValue(filteredResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getTasks.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/tasks', {}, {
			contact_id: 123,
		});
		expect(result).toEqual(filteredResponse);
	});

	it('should filter tasks by deal_id', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {
				deal_id: 456,
			},
			options: {},
		};

		const filteredResponse = [mockTasksListResponse.data[1]];
		mockArivoApiRequestAllItems.mockResolvedValue(filteredResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getTasks.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/tasks', {}, {
			deal_id: 456,
		});
		expect(result).toEqual(filteredResponse);
	});

	it('should filter tasks by multiple criteria', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {
				done: 'false',
				user_id: 1,
				team_id: 2,
				task_type_id: 1,
			},
			options: {},
		};

		const filteredResponse = [mockTasksListResponse.data[0]];
		mockArivoApiRequestAllItems.mockResolvedValue(filteredResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getTasks.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/tasks', {}, {
			done: 'false',
			user_id: 1,
			team_id: 2,
			task_type_id: 1,
		});
		expect(result).toEqual(filteredResponse);
	});

	it('should filter tasks by tags', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {
				tags: 'urgent,documentation',
			},
			options: {},
		};

		const filteredResponse = [mockTasksListResponse.data[1]];
		mockArivoApiRequestAllItems.mockResolvedValue(filteredResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getTasks.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/tasks', {}, {
			tags: 'urgent,documentation',
		});
		expect(result).toEqual(filteredResponse);
	});

	it('should sort tasks by due_date descending', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {
				sort_field: 'due_date',
				sort_order: 'desc',
			},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockTasksListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getTasks.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/tasks', {}, {
			sort_field: 'due_date',
			sort_order: 'desc',
		});
		expect(result).toEqual(mockTasksListResponse.data);
	});

	it('should handle empty filters object', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockTasksListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getTasks.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/tasks', {}, {});
		expect(result).toEqual(mockTasksListResponse.data);
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

		await expect(getTasks.call(mockExecuteFunction, 0)).rejects.toThrow('API request failed');

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/tasks', {}, {});
	});

	it('should return empty array for no results', async () => {
		const nodeParameters = {
			limit: 50,
			filters: {},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue([]);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getTasks.call(mockExecuteFunction, 0);

		expect(result).toEqual([]);
	});
});