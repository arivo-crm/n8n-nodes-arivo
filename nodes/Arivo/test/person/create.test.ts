import * as createPerson from '../../PersonOperations';
import { createMockExecuteFunction, mockPersonData } from '../helpers';
import { arivoApiRequest } from '../../GenericFunctions';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Person Create Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should create a person with basic information', async () => {
		const nodeParameters = {
			personName: 'John Doe',
			additionalFields: {},
		};

		const expectedRequestBody = {
			name: 'John Doe',
			contact_type: 'person',
		};

		mockArivoApiRequest.mockResolvedValue(mockPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createPerson.createPerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);
		expect(result).toEqual(mockPersonData);
	});

	it('should create a person with additional fields', async () => {
		const nodeParameters = {
			personName: 'John Doe',
			additionalFields: {
				cpf: '123.456.789-00',
				birth_date: '1990-01-01',
				position: 'Software Engineer',
				company_id: '456',
				tags: 'tag1,tag2',
				user_id: '789',
				team_id: '101',
			},
		};

		const expectedRequestBody = {
			name: 'John Doe',
			contact_type: 'person',
			cpf: '123.456.789-00',
			birth_date: '1990-01-01',
			position: 'Software Engineer',
			company_id: '456',
			tags: ['tag1', 'tag2'],
			user_id: '789',
			team_id: '101',
		};

		mockArivoApiRequest.mockResolvedValue(mockPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createPerson.createPerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);
		expect(result).toEqual(mockPersonData);
	});

	it('should create a person with emails', async () => {
		const nodeParameters = {
			personName: 'John Doe',
			additionalFields: {
				email: {
					email: [
						{
							address: 'john.doe@example.com',
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
			name: 'John Doe',
			contact_type: 'person',
			emails: [
				{
					address: 'john.doe@example.com',
					type: 'work',
				},
				{
					address: 'john.personal@gmail.com',
					type: 'personal',
				},
			],
		};

		mockArivoApiRequest.mockResolvedValue(mockPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createPerson.createPerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);
		expect(result).toEqual(mockPersonData);
	});

	it('should create a person with phones', async () => {
		const nodeParameters = {
			personName: 'John Doe',
			additionalFields: {
				phone: {
					phone: [
						{
							number: '+55 11 99999-9999',
							type: 'mobile',
						},
						{
							number: '+55 11 88888-8888',
							type: 'work',
						},
					],
				},
			},
		};

		const expectedRequestBody = {
			name: 'John Doe',
			contact_type: 'person',
			phones: [
				{
					number: '+55 11 99999-9999',
					type: 'mobile',
				},
				{
					number: '+55 11 88888-8888',
					type: 'work',
				},
			],
		};

		mockArivoApiRequest.mockResolvedValue(mockPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createPerson.createPerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);
		expect(result).toEqual(mockPersonData);
	});

	it('should create a person with addresses', async () => {
		const nodeParameters = {
			personName: 'John Doe',
			additionalFields: {
				address: {
					address: [
						{
							street: '123 Main St',
							city: 'São Paulo',
							state: 'SP',
							district: 'Centro',
							country: 'Brazil',
							zip: '01234-567',
							type: 'work',
						},
					],
				},
			},
		};

		const expectedRequestBody = {
			name: 'John Doe',
			contact_type: 'person',
			addresses: [
				{
					street: '123 Main St',
					city: 'São Paulo',
					state: 'SP',
					district: 'Centro',
					country: 'Brazil',
					zip: '01234-567',
					type: 'work',
				},
			],
		};

		mockArivoApiRequest.mockResolvedValue(mockPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createPerson.createPerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);
		expect(result).toEqual(mockPersonData);
	});

	it('should create a person with custom fields', async () => {
		const nodeParameters = {
			personName: 'John Doe',
			additionalFields: {
				customFieldsUi: {
					customFieldsValues: [
						{
							field: 'custom_field_1',
							value: 'Custom Value 1',
						},
						{
							field: 'custom_field_2',
							value: 'Custom Value 2',
						},
					],
				},
			},
		};

		const expectedRequestBody = {
			name: 'John Doe',
			contact_type: 'person',
			custom_fields: {
				custom_field_1: 'Custom Value 1',
				custom_field_2: 'Custom Value 2',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createPerson.createPerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);
		expect(result).toEqual(mockPersonData);
	});

	it('should filter out empty emails, phones, and addresses', async () => {
		const nodeParameters = {
			personName: 'John Doe',
			additionalFields: {
				email: {
					email: [
						{
							address: 'john.doe@example.com',
							type: 'work',
						},
						{
							address: '', // Empty email should be filtered out
							type: 'personal',
						},
					],
				},
				phone: {
					phone: [
						{
							number: '', // Empty phone should be filtered out
							type: 'mobile',
						},
						{
							number: '+55 11 88888-8888',
							type: 'work',
						},
					],
				},
				address: {
					address: [
						{
							street: '', // Empty address should be filtered out
							city: 'São Paulo',
							type: 'work',
						},
						{
							street: '123 Main St',
							city: 'São Paulo',
							type: 'home',
						},
					],
				},
			},
		};

		const expectedRequestBody = {
			name: 'John Doe',
			contact_type: 'person',
			emails: [
				{
					address: 'john.doe@example.com',
					type: 'work',
				},
			],
			phones: [
				{
					number: '+55 11 88888-8888',
					type: 'work',
				},
			],
			addresses: [
				{
					street: '123 Main St',
					city: 'São Paulo',
					type: 'home',
				},
			],
		};

		mockArivoApiRequest.mockResolvedValue(mockPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createPerson.createPerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);
		expect(result).toEqual(mockPersonData);
	});

	it('should filter out custom fields with empty field names or values', async () => {
		const nodeParameters = {
			personName: 'John Doe',
			additionalFields: {
				customFieldsUi: {
					customFieldsValues: [
						{
							field: 'custom_field_1',
							value: 'Custom Value 1',
						},
						{
							field: '', // Empty field name should be filtered out
							value: 'Custom Value 2',
						},
						{
							field: 'custom_field_3',
							value: '', // Empty value should be filtered out
						},
					],
				},
			},
		};

		const expectedRequestBody = {
			name: 'John Doe',
			contact_type: 'person',
			custom_fields: {
				custom_field_1: 'Custom Value 1',
			},
		};

		mockArivoApiRequest.mockResolvedValue(mockPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await createPerson.createPerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);
		expect(result).toEqual(mockPersonData);
	});
});