import { deleteTask } from '../../TaskOperations';
import { arivoApiRequest } from '../../GenericFunctions';
import { createMockExecuteFunction } from '../helpers';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Task Delete Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should delete an task by ID', async () => {
		const nodeParameters = {
			taskId: '1',
		};

		const deleteResponse = { success: true, message: 'Task deleted successfully' };
		mockArivoApiRequest.mockResolvedValue(deleteResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/tasks/1');
		expect(result).toEqual(deleteResponse);
	});

	it('should delete an task with different ID', async () => {
		const nodeParameters = {
			taskId: '456',
		};

		const deleteResponse = { 
			success: true, 
			message: 'Task 456 deleted successfully',
			deleted_id: '456',
		};
		mockArivoApiRequest.mockResolvedValue(deleteResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/tasks/456');
		expect(result).toEqual(deleteResponse);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			taskId: '999',
		};

		const apiError = new Error('Task not found');
		mockArivoApiRequest.mockRejectedValue(apiError);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(deleteTask.call(mockExecuteFunction, 0)).rejects.toThrow('Task not found');

		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/tasks/999');
	});

	it('should handle numeric task ID', async () => {
		const nodeParameters = {
			taskId: 123,
		};

		const deleteResponse = { success: true };
		mockArivoApiRequest.mockResolvedValue(deleteResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/tasks/123');
		expect(result).toEqual(deleteResponse);
	});

	it('should handle empty response from API', async () => {
		const nodeParameters = {
			taskId: '1',
		};

		mockArivoApiRequest.mockResolvedValue({});

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/tasks/1');
		expect(result).toEqual({});
	});

	it('should handle 404 not found error', async () => {
		const nodeParameters = {
			taskId: '999',
		};

		const notFoundError = new Error('HTTP Error 404: Task not found');
		notFoundError.name = 'NodeApiError';
		mockArivoApiRequest.mockRejectedValue(notFoundError);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(deleteTask.call(mockExecuteFunction, 0)).rejects.toThrow('HTTP Error 404: Task not found');

		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/tasks/999');
	});

	it('should handle permission denied error', async () => {
		const nodeParameters = {
			taskId: '1',
		};

		const permissionError = new Error('HTTP Error 403: Permission denied');
		permissionError.name = 'NodeApiError';
		mockArivoApiRequest.mockRejectedValue(permissionError);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(deleteTask.call(mockExecuteFunction, 0)).rejects.toThrow('HTTP Error 403: Permission denied');

		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/tasks/1');
	});

	it('should handle server errors', async () => {
		const nodeParameters = {
			taskId: '1',
		};

		const serverError = new Error('HTTP Error 500: Internal server error');
		serverError.name = 'NodeApiError';
		mockArivoApiRequest.mockRejectedValue(serverError);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(deleteTask.call(mockExecuteFunction, 0)).rejects.toThrow('HTTP Error 500: Internal server error');

		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/tasks/1');
	});
});