import { getFiles } from '../../FileOperations';
import { arivoApiRequest, arivoApiRequestAllItems } from '../../GenericFunctions';
import { createMockExecuteFunction, mockFilesListResponse } from '../helpers';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
	arivoApiRequestAllItems: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;
const mockArivoApiRequestAllItems = arivoApiRequestAllItems as jest.MockedFunction<typeof arivoApiRequestAllItems>;

describe('Arivo File GetMany Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should get files with default parameters', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 20,
			filters: {},
			options: {},
		};

		mockArivoApiRequest.mockResolvedValue(mockFilesListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFiles.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files', {}, {
			per_page: 20,
		});
		expect(result).toEqual(mockFilesListResponse);
	});

	it('should get all files when returnAll is true', async () => {
		const nodeParameters = {
			returnAll: true,
			filters: {},
			options: {},
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockFilesListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFiles.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/attachment_files', {}, {});
		expect(result).toEqual(mockFilesListResponse);
	});

	it('should filter files by contact ID', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 20,
			filters: {
				contact_id: '123',
			},
			options: {},
		};

		mockArivoApiRequest.mockResolvedValue(mockFilesListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFiles.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files', {}, {
			per_page: 20,
			contact_id: '123',
		});
		expect(result).toEqual(mockFilesListResponse);
	});

	it('should filter files by deal ID', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 20,
			filters: {
				deal_id: '456',
			},
			options: {},
		};

		mockArivoApiRequest.mockResolvedValue(mockFilesListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFiles.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files', {}, {
			per_page: 20,
			deal_id: '456',
		});
		expect(result).toEqual(mockFilesListResponse);
	});

	it('should filter files by note ID', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 20,
			filters: {
				note_id: '789',
			},
			options: {},
		};

		mockArivoApiRequest.mockResolvedValue(mockFilesListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFiles.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files', {}, {
			per_page: 20,
			note_id: '789',
		});
		expect(result).toEqual(mockFilesListResponse);
	});

	it('should filter files by user ID', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 20,
			filters: {
				user_id: '1',
			},
			options: {},
		};

		mockArivoApiRequest.mockResolvedValue(mockFilesListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFiles.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files', {}, {
			per_page: 20,
			user_id: '1',
		});
		expect(result).toEqual(mockFilesListResponse);
	});

	it('should filter files by team ID', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 20,
			filters: {
				team_id: '2',
			},
			options: {},
		};

		mockArivoApiRequest.mockResolvedValue(mockFilesListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFiles.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files', {}, {
			per_page: 20,
			team_id: '2',
		});
		expect(result).toEqual(mockFilesListResponse);
	});

	it('should filter files by multiple criteria', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 20,
			filters: {
				contact_id: '123',
				user_id: '1',
			},
			options: {},
		};

		mockArivoApiRequest.mockResolvedValue(mockFilesListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFiles.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files', {}, {
			per_page: 20,
			contact_id: '123',
			user_id: '1',
		});
		expect(result).toEqual(mockFilesListResponse);
	});

	it('should sort files by name ascending', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 20,
			filters: {},
			options: {
				sort_field: 'name',
				sort_order: 'asc',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockFilesListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFiles.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files', {}, {
			per_page: 20,
			sort_field: 'name',
			sort_order: 'asc',
		});
		expect(result).toEqual(mockFilesListResponse);
	});

	it('should sort files by size descending', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 20,
			filters: {},
			options: {
				sort_field: 'size',
				sort_order: 'desc',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockFilesListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFiles.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files', {}, {
			per_page: 20,
			sort_field: 'size',
			sort_order: 'desc',
		});
		expect(result).toEqual(mockFilesListResponse);
	});

	it('should sort files by created_at descending', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 20,
			filters: {},
			options: {
				sort_field: 'created_at',
				sort_order: 'desc',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockFilesListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFiles.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files', {}, {
			per_page: 20,
			sort_field: 'created_at',
			sort_order: 'desc',
		});
		expect(result).toEqual(mockFilesListResponse);
	});

	it('should handle empty filters object', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 20,
			filters: {},
			options: {},
		};

		mockArivoApiRequest.mockResolvedValue(mockFilesListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFiles.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files', {}, {
			per_page: 20,
		});
		expect(result).toEqual(mockFilesListResponse);
	});

	it('should handle API errors gracefully', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 20,
			filters: {},
			options: {},
		};

		const error = new Error('API Error');
		mockArivoApiRequest.mockRejectedValue(error);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

		await expect(getFiles.call(mockExecuteFunction, 0)).rejects.toThrow('API Error');
		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
	});

	it('should return empty array for no results', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 20,
			filters: {},
			options: {},
		};

		mockArivoApiRequest.mockResolvedValue([]);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFiles.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files', {}, {
			per_page: 20,
		});
		expect(result).toEqual([]);
	});

	it('should ignore empty filter values', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 20,
			filters: {
				contact_id: '123',
				deal_id: '',
				note_id: null,
				user_id: undefined,
			},
			options: {},
		};

		mockArivoApiRequest.mockResolvedValue(mockFilesListResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFiles.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files', {}, {
			per_page: 20,
			contact_id: '123',
		});
		expect(result).toEqual(mockFilesListResponse);
	});

	it('should handle single file response as array', async () => {
		const nodeParameters = {
			returnAll: false,
			limit: 20,
			filters: {},
			options: {},
		};

		const singleFileResponse = mockFilesListResponse[0];
		mockArivoApiRequest.mockResolvedValue(singleFileResponse);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getFiles.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/attachment_files', {}, {
			per_page: 20,
		});
		expect(result).toEqual([singleFileResponse]);
	});
});
