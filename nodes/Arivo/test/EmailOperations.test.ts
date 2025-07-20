import { createMockExecuteFunction, mockEmailData, mockEmailsListResponse } from './helpers';
import * as EmailOperations from '../EmailOperations';

// Mock the GenericFunctions module
jest.mock('../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
	arivoApiRequestAllItems: jest.fn(),
}));

import { arivoApiRequest, arivoApiRequestAllItems } from '../GenericFunctions';

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;
const mockArivoApiRequestAllItems = arivoApiRequestAllItems as jest.MockedFunction<typeof arivoApiRequestAllItems>;

describe('Email Operations', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('createEmail', () => {
		it('should create an email successfully', async () => {
			const nodeParameters = {
				contactId: '123',
				address: 'john.doe@example.com',
				email_type: 'work',
			};

			mockArivoApiRequest.mockResolvedValue(mockEmailData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await EmailOperations.createEmail.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'POST',
				'/contacts/123/emails',
				{
					address: 'john.doe@example.com',
					email_type: 'work',
				}
			);
			expect(result).toEqual(mockEmailData);
		});

		it('should handle different email types', async () => {
			const nodeParameters = {
				contactId: '123',
				address: 'john.personal@example.com',
				email_type: 'home',
			};

			mockArivoApiRequest.mockResolvedValue({
				...mockEmailData,
				address: 'john.personal@example.com',
				email_type: 'home',
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await EmailOperations.createEmail.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'POST',
				'/contacts/123/emails',
				{
					address: 'john.personal@example.com',
					email_type: 'home',
				}
			);
			expect(result.email_type).toBe('home');
		});

		it('should handle API errors', async () => {
			const nodeParameters = {
				contactId: '123',
				address: 'john.doe@example.com',
				email_type: 'work',
			};

			const error = new Error('API Error');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			await expect(EmailOperations.createEmail.call(mockExecuteFunction, 0)).rejects.toThrow('API Error');
		});
	});

	describe('getEmail', () => {
		it('should retrieve an email successfully', async () => {
			const nodeParameters = {
				contactId: '123',
				emailId: '1',
			};

			mockArivoApiRequest.mockResolvedValue(mockEmailData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await EmailOperations.getEmail.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/emails/1'
			);
			expect(result).toEqual(mockEmailData);
		});

		it('should handle email not found', async () => {
			const nodeParameters = {
				contactId: '123',
				emailId: '999',
			};

			const error = new Error('Email not found');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			await expect(EmailOperations.getEmail.call(mockExecuteFunction, 0)).rejects.toThrow('Email not found');
		});
	});

	describe('updateEmail', () => {
		it('should update an email successfully', async () => {
			const nodeParameters = {
				contactId: '123',
				emailId: '1',
				updateFields: {
					address: 'john.updated@example.com',
					email_type: 'home',
				},
			};

			const updatedEmailData = {
				...mockEmailData,
				address: 'john.updated@example.com',
				email_type: 'home',
			};

			mockArivoApiRequest.mockResolvedValue(updatedEmailData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await EmailOperations.updateEmail.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'PUT',
				'/contacts/123/emails/1',
				{
					address: 'john.updated@example.com',
					email_type: 'home',
				}
			);
			expect(result).toEqual(updatedEmailData);
		});

		it('should handle partial updates', async () => {
			const nodeParameters = {
				contactId: '123',
				emailId: '1',
				updateFields: {
					address: 'john.new@example.com',
				},
			};

			const updatedEmailData = {
				...mockEmailData,
				address: 'john.new@example.com',
			};

			mockArivoApiRequest.mockResolvedValue(updatedEmailData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await EmailOperations.updateEmail.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'PUT',
				'/contacts/123/emails/1',
				{
					address: 'john.new@example.com',
				}
			);
			expect(result.address).toBe('john.new@example.com');
		});

		it('should handle empty update fields', async () => {
			const nodeParameters = {
				contactId: '123',
				emailId: '1',
				updateFields: {},
			};

			mockArivoApiRequest.mockResolvedValue(mockEmailData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await EmailOperations.updateEmail.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'PUT',
				'/contacts/123/emails/1',
				{}
			);
			expect(result).toEqual(mockEmailData);
		});
	});

	describe('deleteEmail', () => {
		it('should delete an email successfully', async () => {
			const nodeParameters = {
				contactId: '123',
				emailId: '1',
			};

			const expectedResponse = { deleted: true };
			mockArivoApiRequest.mockResolvedValue({});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await EmailOperations.deleteEmail.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'DELETE',
				'/contacts/123/emails/1'
			);
			expect(result).toEqual(expectedResponse);
		});

		it('should handle delete errors', async () => {
			const nodeParameters = {
				contactId: '123',
				emailId: '1',
			};

			const error = new Error('Failed to delete email');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			await expect(EmailOperations.deleteEmail.call(mockExecuteFunction, 0)).rejects.toThrow('Failed to delete email');
		});
	});

	describe('getEmails', () => {
		it('should retrieve emails successfully', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {},
				options: {},
			};

			mockArivoApiRequestAllItems.mockResolvedValue(mockEmailsListResponse);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await EmailOperations.getEmails.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/emails',
				{},
				{}
			);
			expect(result).toEqual(mockEmailsListResponse);
		});

		it('should filter emails by email type', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {
					email_type: 'work',
				},
				options: {},
			};

			mockArivoApiRequestAllItems.mockResolvedValue(mockEmailsListResponse);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await EmailOperations.getEmails.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/emails',
				{},
				{
					email_type: 'work',
				}
			);
			expect(result).toEqual(mockEmailsListResponse);
		});

		it('should sort emails by address ascending', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {},
				options: {
					sort_field: 'address',
					sort_order: 'asc',
				},
			};

			mockArivoApiRequestAllItems.mockResolvedValue(mockEmailsListResponse);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await EmailOperations.getEmails.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/emails',
				{},
				{
					sort_field: 'address',
					sort_order: 'asc',
				}
			);
			expect(result).toEqual(mockEmailsListResponse);
		});

		it('should handle multiple filters and options', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {
					email_type: 'home',
				},
				options: {
					sort_field: 'created_at',
					sort_order: 'desc',
				},
			};

			mockArivoApiRequestAllItems.mockResolvedValue(mockEmailsListResponse);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await EmailOperations.getEmails.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/emails',
				{},
				{
					email_type: 'home',
					sort_field: 'created_at',
					sort_order: 'desc',
				}
			);
			expect(result).toEqual(mockEmailsListResponse);
		});

		it('should return empty array for no results', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {},
				options: {},
			};

			mockArivoApiRequestAllItems.mockResolvedValue([]);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await EmailOperations.getEmails.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/emails',
				{},
				{}
			);
			expect(result).toEqual([]);
		});

		it('should handle API errors gracefully', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {},
				options: {},
			};

			const error = new Error('API Error');
			mockArivoApiRequestAllItems.mockRejectedValue(error);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			await expect(EmailOperations.getEmails.call(mockExecuteFunction, 0)).rejects.toThrow('API Error');
		});
	});

	describe('Parameter validation', () => {
		it('should handle missing contactId', async () => {
			const nodeParameters = {
				address: 'john.doe@example.com',
				email_type: 'work',
			};

			mockArivoApiRequest.mockResolvedValue(mockEmailData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			// Should get undefined for contactId
			await EmailOperations.createEmail.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'POST',
				'/contacts/undefined/emails',
				{
					address: 'john.doe@example.com',
					email_type: 'work',
				}
			);
		});

		it('should handle missing emailId for get operation', async () => {
			const nodeParameters = {
				contactId: '123',
			};

			mockArivoApiRequest.mockResolvedValue(mockEmailData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			await EmailOperations.getEmail.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/emails/undefined'
			);
		});
	});

	describe('Email address validation', () => {
		it('should handle valid email addresses', async () => {
			const testCases = [
				'user@example.com',
				'user.name@example.com',
				'user+tag@example.com',
				'user.name+tag@example.co.uk',
			];

			for (const emailAddress of testCases) {
				const nodeParameters = {
					contactId: '123',
					address: emailAddress,
					email_type: 'work',
				};

				mockArivoApiRequest.mockResolvedValue({
					...mockEmailData,
					address: emailAddress,
				});

				const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
				const result = await EmailOperations.createEmail.call(mockExecuteFunction, 0);

				expect(mockArivoApiRequest).toHaveBeenCalledWith(
					'POST',
					'/contacts/123/emails',
					{
						address: emailAddress,
						email_type: 'work',
					}
				);
				expect(result.address).toBe(emailAddress);
			}
		});

		it('should handle edge cases in email addresses', async () => {
			const nodeParameters = {
				contactId: '123',
				address: '',
				email_type: 'work',
			};

			mockArivoApiRequest.mockResolvedValue({
				...mockEmailData,
				address: '',
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			await EmailOperations.createEmail.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'POST',
				'/contacts/123/emails',
				{
					address: '',
					email_type: 'work',
				}
			);
		});
	});
});
