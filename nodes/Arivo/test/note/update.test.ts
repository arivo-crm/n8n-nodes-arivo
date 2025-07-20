import { updateNote } from '../../NoteOperations';
import { arivoApiRequest } from '../../GenericFunctions';
import { createMockExecuteFunction, mockNoteData } from '../helpers';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Note Update Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should update a note with text only', async () => {
		const nodeParameters = {
			noteId: '1',
			updateFields: {
				text: 'Updated note text',
			},
		};

		const updatedNoteData = {
			...mockNoteData,
			text: 'Updated note text',
		};

		mockArivoApiRequest.mockResolvedValue(updatedNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/notes/1', {
			text: 'Updated note text',
		});
		expect(result).toEqual(updatedNoteData);
	});

	it('should update a note with multiple fields', async () => {
		const nodeParameters = {
			noteId: '1',
			updateFields: {
				text: 'Updated note with new links',
				contact_id: '456',
				deal_id: '789',
				task_id: '123',
				user_id: '2',
				team_id: '3',
			},
		};

		const updatedNoteData = {
			...mockNoteData,
			text: 'Updated note with new links',
			contact_id: '456',
			deal_id: '789',
			task_id: '123',
			user_id: '2',
			team_id: '3',
		};

		mockArivoApiRequest.mockResolvedValue(updatedNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/notes/1', {
			text: 'Updated note with new links',
			contact_id: '456',
			deal_id: '789',
			task_id: '123',
			user_id: '2',
			team_id: '3',
		});
		expect(result).toEqual(updatedNoteData);
	});

	it('should update note to link to a different contact', async () => {
		const nodeParameters = {
			noteId: '1',
			updateFields: {
				contact_id: '999',
				deal_id: null, // Remove deal link
			},
		};

		const updatedNoteData = {
			...mockNoteData,
			contact_id: '999',
			deal_id: null,
		};

		mockArivoApiRequest.mockResolvedValue(updatedNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/notes/1', {
			contact_id: '999',
			deal_id: null,
		});
		expect(result).toEqual(updatedNoteData);
	});

	it('should update note to remove all links', async () => {
		const nodeParameters = {
			noteId: '1',
			updateFields: {
				text: 'Standalone note',
				contact_id: null,
				deal_id: null,
				task_id: null,
			},
		};

		const updatedNoteData = {
			...mockNoteData,
			text: 'Standalone note',
			contact_id: null,
			deal_id: null,
			task_id: null,
		};

		mockArivoApiRequest.mockResolvedValue(updatedNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/notes/1', {
			text: 'Standalone note',
			contact_id: null,
			deal_id: null,
			task_id: null,
		});
		expect(result).toEqual(updatedNoteData);
	});

	it('should handle empty updateFields', async () => {
		const nodeParameters = {
			noteId: '1',
			updateFields: {},
		};

		mockArivoApiRequest.mockResolvedValue(mockNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/notes/1', {});
		expect(result).toEqual(mockNoteData);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			noteId: '999',
			updateFields: {
				text: 'Updated text',
			},
		};

		const apiError = new Error('Note not found');
		mockArivoApiRequest.mockRejectedValue(apiError);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(updateNote.call(mockExecuteFunction, 0)).rejects.toThrow('Note not found');

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/notes/999', {
			text: 'Updated text',
		});
	});

	it('should handle numeric note ID', async () => {
		const nodeParameters = {
			noteId: 123,
			updateFields: {
				text: 'Updated with numeric ID',
			},
		};

		const updatedNoteData = {
			...mockNoteData,
			text: 'Updated with numeric ID',
		};

		mockArivoApiRequest.mockResolvedValue(updatedNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/notes/123', {
			text: 'Updated with numeric ID',
		});
		expect(result).toEqual(updatedNoteData);
	});

	it('should filter out undefined values from updateFields', async () => {
		const nodeParameters = {
			noteId: '1',
			updateFields: {
				text: 'Updated text',
				contact_id: '123',
				deal_id: undefined,
				task_id: null,
				user_id: '',
			},
		};

		const updatedNoteData = {
			...mockNoteData,
			text: 'Updated text',
			contact_id: '123',
		};

		mockArivoApiRequest.mockResolvedValue(updatedNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updateNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/notes/1', {
			text: 'Updated text',
			contact_id: '123',
			deal_id: undefined,
			task_id: null,
			user_id: '',
		});
		expect(result).toEqual(updatedNoteData);
	});
});
