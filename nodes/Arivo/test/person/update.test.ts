import * as updatePerson from '../../PersonOperations';
import { createMockExecuteFunction, mockPersonData } from '../helpers';
import { arivoApiRequest } from '../../GenericFunctions';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Person Update Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should update a person with minimal fields', async () => {
		const nodeParameters = {
			personId: '123',
			updateFields: {},
		};

		const expectedRequestBody = {
			contact_type: 'person',
		};

		const updatedPersonData = { ...mockPersonData, updated_at: '2023-01-03T10:00:00Z' };
		mockArivoApiRequest.mockResolvedValue(updatedPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updatePerson.updatePerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/contacts/123', expectedRequestBody);
		expect(result).toEqual(updatedPersonData);
	});

	it('should update a person name', async () => {
		const nodeParameters = {
			personId: '123',
			updateFields: {
				updatePersonName: 'John Smith',
			},
		};

		const expectedRequestBody = {
			contact_type: 'person',
			name: 'John Smith',
		};

		const updatedPersonData = { ...mockPersonData, name: 'John Smith' };
		mockArivoApiRequest.mockResolvedValue(updatedPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updatePerson.updatePerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/contacts/123', expectedRequestBody);
		expect(result).toEqual(updatedPersonData);
	});

	it('should update person with additional fields', async () => {
		const nodeParameters = {
			personId: '123',
			updateFields: {
				cpf: '987.654.321-00',
				birth_date: '1985-06-15',
				position: 'Senior Engineer',
				company_id: '999',
				tags: 'senior,engineer',
				user_id: '888',
				team_id: '202',
			},
		};

		const expectedRequestBody = {
			contact_type: 'person',
			cpf: '987.654.321-00',
			birth_date: '1985-06-15',
			position: 'Senior Engineer',
			company_id: '999',
			tags: ['senior', 'engineer'],
			user_id: '888',
			team_id: '202',
		};

		const updatedPersonData = {
			...mockPersonData,
			cpf: '987.654.321-00',
			birth_date: '1985-06-15',
			position: 'Senior Engineer',
		};
		mockArivoApiRequest.mockResolvedValue(updatedPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updatePerson.updatePerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/contacts/123', expectedRequestBody);
		expect(result).toEqual(updatedPersonData);
	});

	it('should update person with emails', async () => {
		const nodeParameters = {
			personId: '123',
			updateFields: {
				email: {
					email: [
						{
							address: 'john.new@example.com',
							type: 'work',
						},
						{
							address: 'john.personal@gmail.com',
							type: 'personal',
						},
					],
				},
			},
		};

		const expectedRequestBody = {
			contact_type: 'person',
			emails: [
				{
					address: 'john.new@example.com',
					type: 'work',
				},
				{
					address: 'john.personal@gmail.com',
					type: 'personal',
				},
			],
		};

		const updatedPersonData = {
			...mockPersonData,
			emails: [
				{
					address: 'john.new@example.com',
					type: 'work',
				},
				{
					address: 'john.personal@gmail.com',
					type: 'personal',
				},
			],
		};
		mockArivoApiRequest.mockResolvedValue(updatedPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updatePerson.updatePerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/contacts/123', expectedRequestBody);
		expect(result).toEqual(updatedPersonData);
	});

	it('should update person with phones', async () => {
		const nodeParameters = {
			personId: '123',
			updateFields: {
				phone: {
					phone: [
						{
							number: '+55 11 77777-7777',
							type: 'mobile',
						},
					],
				},
			},
		};

		const expectedRequestBody = {
			contact_type: 'person',
			phones: [
				{
					number: '+55 11 77777-7777',
					type: 'mobile',
				},
			],
		};

		const updatedPersonData = {
			...mockPersonData,
			phones: [
				{
					number: '+55 11 77777-7777',
					type: 'mobile',
				},
			],
		};
		mockArivoApiRequest.mockResolvedValue(updatedPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updatePerson.updatePerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/contacts/123', expectedRequestBody);
		expect(result).toEqual(updatedPersonData);
	});

	it('should update person with addresses', async () => {
		const nodeParameters = {
			personId: '123',
			updateFields: {
				address: {
					address: [
						{
							street: '456 New Street',
							city: 'Rio de Janeiro',
							state: 'RJ',
							district: 'Ipanema',
							country: 'Brazil',
							zip: '22000-000',
							type: 'home',
						},
					],
				},
			},
		};

		const expectedRequestBody = {
			contact_type: 'person',
			addresses: [
				{
					street: '456 New Street',
					city: 'Rio de Janeiro',
					state: 'RJ',
					district: 'Ipanema',
					country: 'Brazil',
					zip: '22000-000',
					type: 'home',
				},
			],
		};

		const updatedPersonData = {
			...mockPersonData,
			addresses: [
				{
					street: '456 New Street',
					city: 'Rio de Janeiro',
					state: 'RJ',
					district: 'Ipanema',
					country: 'Brazil',
					zip: '22000-000',
					type: 'home',
				},
			],
		};
		mockArivoApiRequest.mockResolvedValue(updatedPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updatePerson.updatePerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/contacts/123', expectedRequestBody);
		expect(result).toEqual(updatedPersonData);
	});

	it('should update person with custom fields', async () => {
		const nodeParameters = {
			personId: '123',
			updateFields: {
				customFieldsUi: {
					customFieldsValues: [
						{
							field: 'custom_field_1',
							value: 'Updated Custom Value 1',
						},
						{
							field: 'custom_field_2',
							value: 'New Custom Value 2',
						},
					],
				},
			},
		};

		const expectedRequestBody = {
			contact_type: 'person',
			custom_fields: {
				custom_field_1: 'Updated Custom Value 1',
				custom_field_2: 'New Custom Value 2',
			},
		};

		const updatedPersonData = {
			...mockPersonData,
			custom_fields: {
				custom_field_1: 'Updated Custom Value 1',
				custom_field_2: 'New Custom Value 2',
			},
		};
		mockArivoApiRequest.mockResolvedValue(updatedPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updatePerson.updatePerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/contacts/123', expectedRequestBody);
		expect(result).toEqual(updatedPersonData);
	});

	it('should update person with all fields', async () => {
		const nodeParameters = {
			personId: '123',
			updateFields: {
				updatePersonName: 'John Updated',
				cpf: '111.222.333-44',
				birth_date: '1988-08-08',
				position: 'Lead Engineer',
				company_id: '777',
				email: {
					email: [
						{
							address: 'john.updated@example.com',
							type: 'work',
						},
					],
				},
				phone: {
					phone: [
						{
							number: '+55 11 66666-6666',
							type: 'mobile',
						},
					],
				},
				address: {
					address: [
						{
							street: '789 Updated St',
							city: 'Brasília',
							state: 'DF',
							country: 'Brazil',
							zip: '70000-000',
							type: 'work',
						},
					],
				},
				customFieldsUi: {
					customFieldsValues: [
						{
							field: 'custom_field_1',
							value: 'All Updated',
						},
					],
				},
				tags: 'updated,lead',
				user_id: '555',
				team_id: '303',
			},
		};

		const expectedRequestBody = {
			contact_type: 'person',
			name: 'John Updated',
			cpf: '111.222.333-44',
			birth_date: '1988-08-08',
			position: 'Lead Engineer',
			company_id: '777',
			emails: [
				{
					address: 'john.updated@example.com',
					type: 'work',
				},
			],
			phones: [
				{
					number: '+55 11 66666-6666',
					type: 'mobile',
				},
			],
			addresses: [
				{
					street: '789 Updated St',
					city: 'Brasília',
					state: 'DF',
					country: 'Brazil',
					zip: '70000-000',
					type: 'work',
				},
			],
			custom_fields: {
				custom_field_1: 'All Updated',
			},
			tags: ['updated', 'lead'],
			user_id: '555',
			team_id: '303',
		};

		const updatedPersonData = {
			...mockPersonData,
			name: 'John Updated',
			cpf: '111.222.333-44',
		};
		mockArivoApiRequest.mockResolvedValue(updatedPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await updatePerson.updatePerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/contacts/123', expectedRequestBody);
		expect(result).toEqual(updatedPersonData);
	});
});
