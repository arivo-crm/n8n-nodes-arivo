import { getPersonCustomFields, getCompanyCustomFields, getDealCustomFields } from '../loadOptions';
import { createMockLoadOptionsFunctions } from './helpers';
import { arivoApiRequest } from '../GenericFunctions';
import customFieldsResponse from './fixtures/custom-fields-response.json';

// Mock the GenericFunctions module
jest.mock('../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Load Options', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getPersonCustomFields', () => {
		it('should return custom fields for person contacts', async () => {
			mockArivoApiRequest.mockResolvedValue(customFieldsResponse);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getPersonCustomFields.call(mockLoadOptionsFunction);

			expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
			expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/custom_fields/person');

			expect(result).toEqual([
				{
					name: 'Department',
					value: 'custom_field_1',
				},
				{
					name: 'Salary Range',
					value: 'custom_field_2',
				},
				{
					name: 'Start Date',
					value: 'custom_field_3',
				},
			]);
		});

		it('should handle custom fields without labels', async () => {
			const customFieldsWithoutLabels = {
				custom_field_1: {
					field_type: 'text',
					required: false,
				},
				custom_field_2: {
					label: 'Has Label',
					field_type: 'select',
					required: true,
				},
			};

			mockArivoApiRequest.mockResolvedValue(customFieldsWithoutLabels);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getPersonCustomFields.call(mockLoadOptionsFunction);

			expect(result).toEqual([
				{
					name: 'custom_field_1', // Falls back to field key when no label
					value: 'custom_field_1',
				},
				{
					name: 'Has Label',
					value: 'custom_field_2',
				},
			]);
		});

		it('should handle empty custom fields response', async () => {
			mockArivoApiRequest.mockResolvedValue({});

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getPersonCustomFields.call(mockLoadOptionsFunction);

			expect(result).toEqual([]);
		});

		it('should handle API errors gracefully', async () => {
			const error = new Error('API request failed');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getPersonCustomFields.call(mockLoadOptionsFunction)).rejects.toThrow(
				'API request failed',
			);
		});

		it('should handle null/undefined response', async () => {
			mockArivoApiRequest.mockResolvedValue(undefined);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getPersonCustomFields.call(mockLoadOptionsFunction)).rejects.toThrow(
				'No data got returned',
			);
		});

		it('should handle complex custom field structures', async () => {
			const complexCustomFields = {
				contact_department: {
					label: 'Department',
					field_type: 'select',
					required: true,
					options: ['Engineering', 'Marketing', 'Sales'],
				},
				contact_salary: {
					label: 'Annual Salary',
					field_type: 'number',
					required: false,
					min_value: 0,
					max_value: 1000000,
				},
				contact_notes: {
					label: 'Internal Notes',
					field_type: 'textarea',
					required: false,
					max_length: 2000,
				},
			};

			mockArivoApiRequest.mockResolvedValue(complexCustomFields);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getPersonCustomFields.call(mockLoadOptionsFunction);

			expect(result).toEqual([
				{
					name: 'Department',
					value: 'contact_department',
				},
				{
					name: 'Annual Salary',
					value: 'contact_salary',
				},
				{
					name: 'Internal Notes',
					value: 'contact_notes',
				},
			]);
		});
	});

	describe('getCompanyCustomFields', () => {
		it('should return custom fields for company contacts', async () => {
			mockArivoApiRequest.mockResolvedValue(customFieldsResponse);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getCompanyCustomFields.call(mockLoadOptionsFunction);

			expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/custom_fields/company');
			expect(result).toEqual([
				{
					name: 'Department',
					value: 'custom_field_1',
				},
				{
					name: 'Salary Range',
					value: 'custom_field_2',
				},
				{
					name: 'Start Date',
					value: 'custom_field_3',
				},
			]);
		});

		it('should handle API errors gracefully', async () => {
			const error = new Error('API request failed');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getCompanyCustomFields.call(mockLoadOptionsFunction)).rejects.toThrow(
				'API request failed',
			);
		});
	});

	describe('getDealCustomFields', () => {
		it('should return custom fields for deals', async () => {
			mockArivoApiRequest.mockResolvedValue(customFieldsResponse);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getDealCustomFields.call(mockLoadOptionsFunction);

			expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/custom_fields/deal');
			expect(result).toEqual([
				{
					name: 'Department',
					value: 'custom_field_1',
				},
				{
					name: 'Salary Range',
					value: 'custom_field_2',
				},
				{
					name: 'Start Date',
					value: 'custom_field_3',
				},
			]);
		});

		it('should handle API errors gracefully', async () => {
			const error = new Error('API request failed');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getDealCustomFields.call(mockLoadOptionsFunction)).rejects.toThrow(
				'API request failed',
			);
		});
	});
});