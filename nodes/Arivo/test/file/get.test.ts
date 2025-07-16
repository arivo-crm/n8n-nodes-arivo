import { getFile } from '../../FileOperations';
import { arivoApiRequest } from '../../GenericFunctions';
import { createMockExecuteFunction, mockFileData } from '../helpers';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo File Get Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should get a file by ID', async () => {
		const nodeParameters = {
			fileId: '1',
		};

		mockArivoApiRequest.mockResolvedValue(mockFileData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFile.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files/1');
		expect(result).toEqual(mockFileData);
	});

	it('should get a file with different ID', async () => {
		const nodeParameters = {
			fileId: '123',
		};

		const differentFileData = {
			...mockFileData,
			id: '123',
			name: 'different-file.txt',
		};

		mockArivoApiRequest.mockResolvedValue(differentFileData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFile.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files/123');
		expect(result).toEqual(differentFileData);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			fileId: '1',
		};

		const error = new Error('File not found');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(getFile.call(mockExecuteFunction, 0)).rejects.toThrow('File not found');
		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files/1');
	});

	it('should handle numeric file ID', async () => {
		const nodeParameters = {
			fileId: 456,
		};

		const numericFileData = {
			...mockFileData,
			id: '456',
		};

		mockArivoApiRequest.mockResolvedValue(numericFileData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFile.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files/456');
		expect(result).toEqual(numericFileData);
	});

	it('should handle empty response from API', async () => {
		const nodeParameters = {
			fileId: '1',
		};

		mockArivoApiRequest.mockResolvedValue({});

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFile.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files/1');
		expect(result).toEqual({});
	});

	it('should handle 404 not found error', async () => {
		const nodeParameters = {
			fileId: '999',
		};

		const error = new Error('File with ID 999 not found');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(getFile.call(mockExecuteFunction, 0)).rejects.toThrow('File with ID 999 not found');
		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files/999');
	});

	it('should handle permission denied error', async () => {
		const nodeParameters = {
			fileId: '1',
		};

		const error = new Error('Permission denied');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(getFile.call(mockExecuteFunction, 0)).rejects.toThrow('Permission denied');
		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files/1');
	});
});