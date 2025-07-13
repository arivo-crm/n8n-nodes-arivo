import { createNote } from '../../NoteOperations';
import { arivoApiRequest } from '../../GenericFunctions';
import { createMockExecuteFunction, mockNoteData } from '../helpers';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Note Create Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should create a note with basic text', async () => {
		const nodeParameters = {
			text: 'This is a test note',
			additionalFields: {},
		};

		mockArivoApiRequest.mockResolvedValue(mockNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/notes', {
			text: 'This is a test note',
		});
		expect(result).toEqual(mockNoteData);
	});

	it('should create a note with additional fields', async () => {
		const nodeParameters = {
			text: 'Note with additional fields',
			additionalFields: {
				contact_id: '123',
				deal_id: '456',
				user_id: '1',
				team_id: '2',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/notes', {
			text: 'Note with additional fields',
			contact_id: '123',
			deal_id: '456',
			user_id: '1',
			team_id: '2',
		});
		expect(result).toEqual(mockNoteData);
	});

	it('should create a note linked to a contact', async () => {
		const nodeParameters = {
			text: 'Note linked to contact',
			additionalFields: {
				contact_id: '123',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/notes', {
			text: 'Note linked to contact',
			contact_id: '123',
		});
		expect(result).toEqual(mockNoteData);
	});

	it('should create a note linked to a deal', async () => {
		const nodeParameters = {
			text: 'Note linked to deal',
			additionalFields: {
				deal_id: '456',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/notes', {
			text: 'Note linked to deal',
			deal_id: '456',
		});
		expect(result).toEqual(mockNoteData);
	});

	it('should create a note linked to a task', async () => {
		const nodeParameters = {
			text: 'Note linked to task',
			additionalFields: {
				task_id: '789',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/notes', {
			text: 'Note linked to task',
			task_id: '789',
		});
		expect(result).toEqual(mockNoteData);
	});

	it('should ignore empty additional fields', async () => {
		const nodeParameters = {
			text: 'Simple note',
			additionalFields: {
				contact_id: '',
				deal_id: null,
				task_id: undefined,
				user_id: '1',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockNoteData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createNote.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/notes', {
			text: 'Simple note',
			contact_id: '',
			deal_id: null,
			task_id: undefined,
			user_id: '1',
		});
		expect(result).toEqual(mockNoteData);
	});
});