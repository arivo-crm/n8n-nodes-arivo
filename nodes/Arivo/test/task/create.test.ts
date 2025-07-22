import { createTask } from '../../TaskOperations';
import { arivoApiRequest } from '../../GenericFunctions';
import { createMockExecuteFunction, mockTaskData } from '../helpers';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Task Create Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should create an task with basic name', async () => {
		const nodeParameters = {
			name: 'Test task',
			additionalFields: {},
		};

		mockArivoApiRequest.mockResolvedValue(mockTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/tasks', {
			name: 'Test task',
			due_type_id: 998, // Default value
		});
		expect(result).toEqual(mockTaskData);
	});

	it('should create an task with all additional fields', async () => {
		const nodeParameters = {
			name: 'Complex task',
			additionalFields: {
				task_type_id: 7,
				due_type_id: 998,
				due_date: '2024-12-31T16:00:00-02:00',
				due_date_end: '2024-12-31T17:00:00-02:00',
				done: false,
				comment: 'Important task with deadline',
				contact_id: 123,
				deal_id: 456,
				user_id: 1,
				team_id: 2,
				tags: 'urgent,followup,meeting',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/tasks', {
			name: 'Complex task',
			task_type_id: 7,
			due_type_id: 998,
			due_date: '2024-12-31T16:00:00-02:00',
			due_date_end: '2024-12-31T17:00:00-02:00',
			done: false,
			comment: 'Important task with deadline',
			contact_id: 123,
			deal_id: 456,
			user_id: 1,
			team_id: 2,
			tags: ['urgent', 'followup', 'meeting'],
		});
		expect(result).toEqual(mockTaskData);
	});

	it('should create an task without due dates when due_type_id is 999', async () => {
		const nodeParameters = {
			name: 'No date task',
			additionalFields: {
				due_type_id: 999,
				due_date: '2024-12-31T16:00:00-02:00', // Should be removed
				due_date_end: '2024-12-31T17:00:00-02:00', // Should be removed
				comment: 'Task without specific due date',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/tasks', {
			name: 'No date task',
			due_type_id: 999,
			comment: 'Task without specific due date',
		});
		expect(result).toEqual(mockTaskData);
	});

	it('should handle tags conversion from string to array', async () => {
		const nodeParameters = {
			name: 'Tagged task',
			additionalFields: {
				tags: 'tag1, tag2 , tag3,tag4 ',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/tasks', {
			name: 'Tagged task',
			due_type_id: 998,
			tags: ['tag1', 'tag2', 'tag3', 'tag4'],
		});
		expect(result).toEqual(mockTaskData);
	});

	it('should filter out empty tags', async () => {
		const nodeParameters = {
			name: 'Task with empty tags',
			additionalFields: {
				tags: 'tag1,,tag2, ,tag3',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/tasks', {
			name: 'Task with empty tags',
			due_type_id: 998,
			tags: ['tag1', 'tag2', 'tag3'],
		});
		expect(result).toEqual(mockTaskData);
	});

	it('should create task linked to contact', async () => {
		const nodeParameters = {
			name: 'Contact task',
			additionalFields: {
				contact_id: 123,
				comment: 'Follow up with this contact',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/tasks', {
			name: 'Contact task',
			due_type_id: 998,
			contact_id: 123,
			comment: 'Follow up with this contact',
		});
		expect(result).toEqual(mockTaskData);
	});

	it('should create task linked to deal', async () => {
		const nodeParameters = {
			name: 'Deal task',
			additionalFields: {
				deal_id: 456,
				comment: 'Close this deal',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/tasks', {
			name: 'Deal task',
			due_type_id: 998,
			deal_id: 456,
			comment: 'Close this deal',
		});
		expect(result).toEqual(mockTaskData);
	});
});
