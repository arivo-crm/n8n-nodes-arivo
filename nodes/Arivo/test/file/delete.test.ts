import { deleteFile } from '../../FileOperations';
import { arivoApiRequest } from '../../GenericFunctions';
import { createMockExecuteFunction } from '../helpers';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo File Delete Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should delete a file by ID', async () => {
		const nodeParameters = {
			fileId: '1',
		};

		const expectedResponse = { deleted: true };
		mockArivoApiRequest.mockResolvedValue({});

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteFile.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/attachment_files/1');
		expect(result).toEqual(expectedResponse);
	});

	it('should delete a file with different ID', async () => {
		const nodeParameters = {
			fileId: '123',
		};

		const expectedResponse = { deleted: true };
		mockArivoApiRequest.mockResolvedValue({});

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteFile.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/attachment_files/123');
		expect(result).toEqual(expectedResponse);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			fileId: '1',
		};

		const error = new Error('Failed to delete file');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(deleteFile.call(mockExecuteFunction, 0)).rejects.toThrow('Failed to delete file');
		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/attachment_files/1');
	});

	it('should handle numeric file ID', async () => {
		const nodeParameters = {
			fileId: 456,
		};

		const expectedResponse = { deleted: true };
		mockArivoApiRequest.mockResolvedValue({});

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteFile.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/attachment_files/456');
		expect(result).toEqual(expectedResponse);
	});

	it('should handle empty response from API', async () => {
		const nodeParameters = {
			fileId: '1',
		};

		const expectedResponse = { deleted: true };
		mockArivoApiRequest.mockResolvedValue({});

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteFile.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/attachment_files/1');
		expect(result).toEqual(expectedResponse);
	});

	it('should handle 404 not found error', async () => {
		const nodeParameters = {
			fileId: '999',
		};

		const error = new Error('File with ID 999 not found');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(deleteFile.call(mockExecuteFunction, 0)).rejects.toThrow('File with ID 999 not found');
		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/attachment_files/999');
	});

	it('should handle permission denied error', async () => {
		const nodeParameters = {
			fileId: '1',
		};

		const error = new Error('Permission denied');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(deleteFile.call(mockExecuteFunction, 0)).rejects.toThrow('Permission denied');
		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/attachment_files/1');
	});

	it('should handle server errors', async () => {
		const nodeParameters = {
			fileId: '1',
		};

		const error = new Error('Internal server error');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(deleteFile.call(mockExecuteFunction, 0)).rejects.toThrow('Internal server error');
		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/attachment_files/1');
	});

	it('should handle empty file ID', async () => {
		const nodeParameters = {
			fileId: '',
		};

		const expectedResponse = { deleted: true };
		mockArivoApiRequest.mockResolvedValue({});

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteFile.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/attachment_files/');
		expect(result).toEqual(expectedResponse);
	});

	it('should handle 204 No Content response', async () => {
		const nodeParameters = {
			fileId: '1',
		};

		// 204 responses typically have no content, but operation returns {deleted: true}
		const expectedResponse = { deleted: true };
		mockArivoApiRequest.mockResolvedValue(undefined);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteFile.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/attachment_files/1');
		expect(result).toEqual(expectedResponse);
	});
});
