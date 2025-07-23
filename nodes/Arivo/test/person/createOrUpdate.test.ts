import * as personOperations from '../../PersonOperations';
import { createMockExecuteFunction, mockPersonData } from '../helpers';
import { arivoApiRequest, arivoApiRequestAllItems } from '../../GenericFunctions';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
	arivoApiRequestAllItems: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;
const mockArivoApiRequestAllItems = arivoApiRequestAllItems as jest.MockedFunction<typeof arivoApiRequestAllItems>;

describe('Arivo Person CreateOrUpdate Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Create new person (no existing match)', () => {
		it('should create a new person when no match found by name', async () => {
			const nodeParameters = {
				personName: 'New Person',
				matchField: 'name',
				additionalFields: {
					cpf: '111.222.333-44',
					position: 'Developer',
				},
			};

			const expectedRequestBody = {
				name: 'New Person',
				contact_type: 'person',
				cpf: '111.222.333-44',
				position: 'Developer',
			};

			const expectedNewPerson = {
				...mockPersonData,
				name: 'New Person',
				cpf: '111.222.333-44',
				position: 'Developer',
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(expectedNewPerson);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await personOperations.createOrUpdatePerson.call(mockExecuteFunction, 0);

			// Verify search was performed
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'person', name: 'New Person' }
			);

			// Verify creation was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);

			// Verify result includes operation metadata
			expect(result).toEqual({
				...expectedNewPerson,
				__n8n_operation: 'created',
			});
		});

		it('should create a new person when no match found by email', async () => {
			const nodeParameters = {
				personName: 'Email Person',
				matchField: 'email',
				additionalFields: {
					email: {
						email: [
							{
								address: 'newperson@example.com',
								type: 'work',
							},
						],
					},
					position: 'Manager',
				},
			};

			const expectedRequestBody = {
				name: 'Email Person',
				contact_type: 'person',
				emails: [
					{
						address: 'newperson@example.com',
						type: 'work',
					},
				],
				position: 'Manager',
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockPersonData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await personOperations.createOrUpdatePerson.call(mockExecuteFunction, 0);

			// Verify search was performed with email
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'person', email: 'newperson@example.com' }
			);

			// Verify creation was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);

			expect(result.__n8n_operation).toBe('created');
		});

		it('should create a new person when no match found by CPF', async () => {
			const nodeParameters = {
				personName: 'CPF Person',
				matchField: 'cpf',
				additionalFields: {
					cpf: '999.888.777-66',
					birth_date: '1985-05-15',
				},
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockPersonData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await personOperations.createOrUpdatePerson.call(mockExecuteFunction, 0);

			// Verify search was performed with CPF
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'person', cpf: '999.888.777-66' }
			);

			expect(result.__n8n_operation).toBe('created');
		});

		it('should create a new person when no match found by phone', async () => {
			const nodeParameters = {
				personName: 'Phone Person',
				matchField: 'phone',
				additionalFields: {
					phone: {
						phone: [
							{
								number: '+55 11 98765-4321',
								type: 'mobile',
							},
						],
					},
					position: 'Sales',
				},
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockPersonData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await personOperations.createOrUpdatePerson.call(mockExecuteFunction, 0);

			// Verify search was performed with phone
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'person', phone: '+55 11 98765-4321' }
			);

			expect(result.__n8n_operation).toBe('created');
		});
	});

	describe('Update existing person (match found)', () => {
		it('should update existing person when match found by name', async () => {
			const existingPerson = {
				id: '123',
				name: 'Existing Person',
				contact_type: 'person',
			};

			const nodeParameters = {
				personName: 'Existing Person',
				matchField: 'name',
				additionalFields: {
					position: 'Updated Position',
					birth_date: '1990-01-01',
				},
			};

			const expectedRequestBody = {
				name: 'Existing Person',
				contact_type: 'person',
				position: 'Updated Position',
				birth_date: '1990-01-01',
			};

			const expectedUpdatedPerson = {
				...existingPerson,
				position: 'Updated Position',
				birth_date: '1990-01-01',
			};

			// Mock search returning existing person
			mockArivoApiRequestAllItems.mockResolvedValue([existingPerson]);
			// Mock update
			mockArivoApiRequest.mockResolvedValue(expectedUpdatedPerson);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await personOperations.createOrUpdatePerson.call(mockExecuteFunction, 0);

			// Verify search was performed
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'person', name: 'Existing Person' }
			);

			// Verify update was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/contacts/123', expectedRequestBody);

			// Verify result includes operation metadata
			expect(result).toEqual({
				...expectedUpdatedPerson,
				__n8n_operation: 'updated',
			});
		});

		it('should update existing person when match found by email', async () => {
			const existingPerson = {
				id: '456',
				name: 'Email Person',
				contact_type: 'person',
				emails: [{ address: 'existing@example.com', type: 'work' }],
			};

			const nodeParameters = {
				personName: 'Updated Email Person',
				matchField: 'email',
				additionalFields: {
					email: {
						email: [
							{
								address: 'existing@example.com',
								type: 'work',
							},
						],
					},
					position: 'Updated Manager',
				},
			};

			// Mock search returning existing person
			mockArivoApiRequestAllItems.mockResolvedValue([existingPerson]);
			// Mock update
			mockArivoApiRequest.mockResolvedValue({
				...existingPerson,
				name: 'Updated Email Person',
				position: 'Updated Manager',
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await personOperations.createOrUpdatePerson.call(mockExecuteFunction, 0);

			// Verify search was performed with email
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'person', email: 'existing@example.com' }
			);

			// Verify update was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/contacts/456', expect.objectContaining({
				name: 'Updated Email Person',
				position: 'Updated Manager',
			}));

			expect(result.__n8n_operation).toBe('updated');
		});

		it('should update existing person when match found by CPF', async () => {
			const existingPerson = {
				id: '789',
				name: 'CPF Person',
				contact_type: 'person',
				cpf: '123.456.789-00',
			};

			const nodeParameters = {
				personName: 'Updated CPF Person',
				matchField: 'cpf',
				additionalFields: {
					cpf: '123.456.789-00',
					position: 'Senior Developer',
				},
			};

			// Mock search returning existing person
			mockArivoApiRequestAllItems.mockResolvedValue([existingPerson]);
			// Mock update
			mockArivoApiRequest.mockResolvedValue({
				...existingPerson,
				name: 'Updated CPF Person',
				position: 'Senior Developer',
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await personOperations.createOrUpdatePerson.call(mockExecuteFunction, 0);

			// Verify search was performed with CPF
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'person', cpf: '123.456.789-00' }
			);

			expect(result.__n8n_operation).toBe('updated');
		});

		it('should update existing person when match found by phone', async () => {
			const existingPerson = {
				id: '101',
				name: 'Phone Person',
				contact_type: 'person',
				phones: [{ number: '+55 11 99999-8888', type: 'mobile' }],
			};

			const nodeParameters = {
				personName: 'Updated Phone Person',
				matchField: 'phone',
				additionalFields: {
					phone: {
						phone: [
							{
								number: '+55 11 99999-8888',
								type: 'mobile',
							},
						],
					},
					position: 'Updated Sales',
				},
			};

			// Mock search returning existing person
			mockArivoApiRequestAllItems.mockResolvedValue([existingPerson]);
			// Mock update
			mockArivoApiRequest.mockResolvedValue({
				...existingPerson,
				name: 'Updated Phone Person',
				position: 'Updated Sales',
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await personOperations.createOrUpdatePerson.call(mockExecuteFunction, 0);

			// Verify search was performed with phone
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'person', phone: '+55 11 99999-8888' }
			);

			expect(result.__n8n_operation).toBe('updated');
		});
	});

	describe('Edge cases and error handling', () => {
		it('should create new person when search value is missing for email match', async () => {
			const nodeParameters = {
				personName: 'No Email Person',
				matchField: 'email',
				additionalFields: {
					// No email provided
					position: 'Developer',
				},
			};

			// Mock creation (search should be skipped)
			mockArivoApiRequest.mockResolvedValue(mockPersonData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await personOperations.createOrUpdatePerson.call(mockExecuteFunction, 0);

			// Verify search was NOT performed since no email was provided
			expect(mockArivoApiRequestAllItems).not.toHaveBeenCalled();

			// Verify creation was performed instead
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expect.objectContaining({
				name: 'No Email Person',
				contact_type: 'person',
				position: 'Developer',
			}));

			expect(result.__n8n_operation).toBe('created');
		});

		it('should create new person when search value is missing for CPF match', async () => {
			const nodeParameters = {
				personName: 'No CPF Person',
				matchField: 'cpf',
				additionalFields: {
					// No CPF provided
					position: 'Manager',
				},
			};

			// Mock creation (search should be skipped)
			mockArivoApiRequest.mockResolvedValue(mockPersonData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await personOperations.createOrUpdatePerson.call(mockExecuteFunction, 0);

			// Verify search was NOT performed since no CPF was provided
			expect(mockArivoApiRequestAllItems).not.toHaveBeenCalled();

			expect(result.__n8n_operation).toBe('created');
		});

		it('should create new person when search value is missing for phone match', async () => {
			const nodeParameters = {
				personName: 'No Phone Person',
				matchField: 'phone',
				additionalFields: {
					// No phone provided
					position: 'Sales',
				},
			};

			// Mock creation (search should be skipped)
			mockArivoApiRequest.mockResolvedValue(mockPersonData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await personOperations.createOrUpdatePerson.call(mockExecuteFunction, 0);

			// Verify search was NOT performed since no phone was provided
			expect(mockArivoApiRequestAllItems).not.toHaveBeenCalled();

			expect(result.__n8n_operation).toBe('created');
		});

		it('should create new person when search fails due to API error', async () => {
			const nodeParameters = {
				personName: 'Search Error Person',
				matchField: 'name',
				additionalFields: {
					position: 'Developer',
				},
			};

			// Mock search throwing an error
			mockArivoApiRequestAllItems.mockRejectedValue(new Error('API Search Error'));
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockPersonData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await personOperations.createOrUpdatePerson.call(mockExecuteFunction, 0);

			// Verify search was attempted
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'person', name: 'Search Error Person' }
			);

			// Verify creation was performed as fallback
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expect.objectContaining({
				name: 'Search Error Person',
				contact_type: 'person',
				position: 'Developer',
			}));

			expect(result.__n8n_operation).toBe('created');
		});

		it('should handle person with complex data including phones, emails, addresses, and custom fields', async () => {
			const nodeParameters = {
				personName: 'Complex Person',
				matchField: 'name',
				additionalFields: {
					cpf: '123.456.789-00',
					birth_date: '1985-03-15',
					position: 'Tech Lead',
					company_id: '999',
					email: {
						email: [
							{
								address: 'complex@example.com',
								type: 'work',
							},
							{
								address: 'personal@gmail.com',
								type: 'home',
							},
						],
					},
					phone: {
						phone: [
							{
								number: '+55 11 91234-5678',
								type: 'mobile',
							},
							{
								number: '(11) 3456-7890',
								type: 'work',
							},
						],
					},
					address: {
						address: [
							{
								street: '123 Developer Street',
								city: 'São Paulo',
								state: 'SP',
								country: 'Brazil',
								zip: '01234-567',
								type: 'home',
							},
						],
					},
					customFieldsUi: {
						customFieldsValues: [
							{
								field: 'skill_level',
								value: 'Senior',
							},
							{
								field: 'department',
								value: 'Engineering',
							},
						],
					},
					tags: 'developer,senior,fullstack',
				},
			};

			const expectedRequestBody = {
				name: 'Complex Person',
				contact_type: 'person',
				cpf: '123.456.789-00',
				birth_date: '1985-03-15',
				position: 'Tech Lead',
				company_id: '999',
				emails: [
					{
						address: 'complex@example.com',
						type: 'work',
					},
					{
						address: 'personal@gmail.com',
						type: 'home',
					},
				],
				phones: [
					{
						number: '+55 11 91234-5678',
						type: 'mobile',
					},
					{
						number: '(11) 3456-7890',
						type: 'work',
					},
				],
				addresses: [
					{
						street: '123 Developer Street',
						city: 'São Paulo',
						state: 'SP',
						country: 'Brazil',
						zip: '01234-567',
						type: 'home',
					},
				],
				custom_fields: {
					skill_level: 'Senior',
					department: 'Engineering',
				},
				tags: ['developer', 'senior', 'fullstack'],
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue({
				...mockPersonData,
				...expectedRequestBody,
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await personOperations.createOrUpdatePerson.call(mockExecuteFunction, 0);

			// Verify creation was performed with all fields properly transformed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);

			expect(result.__n8n_operation).toBe('created');
		});

		it('should filter out empty emails, phones, and addresses', async () => {
			const nodeParameters = {
				personName: 'Filter Person',
				matchField: 'name',
				additionalFields: {
					email: {
						email: [
							{
								address: 'valid@example.com',
								type: 'work',
							},
							{
								address: '', // Should be filtered out
								type: 'personal',
							},
						],
					},
					phone: {
						phone: [
							{
								number: '', // Should be filtered out
								type: 'mobile',
							},
							{
								number: '+55 11 98765-4321',
								type: 'work',
							},
						],
					},
					address: {
						address: [
							{
								street: '', // Should be filtered out
								city: 'São Paulo',
								type: 'home',
							},
							{
								street: '123 Valid Street',
								city: 'São Paulo',
								type: 'work',
							},
						],
					},
				},
			};

			const expectedRequestBody = {
				name: 'Filter Person',
				contact_type: 'person',
				emails: [
					{
						address: 'valid@example.com',
						type: 'work',
					},
				],
				phones: [
					{
						number: '+55 11 98765-4321',
						type: 'work',
					},
				],
				addresses: [
					{
						street: '123 Valid Street',
						city: 'São Paulo',
						type: 'work',
					},
				],
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockPersonData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			await personOperations.createOrUpdatePerson.call(mockExecuteFunction, 0);

			// Verify only valid entries were included
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);
		});

		it('should filter out custom fields with empty field names or values', async () => {
			const nodeParameters = {
				personName: 'Custom Fields Person',
				matchField: 'name',
				additionalFields: {
					customFieldsUi: {
						customFieldsValues: [
							{
								field: 'valid_field',
								value: 'Valid Value',
							},
							{
								field: '', // Empty field name should be filtered out
								value: 'Some Value',
							},
							{
								field: 'another_field',
								value: '', // Empty value should be filtered out
							},
						],
					},
				},
			};

			const expectedRequestBody = {
				name: 'Custom Fields Person',
				contact_type: 'person',
				custom_fields: {
					valid_field: 'Valid Value',
				},
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockPersonData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			await personOperations.createOrUpdatePerson.call(mockExecuteFunction, 0);

			// Verify only valid custom fields were included
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);
		});
	});
});