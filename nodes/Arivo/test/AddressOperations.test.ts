import { createMockExecuteFunction, mockAddressData, mockAddressesListResponse } from './helpers';
import * as AddressOperations from '../AddressOperations';

// Mock the GenericFunctions module
jest.mock('../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
	arivoApiRequestAllItems: jest.fn(),
}));

import { arivoApiRequest, arivoApiRequestAllItems } from '../GenericFunctions';

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;
const mockArivoApiRequestAllItems = arivoApiRequestAllItems as jest.MockedFunction<typeof arivoApiRequestAllItems>;

describe('Address Operations', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('createAddress', () => {
		it('should create an address successfully', async () => {
			const nodeParameters = {
				contactId: '123',
				addressFields: {
					street: '123 Main Street',
					number: '456',
					city: 'São Paulo',
					state: 'SP',
					country: 'Brazil',
				},
			};

			mockArivoApiRequest.mockResolvedValue(mockAddressData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.createAddress.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'POST',
				'/contacts/123/addresses',
				{
					street: '123 Main Street',
					number: '456',
					city: 'São Paulo',
					state: 'SP',
					country: 'Brazil',
				}
			);
			expect(result).toEqual(mockAddressData);
		});

		it('should handle minimal address fields', async () => {
			const nodeParameters = {
				contactId: '123',
				addressFields: {
					street: 'Main Street',
				},
			};

			mockArivoApiRequest.mockResolvedValue({
				...mockAddressData,
				street: 'Main Street',
				number: undefined,
				city: undefined,
				state: undefined,
				country: undefined,
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.createAddress.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'POST',
				'/contacts/123/addresses',
				{
					street: 'Main Street',
				}
			);
			expect(result.street).toBe('Main Street');
		});

		it('should handle complete address fields', async () => {
			const nodeParameters = {
				contactId: '123',
				addressFields: {
					street: '123 Main Street',
					number: '456',
					complement: 'Apt 101',
					zip_code: '01234-567',
					district: 'Centro',
					city: 'São Paulo',
					state: 'SP',
					country: 'Brazil',
				},
			};

			mockArivoApiRequest.mockResolvedValue(mockAddressData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.createAddress.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'POST',
				'/contacts/123/addresses',
				{
					street: '123 Main Street',
					number: '456',
					complement: 'Apt 101',
					zip_code: '01234-567',
					district: 'Centro',
					city: 'São Paulo',
					state: 'SP',
					country: 'Brazil',
				}
			);
			expect(result).toEqual(mockAddressData);
		});

		it('should handle empty address fields', async () => {
			const nodeParameters = {
				contactId: '123',
				addressFields: {},
			};

			mockArivoApiRequest.mockResolvedValue(mockAddressData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.createAddress.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'POST',
				'/contacts/123/addresses',
				{}
			);
			expect(result).toEqual(mockAddressData);
		});

		it('should handle API errors', async () => {
			const nodeParameters = {
				contactId: '123',
				addressFields: {
					street: '123 Main Street',
				},
			};

			const error = new Error('API Error');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			await expect(AddressOperations.createAddress.call(mockExecuteFunction, 0)).rejects.toThrow('API Error');
		});
	});

	describe('getAddress', () => {
		it('should retrieve an address successfully', async () => {
			const nodeParameters = {
				contactId: '123',
				addressId: '1',
			};

			mockArivoApiRequest.mockResolvedValue(mockAddressData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.getAddress.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/addresses/1'
			);
			expect(result).toEqual(mockAddressData);
		});

		it('should handle address not found', async () => {
			const nodeParameters = {
				contactId: '123',
				addressId: '999',
			};

			const error = new Error('Address not found');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			await expect(AddressOperations.getAddress.call(mockExecuteFunction, 0)).rejects.toThrow('Address not found');
		});
	});

	describe('updateAddress', () => {
		it('should update an address successfully', async () => {
			const nodeParameters = {
				contactId: '123',
				addressId: '1',
				updateFields: {
					street: '456 New Street',
					city: 'Rio de Janeiro',
					state: 'RJ',
				},
			};

			const updatedAddressData = {
				...mockAddressData,
				street: '456 New Street',
				city: 'Rio de Janeiro',
				state: 'RJ',
			};

			mockArivoApiRequest.mockResolvedValue(updatedAddressData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.updateAddress.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'PUT',
				'/contacts/123/addresses/1',
				{
					street: '456 New Street',
					city: 'Rio de Janeiro',
					state: 'RJ',
				}
			);
			expect(result).toEqual(updatedAddressData);
		});

		it('should handle partial updates', async () => {
			const nodeParameters = {
				contactId: '123',
				addressId: '1',
				updateFields: {
					zip_code: '54321-098',
				},
			};

			const updatedAddressData = {
				...mockAddressData,
				zip_code: '54321-098',
			};

			mockArivoApiRequest.mockResolvedValue(updatedAddressData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.updateAddress.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'PUT',
				'/contacts/123/addresses/1',
				{
					zip_code: '54321-098',
				}
			);
			expect(result.zip_code).toBe('54321-098');
		});

		it('should handle complete address updates', async () => {
			const nodeParameters = {
				contactId: '123',
				addressId: '1',
				updateFields: {
					street: '789 Updated Street',
					number: '101',
					complement: 'Suite 200',
					zip_code: '98765-432',
					district: 'Copacabana',
					city: 'Rio de Janeiro',
					state: 'RJ',
					country: 'Brazil',
				},
			};

			const updatedAddressData = {
				...mockAddressData,
				street: '789 Updated Street',
				number: '101',
				complement: 'Suite 200',
				zip_code: '98765-432',
				district: 'Copacabana',
				city: 'Rio de Janeiro',
				state: 'RJ',
				country: 'Brazil',
			};

			mockArivoApiRequest.mockResolvedValue(updatedAddressData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.updateAddress.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'PUT',
				'/contacts/123/addresses/1',
				{
					street: '789 Updated Street',
					number: '101',
					complement: 'Suite 200',
					zip_code: '98765-432',
					district: 'Copacabana',
					city: 'Rio de Janeiro',
					state: 'RJ',
					country: 'Brazil',
				}
			);
			expect(result).toEqual(updatedAddressData);
		});

		it('should handle empty update fields', async () => {
			const nodeParameters = {
				contactId: '123',
				addressId: '1',
				updateFields: {},
			};

			mockArivoApiRequest.mockResolvedValue(mockAddressData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.updateAddress.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'PUT',
				'/contacts/123/addresses/1',
				{}
			);
			expect(result).toEqual(mockAddressData);
		});
	});

	describe('deleteAddress', () => {
		it('should delete an address successfully', async () => {
			const nodeParameters = {
				contactId: '123',
				addressId: '1',
			};

			const deleteResponse = { success: true, message: 'Address deleted successfully' };
			mockArivoApiRequest.mockResolvedValue(deleteResponse);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.deleteAddress.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'DELETE',
				'/contacts/123/addresses/1'
			);
			expect(result).toEqual(deleteResponse);
		});

		it('should handle delete errors', async () => {
			const nodeParameters = {
				contactId: '123',
				addressId: '1',
			};

			const error = new Error('Failed to delete address');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			await expect(AddressOperations.deleteAddress.call(mockExecuteFunction, 0)).rejects.toThrow('Failed to delete address');
		});
	});

	describe('getAddresses', () => {
		it('should retrieve addresses successfully', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {},
				options: {},
			};

			mockArivoApiRequestAllItems.mockResolvedValue(mockAddressesListResponse);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.getAddresses.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/addresses',
				{},
				{}
			);
			expect(result).toEqual(mockAddressesListResponse);
		});

		it('should filter addresses by city', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {
					city: 'São Paulo',
				},
				options: {},
			};

			mockArivoApiRequestAllItems.mockResolvedValue(mockAddressesListResponse);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.getAddresses.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/addresses',
				{},
				{
					city: 'São Paulo',
				}
			);
			expect(result).toEqual(mockAddressesListResponse);
		});

		it('should filter addresses by state and country', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {
					state: 'SP',
					country: 'Brazil',
				},
				options: {},
			};

			mockArivoApiRequestAllItems.mockResolvedValue(mockAddressesListResponse);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.getAddresses.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/addresses',
				{},
				{
					state: 'SP',
					country: 'Brazil',
				}
			);
			expect(result).toEqual(mockAddressesListResponse);
		});

		it('should sort addresses by city ascending', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {},
				options: {
					sort_field: 'city',
					sort_order: 'asc',
				},
			};

			mockArivoApiRequestAllItems.mockResolvedValue(mockAddressesListResponse);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.getAddresses.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/addresses',
				{},
				{
					sort_field: 'city',
					sort_order: 'asc',
				}
			);
			expect(result).toEqual(mockAddressesListResponse);
		});

		it('should handle multiple filters and options', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {
					city: 'São Paulo',
					state: 'SP',
				},
				options: {
					sort_field: 'created_at',
					sort_order: 'desc',
				},
			};

			mockArivoApiRequestAllItems.mockResolvedValue(mockAddressesListResponse);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.getAddresses.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/addresses',
				{},
				{
					city: 'São Paulo',
					state: 'SP',
					sort_field: 'created_at',
					sort_order: 'desc',
				}
			);
			expect(result).toEqual(mockAddressesListResponse);
		});

		it('should return empty array for no results', async () => {
			const nodeParameters = {
				contactId: '123',
				filters: {},
				options: {},
			};

			mockArivoApiRequestAllItems.mockResolvedValue([]);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await AddressOperations.getAddresses.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequestAllItems).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/addresses',
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

			await expect(AddressOperations.getAddresses.call(mockExecuteFunction, 0)).rejects.toThrow('API Error');
		});
	});

	describe('Parameter validation', () => {
		it('should handle missing contactId', async () => {
			const nodeParameters = {
				addressFields: {
					street: '123 Main Street',
				},
			};

			mockArivoApiRequest.mockResolvedValue(mockAddressData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			// Should get undefined for contactId
			await AddressOperations.createAddress.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'POST',
				'/contacts/undefined/addresses',
				{
					street: '123 Main Street',
				}
			);
		});

		it('should handle missing addressId for get operation', async () => {
			const nodeParameters = {
				contactId: '123',
			};

			mockArivoApiRequest.mockResolvedValue(mockAddressData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			await AddressOperations.getAddress.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'GET',
				'/contacts/123/addresses/undefined'
			);
		});

		it('should handle missing addressFields parameter', async () => {
			const nodeParameters = {
				contactId: '123',
			};

			mockArivoApiRequest.mockResolvedValue(mockAddressData);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);

			await AddressOperations.createAddress.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'POST',
				'/contacts/123/addresses',
				{}
			);
		});
	});

	describe('Address field validation', () => {
		it('should handle Brazilian postal code formats', async () => {
			const testCases = [
				'12345-678',
				'01234-567',
				'98765-432',
				'11111-111',
			];

			for (const zipCode of testCases) {
				const nodeParameters = {
					contactId: '123',
					addressFields: {
						zip_code: zipCode,
					},
				};

				mockArivoApiRequest.mockResolvedValue({
					...mockAddressData,
					zip_code: zipCode,
				});

				const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
				const result = await AddressOperations.createAddress.call(mockExecuteFunction, 0);

				expect(mockArivoApiRequest).toHaveBeenCalledWith(
					'POST',
					'/contacts/123/addresses',
					{
						zip_code: zipCode,
					}
				);
				expect(result.zip_code).toBe(zipCode);
			}
		});

		it('should handle edge cases in address fields', async () => {
			const nodeParameters = {
				contactId: '123',
				addressFields: {
					street: '',
					number: '0',
					complement: '',
					zip_code: '',
					district: '',
					city: '',
					state: '',
					country: '',
				},
			};

			mockArivoApiRequest.mockResolvedValue({
				...mockAddressData,
				street: '',
				number: '0',
				complement: '',
				zip_code: '',
				district: '',
				city: '',
				state: '',
				country: '',
			});

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			await AddressOperations.createAddress.call(mockExecuteFunction, 0);

			expect(mockArivoApiRequest).toHaveBeenCalledWith(
				'POST',
				'/contacts/123/addresses',
				{
					street: '',
					number: '0',
					complement: '',
					zip_code: '',
					district: '',
					city: '',
					state: '',
					country: '',
				}
			);
		});
	});
});
