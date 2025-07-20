import { deleteNote } from '../../NoteOperations';
import { arivoApiRequest } from '../../GenericFunctions';
import { createMockExecuteFunction } from '../helpers';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Note Delete Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should delete a note by ID', async () => {
		const nodeParameters = {
			noteId: '1',
		};

		const deleteResponse = { success: true, message: 'Note deleted successfully' };
		mockArivoApiRequest.mockResolvedValue(deleteResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/notes/1');
		expect(result).toEqual(deleteResponse);
	});

	it('should delete a note with different ID', async () => {
		const nodeParameters = {
			noteId: '456',
		};

		const deleteResponse = { 
			success: true, 
			message: 'Note 456 deleted successfully',
			deleted_id: '456',
		};
		mockArivoApiRequest.mockResolvedValue(deleteResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/notes/456');
		expect(result).toEqual(deleteResponse);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			noteId: '999',
		};

		const apiError = new Error('Note not found');
		mockArivoApiRequest.mockRejectedValue(apiError);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(deleteNote.call(mockExecuteFunction, 0)).rejects.toThrow('Note not found');

		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/notes/999');
	});

	it('should handle numeric note ID', async () => {
		const nodeParameters = {
			noteId: 123,
		};

		const deleteResponse = { success: true };
		mockArivoApiRequest.mockResolvedValue(deleteResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/notes/123');
		expect(result).toEqual(deleteResponse);
	});

	it('should handle empty response from API', async () => {
		const nodeParameters = {
			noteId: '1',
		};

		mockArivoApiRequest.mockResolvedValue({});

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deleteNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/notes/1');
		expect(result).toEqual({});
	});

	it('should handle 404 not found error', async () => {
		const nodeParameters = {
			noteId: '999',
		};

		const notFoundError = new Error('HTTP Error 404: Note not found');
		notFoundError.name = 'NodeApiError';
		mockArivoApiRequest.mockRejectedValue(notFoundError);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(deleteNote.call(mockExecuteFunction, 0)).rejects.toThrow('HTTP Error 404: Note not found');

		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/notes/999');
	});

	it('should handle permission denied error', async () => {
		const nodeParameters = {
			noteId: '1',
		};

		const permissionError = new Error('HTTP Error 403: Permission denied');
		permissionError.name = 'NodeApiError';
		mockArivoApiRequest.mockRejectedValue(permissionError);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(deleteNote.call(mockExecuteFunction, 0)).rejects.toThrow('HTTP Error 403: Permission denied');

		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/notes/1');
	});
});
