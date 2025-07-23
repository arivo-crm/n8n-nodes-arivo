import * as companyOperations from '../../CompanyOperations';
import { createMockExecuteFunction, mockCompanyData } from '../helpers';
import { arivoApiRequest, arivoApiRequestAllItems } from '../../GenericFunctions';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
	arivoApiRequestAllItems: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;
const mockArivoApiRequestAllItems = arivoApiRequestAllItems as jest.MockedFunction<typeof arivoApiRequestAllItems>;

describe('Arivo Company CreateOrUpdate Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Create new company (no existing match)', () => {
		it('should create a new company when no match found by name', async () => {
			const nodeParameters = {
				companyName: 'New Tech Corp',
				matchField: 'name',
				additionalFields: {
					cnpj: '98.765.432/0001-00',
					website: 'https://newtech.com',
				},
			};

			const expectedRequestBody = {
				name: 'New Tech Corp',
				contact_type: 'company',
				cnpj: '98.765.432/0001-00',
				website: 'https://newtech.com',
			};

			const expectedNewCompany = {
				...mockCompanyData,
				name: 'New Tech Corp',
				cnpj: '98.765.432/0001-00',
				website: 'https://newtech.com',
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(expectedNewCompany);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await companyOperations.createOrUpdateCompany.call(mockExecuteFunction, 0);

			// Verify search was performed
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'company', name: 'New Tech Corp' }
			);

			// Verify creation was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);

			// Verify result includes operation metadata
			expect(result).toEqual({
				...expectedNewCompany,
				__n8n_operation: 'created',
			});
		});

		it('should create a new company when no match found by email', async () => {
			const nodeParameters = {
				companyName: 'Email Corp',
				matchField: 'email',
				additionalFields: {
					email: {
						email: [
							{
								address: 'info@emailcorp.com',
								type: 'work',
							},
						],
					},
				},
			};

			const expectedRequestBody = {
				name: 'Email Corp',
				contact_type: 'company',
				emails: [
					{
						address: 'info@emailcorp.com',
						type: 'work',
					},
				],
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockCompanyData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await companyOperations.createOrUpdateCompany.call(mockExecuteFunction, 0);

			// Verify search was performed with email
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'company', email: 'info@emailcorp.com' }
			);

			// Verify creation was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);

			expect(result.__n8n_operation).toBe('created');
		});

		it('should create a new company when no match found by CNPJ', async () => {
			const nodeParameters = {
				companyName: 'CNPJ Corp',
				matchField: 'cnpj',
				additionalFields: {
					cnpj: '11.222.333/0001-44',
				},
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockCompanyData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await companyOperations.createOrUpdateCompany.call(mockExecuteFunction, 0);

			// Verify search was performed with CNPJ
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'company', cnpj: '11.222.333/0001-44' }
			);

			expect(result.__n8n_operation).toBe('created');
		});
	});

	describe('Update existing company (match found)', () => {
		it('should update existing company when match found by name', async () => {
			const existingCompany = {
				id: '123',
				name: 'Existing Corp',
				contact_type: 'company',
			};

			const nodeParameters = {
				companyName: 'Existing Corp',
				matchField: 'name',
				additionalFields: {
					website: 'https://updated.com',
					cnpj: '99.888.777/0001-66',
				},
			};

			const expectedRequestBody = {
				name: 'Existing Corp',
				contact_type: 'company',
				website: 'https://updated.com',
				cnpj: '99.888.777/0001-66',
			};

			const expectedUpdatedCompany = {
				...existingCompany,
				website: 'https://updated.com',
				cnpj: '99.888.777/0001-66',
			};

			// Mock search returning existing company
			mockArivoApiRequestAllItems.mockResolvedValue([existingCompany]);
			// Mock update
			mockArivoApiRequest.mockResolvedValue(expectedUpdatedCompany);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await companyOperations.createOrUpdateCompany.call(mockExecuteFunction, 0);

			// Verify search was performed
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'company', name: 'Existing Corp' }
			);

			// Verify update was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/contacts/123', expectedRequestBody);

			// Verify result includes operation metadata
			expect(result).toEqual({
				...expectedUpdatedCompany,
				__n8n_operation: 'updated',
			});
		});

		it('should update existing company when match found by email', async () => {
			const existingCompany = {
				id: '456',
				name: 'Email Corp',
				contact_type: 'company',
				emails: [{ address: 'old@emailcorp.com', type: 'work' }],
			};

			const nodeParameters = {
				companyName: 'Email Corp Updated',
				matchField: 'email',
				additionalFields: {
					email: {
						email: [
							{
								address: 'old@emailcorp.com',
								type: 'work',
							},
						],
					},
					website: 'https://updated-email-corp.com',
				},
			};

			// Mock search returning existing company
			mockArivoApiRequestAllItems.mockResolvedValue([existingCompany]);
			// Mock update
			mockArivoApiRequest.mockResolvedValue({
				...existingCompany,
				name: 'Email Corp Updated',
				website: 'https://updated-email-corp.com',
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await companyOperations.createOrUpdateCompany.call(mockExecuteFunction, 0);

			// Verify search was performed with email
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'company', email: 'old@emailcorp.com' }
			);

			// Verify update was performed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('PUT', '/contacts/456', expect.objectContaining({
				name: 'Email Corp Updated',
				website: 'https://updated-email-corp.com',
			}));

			expect(result.__n8n_operation).toBe('updated');
		});

		it('should update existing company when match found by CNPJ', async () => {
			const existingCompany = {
				id: '789',
				name: 'CNPJ Corp',
				contact_type: 'company',
				cnpj: '55.666.777/0001-88',
			};

			const nodeParameters = {
				companyName: 'CNPJ Corp Updated',
				matchField: 'cnpj',
				additionalFields: {
					cnpj: '55.666.777/0001-88',
					website: 'https://cnpj-updated.com',
				},
			};

			// Mock search returning existing company
			mockArivoApiRequestAllItems.mockResolvedValue([existingCompany]);
			// Mock update
			mockArivoApiRequest.mockResolvedValue({
				...existingCompany,
				name: 'CNPJ Corp Updated',
				website: 'https://cnpj-updated.com',
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await companyOperations.createOrUpdateCompany.call(mockExecuteFunction, 0);

			// Verify search was performed with CNPJ
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'company', cnpj: '55.666.777/0001-88' }
			);

			expect(result.__n8n_operation).toBe('updated');
		});
	});

	describe('Edge cases and error handling', () => {
		it('should create new company when search value is missing for email match', async () => {
			const nodeParameters = {
				companyName: 'No Email Corp',
				matchField: 'email',
				additionalFields: {
					// No email provided
				},
			};

			// Mock creation (search should be skipped)
			mockArivoApiRequest.mockResolvedValue(mockCompanyData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await companyOperations.createOrUpdateCompany.call(mockExecuteFunction, 0);

			// Verify search was NOT performed since no email was provided
			expect(mockArivoApiRequestAllItems).not.toHaveBeenCalled();

			// Verify creation was performed instead
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expect.objectContaining({
				name: 'No Email Corp',
				contact_type: 'company',
			}));

			expect(result.__n8n_operation).toBe('created');
		});

		it('should create new company when search value is missing for CNPJ match', async () => {
			const nodeParameters = {
				companyName: 'No CNPJ Corp',
				matchField: 'cnpj',
				additionalFields: {
					// No CNPJ provided
				},
			};

			// Mock creation (search should be skipped)
			mockArivoApiRequest.mockResolvedValue(mockCompanyData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await companyOperations.createOrUpdateCompany.call(mockExecuteFunction, 0);

			// Verify search was NOT performed since no CNPJ was provided
			expect(mockArivoApiRequestAllItems).not.toHaveBeenCalled();

			// Verify creation was performed instead
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expect.objectContaining({
				name: 'No CNPJ Corp',
				contact_type: 'company',
			}));

			expect(result.__n8n_operation).toBe('created');
		});

		it('should create new company when search fails due to API error', async () => {
			const nodeParameters = {
				companyName: 'Search Error Corp',
				matchField: 'name',
				additionalFields: {
					website: 'https://searcherror.com',
				},
			};

			// Mock search throwing an error
			mockArivoApiRequestAllItems.mockRejectedValue(new Error('API Search Error'));
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockCompanyData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await companyOperations.createOrUpdateCompany.call(mockExecuteFunction, 0);

			// Verify search was attempted
			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts',
				{},
				{ contact_type: 'company', name: 'Search Error Corp' }
			);

			// Verify creation was performed as fallback
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expect.objectContaining({
				name: 'Search Error Corp',
				contact_type: 'company',
				website: 'https://searcherror.com',
			}));

			expect(result.__n8n_operation).toBe('created');
		});

		it('should handle company with complex data including phones, emails, addresses, and custom fields', async () => {
			const nodeParameters = {
				companyName: 'Complex Corp',
				matchField: 'name',
				additionalFields: {
					cnpj: '12.345.678/0001-90',
					website: 'https://complex.com',
					main_contact_id: '999',
					email: {
						email: [
							{
								address: 'info@complex.com',
								type: 'work',
							},
							{
								address: 'support@complex.com',
								type: 'work',
							},
						],
					},
					phone: {
						phone: [
							{
								number: '(11) 1234-5678',
								type: 'work',
							},
						],
					},
					address: {
						address: [
							{
								street: '123 Business Ave',
								city: 'São Paulo',
								state: 'SP',
								country: 'Brazil',
								zip: '01234-567',
								type: 'work',
							},
						],
					},
					customFieldsUi: {
						customFieldsValues: [
							{
								field: 'industry',
								value: 'Technology',
							},
							{
								field: 'employees',
								value: '100-500',
							},
						],
					},
					tags: 'corporate,technology,startup',
				},
			};

			const expectedRequestBody = {
				name: 'Complex Corp',
				contact_type: 'company',
				cnpj: '12.345.678/0001-90',
				website: 'https://complex.com',
				main_contact_id: '999',
				emails: [
					{
						address: 'info@complex.com',
						type: 'work',
					},
					{
						address: 'support@complex.com',
						type: 'work',
					},
				],
				phones: [
					{
						number: '(11) 1234-5678',
						type: 'work',
					},
				],
				addresses: [
					{
						street: '123 Business Ave',
						city: 'São Paulo',
						state: 'SP',
						country: 'Brazil',
						zip: '01234-567',
						type: 'work',
					},
				],
				custom_fields: {
					industry: 'Technology',
					employees: '100-500',
				},
				tags: ['corporate', 'technology', 'startup'],
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue({
				...mockCompanyData,
				...expectedRequestBody,
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await companyOperations.createOrUpdateCompany.call(mockExecuteFunction, 0);

			// Verify creation was performed with all fields properly transformed
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);

			expect(result.__n8n_operation).toBe('created');
		});

		it('should filter out empty emails, phones, and addresses', async () => {
			const nodeParameters = {
				companyName: 'Filter Corp',
				matchField: 'name',
				additionalFields: {
					email: {
						email: [
							{
								address: 'valid@filter.com',
								type: 'work',
							},
							{
								address: '', // Should be filtered out
								type: 'work',
							},
						],
					},
					phone: {
						phone: [
							{
								number: '', // Should be filtered out
								type: 'work',
							},
							{
								number: '(11) 9999-8888',
								type: 'work',
							},
						],
					},
					address: {
						address: [
							{
								street: '', // Should be filtered out
								city: 'São Paulo',
								type: 'work',
							},
							{
								street: '123 Valid St',
								city: 'São Paulo',
								type: 'work',
							},
						],
					},
				},
			};

			const expectedRequestBody = {
				name: 'Filter Corp',
				contact_type: 'company',
				emails: [
					{
						address: 'valid@filter.com',
						type: 'work',
					},
				],
				phones: [
					{
						number: '(11) 9999-8888',
						type: 'work',
					},
				],
				addresses: [
					{
						street: '123 Valid St',
						city: 'São Paulo',
						type: 'work',
					},
				],
			};

			// Mock search returning no results
			mockArivoApiRequestAllItems.mockResolvedValue([]);
			// Mock creation
			mockArivoApiRequest.mockResolvedValue(mockCompanyData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			await companyOperations.createOrUpdateCompany.call(mockExecuteFunction, 0);

			// Verify only valid entries were included
			expect(mockArivoApiRequest).toHaveBeenCalledWith('POST', '/contacts', expectedRequestBody);
		});
	});
});