import { createMockExecuteFunction, mockPhoneData, mockPhonesListResponse } from './helpers';
import * as PhoneOperations from '../PhoneOperations';

// Mock the GenericFunctions module
jest.mock('../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
	arivoApiRequestAllItems: jest.fn(),
}));

import { arivoApiRequest, arivoApiRequestAllItems } from '../GenericFunctions';

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;
const mockArivoApiRequestAllItems = arivoApiRequestAllItems as jest.MockedFunction<typeof arivoApiRequestAllItems>;

describe('Phone Operations', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('createPhone', () => {
		it('should create a phone successfully', async () => {
			const nodeParameters = {
				contactId: '123',
				number: '(11) 99999-9999',
				phone_type: 'cell',
			};

			mockArivoApiRequest.mockResolvedValue(mockPhoneData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await PhoneOperations.createPhone.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'POST',
				'/contacts/123/phones',
				{
					number: '(11) 99999-9999',
					phone_type: 'cell',
				}
			);
			expect(result).toEqual(mockPhoneData);
		});

		it('should handle different phone types', async () => {
			const nodeParameters = {
				contactId: '123',
				number: '(11) 1234-5678',
				phone_type: 'work',
			};

			mockArivoApiRequest.mockResolvedValue({
				...mockPhoneData,
				number: '(11) 1234-5678',
				phone_type: 'work',
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await PhoneOperations.createPhone.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'POST',
				'/contacts/123/phones',
				{
					number: '(11) 1234-5678',
					phone_type: 'work',
				}
			);
			expect(result.phone_type).toBe('work');
		});

		it('should handle API errors', async () => {
			const nodeParameters = {
				contactId: '123',
				number: '(11) 99999-9999',
				phone_type: 'cell',
			};

			const error = new Error('API Error');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			await expect(PhoneOperations.createPhone.call(mockExecuteFunction, 0)).rejects.toThrow('API Error');
		});
	});

	describe('getPhone', () => {
		it('should retrieve a phone successfully', async () => {
			const nodeParameters = {
				contactId: '123',
				phoneId: '1',
			};

			mockArivoApiRequest.mockResolvedValue(mockPhoneData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await PhoneOperations.getPhone.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/phones/1'
			);
			expect(result).toEqual(mockPhoneData);
		});

		it('should handle phone not found', async () => {
			const nodeParameters = {
				contactId: '123',
				phoneId: '999',
			};

			const error = new Error('Phone not found');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			await expect(PhoneOperations.getPhone.call(mockExecuteFunction, 0)).rejects.toThrow('Phone not found');
		});
	});

	describe('updatePhone', () => {
		it('should update a phone successfully', async () => {
			const nodeParameters = {
				contactId: '123',
				phoneId: '1',
				updateFields: {
					number: '(11) 88888-8888',
					phone_type: 'home',
				},
			};

			const updatedPhoneData = {
				...mockPhoneData,
				number: '(11) 88888-8888',
				phone_type: 'home',
			};

			mockArivoApiRequest.mockResolvedValue(updatedPhoneData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await PhoneOperations.updatePhone.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'PUT',
				'/contacts/123/phones/1',
				{
					number: '(11) 88888-8888',
					phone_type: 'home',
				}
			);
			expect(result).toEqual(updatedPhoneData);
		});

		it('should handle partial updates', async () => {
			const nodeParameters = {
				contactId: '123',
				phoneId: '1',
				updateFields: {
					number: '(11) 77777-7777',
				},
			};

			const updatedPhoneData = {
				...mockPhoneData,
				number: '(11) 77777-7777',
			};

			mockArivoApiRequest.mockResolvedValue(updatedPhoneData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await PhoneOperations.updatePhone.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'PUT',
				'/contacts/123/phones/1',
				{
					number: '(11) 77777-7777',
				}
			);
			expect(result.number).toBe('(11) 77777-7777');
		});

		it('should handle empty update fields', async () => {
			const nodeParameters = {
				contactId: '123',
				phoneId: '1',
				updateFields: {},
			};

			mockArivoApiRequest.mockResolvedValue(mockPhoneData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await PhoneOperations.updatePhone.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'PUT',
				'/contacts/123/phones/1',
				{}
			);
			expect(result).toEqual(mockPhoneData);
		});
	});

	describe('deletePhone', () => {
		it('should delete a phone successfully', async () => {
			const nodeParameters = {
				contactId: '123',
				phoneId: '1',
			};

			const deleteResponse = { success: true, message: 'Phone deleted successfully' };
			mockArivoApiRequest.mockResolvedValue(deleteResponse);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await PhoneOperations.deletePhone.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'DELETE',
				'/contacts/123/phones/1'
			);
			expect(result).toEqual(deleteResponse);
		});

		it('should handle delete errors', async () => {
			const nodeParameters = {
				contactId: '123',
				phoneId: '1',
			};

			const error = new Error('Failed to delete phone');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			await expect(PhoneOperations.deletePhone.call(mockExecuteFunction, 0)).rejects.toThrow('Failed to delete phone');
		});
	});

	describe('getPhones', () => {
		it('should retrieve phones successfully', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {},
				options: {},
			};

			mockArivoApiRequestAllItems.mockResolvedValue(mockPhonesListResponse);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await PhoneOperations.getPhones.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/phones',
				{},
				{}
			);
			expect(result).toEqual(mockPhonesListResponse);
		});

		it('should filter phones by phone type', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {
					phone_type: 'work',
				},
				options: {},
			};

			mockArivoApiRequestAllItems.mockResolvedValue(mockPhonesListResponse);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await PhoneOperations.getPhones.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/phones',
				{},
				{
					phone_type: 'work',
				}
			);
			expect(result).toEqual(mockPhonesListResponse);
		});

		it('should sort phones by number ascending', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {},
				options: {
					sort_field: 'number',
					sort_order: 'asc',
				},
			};

			mockArivoApiRequestAllItems.mockResolvedValue(mockPhonesListResponse);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await PhoneOperations.getPhones.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/phones',
				{},
				{
					sort_field: 'number',
					sort_order: 'asc',
				}
			);
			expect(result).toEqual(mockPhonesListResponse);
		});

		it('should handle multiple filters and options', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {
					phone_type: 'cell',
				},
				options: {
					sort_field: 'created_at',
					sort_order: 'desc',
				},
			};

			mockArivoApiRequestAllItems.mockResolvedValue(mockPhonesListResponse);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await PhoneOperations.getPhones.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/phones',
				{},
				{
					phone_type: 'cell',
					sort_field: 'created_at',
					sort_order: 'desc',
				}
			);
			expect(result).toEqual(mockPhonesListResponse);
		});

		it('should return empty array for no results', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {},
				options: {},
			};

			mockArivoApiRequestAllItems.mockResolvedValue([]);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await PhoneOperations.getPhones.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/phones',
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

			await expect(PhoneOperations.getPhones.call(mockExecuteFunction, 0)).rejects.toThrow('API Error');
		});
	});

	describe('Parameter validation', () => {
		it('should handle missing contactId', async () => {
			const nodeParameters = {
				number: '(11) 99999-9999',
				phone_type: 'cell',
			};

			mockArivoApiRequest.mockResolvedValue(mockPhoneData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			// Should get undefined for contactId
			await PhoneOperations.createPhone.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'POST',
				'/contacts/undefined/phones',
				{
					number: '(11) 99999-9999',
					phone_type: 'cell',
				}
			);
		});

		it('should handle missing phoneId for get operation', async () => {
			const nodeParameters = {
				contactId: '123',
			};

			mockArivoApiRequest.mockResolvedValue(mockPhoneData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			await PhoneOperations.getPhone.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/phones/undefined'
			);
		});
	});
});
