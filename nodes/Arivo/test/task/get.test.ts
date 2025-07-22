import { getTask } from '../../TaskOperations';
import { arivoApiRequest } from '../../GenericFunctions';
import { createMockExecuteFunction, mockTaskData } from '../helpers';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Task Get Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should get an task by ID', async () => {
		const nodeParameters = {
			taskId: '1',
		};

		mockArivoApiRequest.mockResolvedValue(mockTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/tasks/1');
		expect(result).toEqual(mockTaskData);
	});

	it('should get an task with different ID', async () => {
		const nodeParameters = {
			taskId: '456',
		};

		const customTaskData = {
			...mockTaskData,
			id: '456',
			name: 'Custom task',
		};

		mockArivoApiRequest.mockResolvedValue(customTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/tasks/456');
		expect(result).toEqual(customTaskData);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			taskId: '999',
		};

		const apiError = new Error('Task not found');
		mockArivoApiRequest.mockRejectedValue(apiError);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(getTask.call(mockExecuteFunction, 0)).rejects.toThrow('Task not found');

		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/tasks/999');
	});

	it('should handle numeric task ID', async () => {
		const nodeParameters = {
			taskId: 123,
		};

		mockArivoApiRequest.mockResolvedValue(mockTaskData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getTask.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/tasks/123');
		expect(result).toEqual(mockTaskData);
	});
});
