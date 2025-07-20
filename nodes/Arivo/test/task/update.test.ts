import { updateTask } from '../../TaskOperations';
import { arivoApiRequest } from '../../GenericFunctions';
import { createMockExecuteFunction, mockTaskData } from '../helpers';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Task Update Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should update an task with name only', async () => {
		const nodeParameters = {
			taskId: '1',
			updateFields: {
				name: 'Updated task name',
			},
		};

		const updatedTaskData = {
			...mockTaskData,
			name: 'Updated task name',
		};

		mockArivoApiRequest.mockResolvedValue(updatedTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/tasks/1', {
			name: 'Updated task name',
		});
		expect(result).toEqual(updatedTaskData);
	});

	it('should update an task with multiple fields', async () => {
		const nodeParameters = {
			taskId: '1',
			updateFields: {
				name: 'Updated comprehensive task',
				task_type_id: 8,
				due_type_id: 998,
				due_date: '2024-12-31T16:00:00-02:00',
				due_date_end: '2024-12-31T17:00:00-02:00',
				done: true,
				comment: 'Task completed successfully',
				contact_id: 789,
				deal_id: 101,
				user_id: 2,
				team_id: 3,
				tags: 'completed,success,important',
			},
		};

		const updatedTaskData = {
			...mockTaskData,
			name: 'Updated comprehensive task',
			task_type_id: 8,
			done: true,
			comment: 'Task completed successfully',
		};

		mockArivoApiRequest.mockResolvedValue(updatedTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/tasks/1', {
			name: 'Updated comprehensive task',
			task_type_id: 8,
			due_type_id: 998,
			due_date: '2024-12-31T16:00:00-02:00',
			due_date_end: '2024-12-31T17:00:00-02:00',
			done: true,
			comment: 'Task completed successfully',
			contact_id: 789,
			deal_id: 101,
			user_id: 2,
			team_id: 3,
			tags: ['completed', 'success', 'important'],
		});
		expect(result).toEqual(updatedTaskData);
	});

	it('should update task to mark as done', async () => {
		const nodeParameters = {
			taskId: '1',
			updateFields: {
				done: true,
				comment: 'Task completed on time',
			},
		};

		const updatedTaskData = {
			...mockTaskData,
			done: true,
			comment: 'Task completed on time',
		};

		mockArivoApiRequest.mockResolvedValue(updatedTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/tasks/1', {
			done: true,
			comment: 'Task completed on time',
		});
		expect(result).toEqual(updatedTaskData);
	});

	it('should remove due dates when due_type_id is 999', async () => {
		const nodeParameters = {
			taskId: '1',
			updateFields: {
				due_type_id: 999,
				due_date: '2024-12-31T16:00:00-02:00', // Should be removed
				due_date_end: '2024-12-31T17:00:00-02:00', // Should be removed
				comment: 'Changed to no specific due date',
			},
		};

		const updatedTaskData = {
			...mockTaskData,
			due_type_id: 999,
			due_date: null,
			due_date_end: null,
			comment: 'Changed to no specific due date',
		};

		mockArivoApiRequest.mockResolvedValue(updatedTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/tasks/1', {
			due_type_id: 999,
			comment: 'Changed to no specific due date',
		});
		expect(result).toEqual(updatedTaskData);
	});

	it('should update task to link to different contact', async () => {
		const nodeParameters = {
			taskId: '1',
			updateFields: {
				contact_id: 999,
				deal_id: null, // Remove deal link
				comment: 'Transferred to different contact',
			},
		};

		const updatedTaskData = {
			...mockTaskData,
			contact_id: 999,
			deal_id: null,
			comment: 'Transferred to different contact',
		};

		mockArivoApiRequest.mockResolvedValue(updatedTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/tasks/1', {
			contact_id: 999,
			deal_id: null,
			comment: 'Transferred to different contact',
		});
		expect(result).toEqual(updatedTaskData);
	});

	it('should handle tags conversion from string to array', async () => {
		const nodeParameters = {
			taskId: '1',
			updateFields: {
				tags: 'updated, modified , changed',
			},
		};

		const updatedTaskData = {
			...mockTaskData,
			tags: ['updated', 'modified', 'changed'],
		};

		mockArivoApiRequest.mockResolvedValue(updatedTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/tasks/1', {
			tags: ['updated', 'modified', 'changed'],
		});
		expect(result).toEqual(updatedTaskData);
	});

	it('should handle empty updateFields', async () => {
		const nodeParameters = {
			taskId: '1',
			updateFields: {},
		};

		mockArivoApiRequest.mockResolvedValue(mockTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/tasks/1', {});
		expect(result).toEqual(mockTaskData);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			taskId: '999',
			updateFields: {
				name: 'Updated name',
			},
		};

		const apiError = new Error('Task not found');
		mockArivoApiRequest.mockRejectedValue(apiError);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(updateTask.call(mockExecuteFunction, 0)).rejects.toThrow('Task not found');

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/tasks/999', {
			name: 'Updated name',
		});
	});

	it('should handle numeric task ID', async () => {
		const nodeParameters = {
			taskId: 123,
			updateFields: {
				name: 'Updated with numeric ID',
			},
		};

		const updatedTaskData = {
			...mockTaskData,
			name: 'Updated with numeric ID',
		};

		mockArivoApiRequest.mockResolvedValue(updatedTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/tasks/123', {
			name: 'Updated with numeric ID',
		});
		expect(result).toEqual(updatedTaskData);
	});

	it('should update task type', async () => {
		const nodeParameters = {
			taskId: '1',
			updateFields: {
				task_type_id: 9, // Change to "Ligação" (call)
				comment: 'Changed to phone call task',
			},
		};

		const updatedTaskData = {
			...mockTaskData,
			task_type_id: 9,
			comment: 'Changed to phone call task',
		};

		mockArivoApiRequest.mockResolvedValue(updatedTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/tasks/1', {
			task_type_id: 9,
			comment: 'Changed to phone call task',
		});
		expect(result).toEqual(updatedTaskData);
	});
});
