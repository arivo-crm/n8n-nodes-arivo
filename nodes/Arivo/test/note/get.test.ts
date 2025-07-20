import { getNote } from '../../NoteOperations';
import { arivoApiRequest } from '../../GenericFunctions';
import { createMockExecuteFunction, mockNoteData } from '../helpers';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Note Get Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should get a note by ID', async () => {
		const nodeParameters = {
			noteId: '1',
		};

		mockArivoApiRequest.mockResolvedValue(mockNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/notes/1');
		expect(result).toEqual(mockNoteData);
	});

	it('should get a note with different ID', async () => {
		const nodeParameters = {
			noteId: '456',
		};

		const customNoteData = {
			...mockNoteData,
			id: '456',
			text: 'Custom note text',
		};

		mockArivoApiRequest.mockResolvedValue(customNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/notes/456');
		expect(result).toEqual(customNoteData);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			noteId: '999',
		};

		const apiError = new Error('Note not found');
		mockArivoApiRequest.mockRejectedValue(apiError);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(getNote.call(mockExecuteFunction, 0)).rejects.toThrow('Note not found');

		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/notes/999');
	});

	it('should handle numeric note ID', async () => {
		const nodeParameters = {
			noteId: 123,
		};

		mockArivoApiRequest.mockResolvedValue(mockNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/notes/123');
		expect(result).toEqual(mockNoteData);
	});
});