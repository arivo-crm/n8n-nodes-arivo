import * as getPersons from '../../PersonOperations';
import { createMockExecuteFunction, mockPersonsListResponse } from '../helpers';
import { arivoApiRequestAllItems } from '../../GenericFunctions';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequestAllItems: jest.fn(),
}));

const mockArivoApiRequestAllItems = arivoApiRequestAllItems as jest.MockedFunction<typeof arivoApiRequestAllItems>;

describe('Arivo Person GetMany Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should get all persons with default filter', async () => {
		const nodeParameters = {
			filters: {},
			options: {},
		};

		const expectedQuery = {
			contact_type: 'person',
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockPersonsListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getPersons.getPersons.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/contacts', {}, expectedQuery);
		expect(result).toEqual(mockPersonsListResponse.data);
	});

	it('should get persons with name filter', async () => {
		const nodeParameters = {
			filters: {
				name: 'John',
			},
			options: {},
		};

		const expectedQuery = {
			contact_type: 'person',
			name: 'John',
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockPersonsListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getPersons.getPersons.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/contacts', {}, expectedQuery);
		expect(result).toEqual(mockPersonsListResponse.data);
	});

	it('should get persons with CPF filter', async () => {
		const nodeParameters = {
			filters: {
				cpf: '123.456.789-00',
			},
			options: {},
		};

		const expectedQuery = {
			contact_type: 'person',
			cpf: '123.456.789-00',
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockPersonsListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getPersons.getPersons.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/contacts', {}, expectedQuery);
		expect(result).toEqual(mockPersonsListResponse.data);
	});

	it('should get persons with email filter', async () => {
		const nodeParameters = {
			filters: {
				email: 'john.doe@example.com',
			},
			options: {},
		};

		const expectedQuery = {
			contact_type: 'person',
			email: 'john.doe@example.com',
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockPersonsListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getPersons.getPersons.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/contacts', {}, expectedQuery);
		expect(result).toEqual(mockPersonsListResponse.data);
	});

	it('should get persons with phone filter', async () => {
		const nodeParameters = {
			filters: {
				phone: '+55 11 99999-9999',
			},
			options: {},
		};

		const expectedQuery = {
			contact_type: 'person',
			phone: '+55 11 99999-9999',
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockPersonsListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getPersons.getPersons.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/contacts', {}, expectedQuery);
		expect(result).toEqual(mockPersonsListResponse.data);
	});

	it('should get persons with location filters', async () => {
		const nodeParameters = {
			filters: {
				city: 'São Paulo',
				state: 'SP',
				country: 'Brazil',
				district: 'Centro',
				zip_code: '01234-567',
			},
			options: {},
		};

		const expectedQuery = {
			contact_type: 'person',
			city: 'São Paulo',
			state: 'SP',
			country: 'Brazil',
			district: 'Centro',
			zip_code: '01234-567',
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockPersonsListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getPersons.getPersons.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/contacts', {}, expectedQuery);
		expect(result).toEqual(mockPersonsListResponse.data);
	});

	it('should get persons with organization filters', async () => {
		const nodeParameters = {
			filters: {
				company_id: '456',
				user_id: '789',
				team_id: '101',
			},
			options: {},
		};

		const expectedQuery = {
			contact_type: 'person',
			company_id: '456',
			user_id: '789',
			team_id: '101',
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockPersonsListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getPersons.getPersons.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/contacts', {}, expectedQuery);
		expect(result).toEqual(mockPersonsListResponse.data);
	});

	it('should get persons with tags filter', async () => {
		const nodeParameters = {
			filters: {
				tags: 'tag1,tag2',
			},
			options: {},
		};

		const expectedQuery = {
			contact_type: 'person',
			tags: 'tag1,tag2',
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockPersonsListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getPersons.getPersons.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/contacts', {}, expectedQuery);
		expect(result).toEqual(mockPersonsListResponse.data);
	});

	it('should get persons with sorting options', async () => {
		const nodeParameters = {
			filters: {
				sort_field: 'name',
				sort_order: 'asc',
			},
			options: {},
		};

		const expectedQuery = {
			contact_type: 'person',
			sort_field: 'name',
			sort_order: 'asc',
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockPersonsListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getPersons.getPersons.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/contacts', {}, expectedQuery);
		expect(result).toEqual(mockPersonsListResponse.data);
	});

	it('should get persons with multiple filters', async () => {
		const nodeParameters = {
			filters: {
				name: 'John',
				email: 'john@example.com',
				city: 'São Paulo',
				sort_field: 'created_at',
				sort_order: 'desc',
			},
			options: {},
		};

		const expectedQuery = {
			contact_type: 'person',
			name: 'John',
			email: 'john@example.com',
			city: 'São Paulo',
			sort_field: 'created_at',
			sort_order: 'desc',
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockPersonsListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getPersons.getPersons.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/contacts', {}, expectedQuery);
		expect(result).toEqual(mockPersonsListResponse.data);
	});

	it('should ignore empty filter values', async () => {
		const nodeParameters = {
			filters: {
				name: 'John',
				email: '', // Empty value should be ignored
				city: undefined, // Undefined value should be ignored
				phone: null, // Null value should be ignored
			},
			options: {},
		};

		const expectedQuery = {
			contact_type: 'person',
			name: 'John',
		};

		mockArivoApiRequestAllItems.mockResolvedValue(mockPersonsListResponse.data);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getPersons.getPersons.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith('GET', '/contacts', {}, expectedQuery);
		expect(result).toEqual(mockPersonsListResponse.data);
	});
});