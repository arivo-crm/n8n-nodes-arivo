import { getPersonCustomFields, getCompanyCustomFields, getDealCustomFields, getTaskTypes, getPipelines, getPipelineSteps, getDealPipelineSteps, getProductOptions, getProductCategories, getUserOptions, getTeamOptions } from '../loadOptions';
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

	describe('getTaskTypes', () => {
		it('should return task types', async () => {
			const taskTypesResponse = [
				{
					id: 7,
					label: 'Tarefa',
				},
				{
					id: 8,
					label: 'Visita',
				},
				{
					id: 9,
					label: 'Ligação',
				},
			];

			mockArivoApiRequest.mockResolvedValue(taskTypesResponse);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getTaskTypes.call(mockLoadOptionsFunction);

			expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/task_types');
			expect(result).toEqual([
				{
					name: 'Tarefa',
					value: 7,
				},
				{
					name: 'Visita',
					value: 8,
				},
				{
					name: 'Ligação',
					value: 9,
				},
			]);
		});

		it('should handle API errors gracefully', async () => {
			const error = new Error('API request failed');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getTaskTypes.call(mockLoadOptionsFunction)).rejects.toThrow(
				'API request failed',
			);
		});

		it('should handle empty response', async () => {
			mockArivoApiRequest.mockResolvedValue([]);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getTaskTypes.call(mockLoadOptionsFunction);

			expect(result).toEqual([]);
		});

		it('should handle null/undefined response', async () => {
			mockArivoApiRequest.mockResolvedValue(undefined);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getTaskTypes.call(mockLoadOptionsFunction)).rejects.toThrow(
				'No data got returned',
			);
		});
	});

	describe('getPipelines', () => {
		it('should return pipelines from API', async () => {
			const pipelinesResponse = [
				{
					id: '1',
					name: 'Sales Pipeline',
					pipeline_steps: []
				},
				{
					id: '2', 
					name: 'Marketing Pipeline',
					pipeline_steps: []
				}
			];

			mockArivoApiRequest.mockResolvedValue(pipelinesResponse);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getPipelines.call(mockLoadOptionsFunction);

			expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
			expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/pipelines');
			expect(result).toEqual([
				{
					name: 'Sales Pipeline',
					value: '1',
				},
				{
					name: 'Marketing Pipeline',
					value: '2',
				},
			]);
		});

		it('should handle API errors gracefully', async () => {
			const error = new Error('API request failed');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getPipelines.call(mockLoadOptionsFunction)).rejects.toThrow(
				'API request failed'
			);
		});

		it('should handle empty response', async () => {
			mockArivoApiRequest.mockResolvedValue([]);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getPipelines.call(mockLoadOptionsFunction);

			expect(result).toEqual([]);
		});

		it('should handle null/undefined response', async () => {
			mockArivoApiRequest.mockResolvedValue(undefined);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getPipelines.call(mockLoadOptionsFunction)).rejects.toThrow(
				'No data got returned'
			);
	});
});

describe('getPipelineSteps', () => {
		it('should return pipeline steps for selected pipeline', async () => {
			const pipelineResponse = {
				id: '1',
				name: 'Sales Pipeline',
				pipeline_steps: [
					{
						id: '1',
						name: 'Initial Contact',
					},
					{
						id: '2',
						name: 'Proposal Sent',
					},
				]
			};

			mockArivoApiRequest.mockResolvedValue(pipelineResponse);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			// Mock getCurrentNodeParameter to return pipeline ID from additionalFields
			mockLoadOptionsFunction.getCurrentNodeParameter = jest.fn()
				.mockImplementation((path: string) => {
					if (path === 'additionalFields.pipeline_id') return '1';
					throw new Error('Parameter not found');
				});

			const result = await getPipelineSteps.call(mockLoadOptionsFunction);

			expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/pipelines/1');
			expect(result).toEqual([
				{
					name: 'Initial Contact',
					value: '1',
				},
				{
					name: 'Proposal Sent',
					value: '2',
				},
			]);
		});

		it('should return empty array when no pipeline is selected', async () => {
			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			// Mock getCurrentNodeParameter to throw errors for all paths (no pipeline selected)
			mockLoadOptionsFunction.getCurrentNodeParameter = jest.fn()
				.mockImplementation(() => {
					throw new Error('Parameter not found');
				});

			const result = await getPipelineSteps.call(mockLoadOptionsFunction);

			expect(result).toEqual([]);
			expect(mockArivoApiRequest).not.toHaveBeenCalled();
		});

		it('should handle API errors gracefully', async () => {
			const error = new Error('Pipeline API request failed');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			mockLoadOptionsFunction.getCurrentNodeParameter = jest.fn()
				.mockImplementation((path: string) => {
					if (path === 'additionalFields.pipeline_id') return '1';
					throw new Error('Parameter not found');
				});

			await expect(getPipelineSteps.call(mockLoadOptionsFunction)).rejects.toThrow(
				'Pipeline API request failed'
			);
		});

		it('should handle pipeline without steps', async () => {
			const pipelineResponse = {
				id: '1',
				name: 'Empty Pipeline',
				pipeline_steps: null
			};

			mockArivoApiRequest.mockResolvedValue(pipelineResponse);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			mockLoadOptionsFunction.getCurrentNodeParameter = jest.fn()
				.mockImplementation((path: string) => {
					if (path === 'additionalFields.pipeline_id') return '1';
					throw new Error('Parameter not found');
				});

			await expect(getPipelineSteps.call(mockLoadOptionsFunction)).rejects.toThrow(
				'No pipeline steps found for the selected pipeline'
			);
		});

		it('should handle different parameter paths (updateFields)', async () => {
			const pipelineResponse = {
				id: '2',
				name: 'Update Pipeline',
				pipeline_steps: [
					{
						id: '3',
						name: 'Update Step',
					},
				]
			};

			mockArivoApiRequest.mockResolvedValue(pipelineResponse);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			// Mock getCurrentNodeParameter to return pipeline ID from updateFields
			mockLoadOptionsFunction.getCurrentNodeParameter = jest.fn()
				.mockImplementation((path: string) => {
					if (path === 'updateFields.pipeline_id') return '2';
					throw new Error('Parameter not found');
				});

			const result = await getPipelineSteps.call(mockLoadOptionsFunction);

			expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/pipelines/2');
			expect(result).toEqual([
				{
					name: 'Update Step',
					value: '3',
				},
			]);
		});

		it('should handle filters parameter path', async () => {
			const pipelineResponse = {
				id: '3',
				name: 'Filter Pipeline',
				pipeline_steps: [
					{
						id: '4',
						name: 'Filter Step',
					},
				]
			};

			mockArivoApiRequest.mockResolvedValue(pipelineResponse);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			// Mock getCurrentNodeParameter to return pipeline ID from filters
			mockLoadOptionsFunction.getCurrentNodeParameter = jest.fn()
				.mockImplementation((path: string) => {
					if (path === 'filters.pipeline_id') return '3';
					throw new Error('Parameter not found');
				});

			const result = await getPipelineSteps.call(mockLoadOptionsFunction);

			expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/pipelines/3');
			expect(result).toEqual([
				{
					name: 'Filter Step',
					value: '4',
				},
			]);
		});
	});

	describe('getDealPipelineSteps', () => {
		it('should return pipeline steps for a deal', async () => {
			const dealResponse = {
				id: '1',
				name: 'Test Deal',
				pipeline_id: '2',
				pipeline_step_id: '3',
			};

			const pipelineResponse = {
				id: '2',
				name: 'Sales Pipeline',
				pipeline_steps: [
					{
						id: '1',
						name: 'Initial Contact',
					},
					{
						id: '2',
						name: 'Proposal Sent',
					},
					{
						id: '3',
						name: 'Negotiation',
					},
				]
			};

			mockArivoApiRequest
				.mockResolvedValueOnce(dealResponse)
				.mockResolvedValueOnce(pipelineResponse);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			// Mock getCurrentNodeParameter to return deal ID
			mockLoadOptionsFunction.getCurrentNodeParameter = jest.fn()
				.mockImplementation((path: string) => {
					if (path === 'dealId') return '1';
					throw new Error('Parameter not found');
				});

			const result = await getDealPipelineSteps.call(mockLoadOptionsFunction);

			expect(mockArivoApiRequest).toHaveBeenCalledTimes(2);
			expect(mockArivoApiRequest).toHaveBeenNthCalledWith(1, 'GET', '/deals/1');
			expect(mockArivoApiRequest).toHaveBeenNthCalledWith(2, 'GET', '/pipelines/2');
			expect(result).toEqual([
				{
					name: 'Initial Contact',
					value: '1',
				},
				{
					name: 'Proposal Sent',
					value: '2',
				},
				{
					name: 'Negotiation',
					value: '3',
				},
			]);
		});

		it('should return empty array when no deal ID is provided', async () => {
			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			// Mock getCurrentNodeParameter to throw errors for all paths
			mockLoadOptionsFunction.getCurrentNodeParameter = jest.fn()
				.mockImplementation(() => {
					throw new Error('Parameter not found');
				});

			const result = await getDealPipelineSteps.call(mockLoadOptionsFunction);

			expect(result).toEqual([]);
			expect(mockArivoApiRequest).not.toHaveBeenCalled();
		});

		it('should handle API errors when fetching deal', async () => {
			const error = new Error('Deal not found');
			mockArivoApiRequest.mockRejectedValue(error);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			mockLoadOptionsFunction.getCurrentNodeParameter = jest.fn()
				.mockImplementation((path: string) => {
					if (path === 'dealId') return '1';
					throw new Error('Parameter not found');
				});

			await expect(getDealPipelineSteps.call(mockLoadOptionsFunction)).rejects.toThrow(
				'Deal not found'
			);
		});

		it('should handle deal without pipeline_id', async () => {
			const dealResponse = {
				id: '1',
				name: 'Test Deal',
				pipeline_id: null,
			};

			mockArivoApiRequest.mockResolvedValue(dealResponse);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			mockLoadOptionsFunction.getCurrentNodeParameter = jest.fn()
				.mockImplementation((path: string) => {
					if (path === 'dealId') return '1';
					throw new Error('Parameter not found');
				});

			await expect(getDealPipelineSteps.call(mockLoadOptionsFunction)).rejects.toThrow(
				'Could not determine pipeline for this deal'
			);
		});

		it('should handle pipeline without steps', async () => {
			const dealResponse = {
				id: '1',
				name: 'Test Deal',
				pipeline_id: '2',
			};

			const pipelineResponse = {
				id: '2',
				name: 'Empty Pipeline',
				pipeline_steps: null,
			};

			mockArivoApiRequest
				.mockResolvedValueOnce(dealResponse)
				.mockResolvedValueOnce(pipelineResponse);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			mockLoadOptionsFunction.getCurrentNodeParameter = jest.fn()
				.mockImplementation((path: string) => {
					if (path === 'dealId') return '1';
					throw new Error('Parameter not found');
				});

			await expect(getDealPipelineSteps.call(mockLoadOptionsFunction)).rejects.toThrow(
				'No pipeline steps found for the deal pipeline'
			);
		});
	});

	describe('getProductOptions', () => {
		it('should return products from API', async () => {
			const mockProducts = [
				{ id: '1', name: 'Laptop' },
				{ id: '2', name: 'Mouse' },
			];

			mockArivoApiRequest.mockResolvedValue(mockProducts);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getProductOptions.call(mockLoadOptionsFunction);

			expect(result).toEqual([
				{ name: 'Laptop', value: '1' },
				{ name: 'Mouse', value: '2' },
			]);
			expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/products');
		});

		it('should handle API errors gracefully', async () => {
			mockArivoApiRequest.mockRejectedValue(new Error('API Error'));

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getProductOptions.call(mockLoadOptionsFunction)).rejects.toThrow('API Error');
		});

		it('should handle empty response', async () => {
			mockArivoApiRequest.mockResolvedValue([]);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getProductOptions.call(mockLoadOptionsFunction);

			expect(result).toEqual([]);
		});

		it('should handle null/undefined response', async () => {
			mockArivoApiRequest.mockResolvedValue(null);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getProductOptions.call(mockLoadOptionsFunction)).rejects.toThrow('No data got returned');
		});
	});

	describe('getProductCategories', () => {
		it('should return product categories from API', async () => {
			const mockProductCategories = [
				{ id: '1', name: 'Electronics' },
				{ id: '2', name: 'Clothing' },
			];

			mockArivoApiRequest.mockResolvedValue(mockProductCategories);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getProductCategories.call(mockLoadOptionsFunction);

			expect(result).toEqual([
				{ name: 'Electronics', value: '1' },
				{ name: 'Clothing', value: '2' },
			]);
			expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/product_categories');
		});

		it('should handle API errors gracefully', async () => {
			mockArivoApiRequest.mockRejectedValue(new Error('API Error'));

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getProductCategories.call(mockLoadOptionsFunction)).rejects.toThrow('API Error');
		});

		it('should handle empty response', async () => {
			mockArivoApiRequest.mockResolvedValue([]);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getProductCategories.call(mockLoadOptionsFunction);

			expect(result).toEqual([]);
		});

		it('should handle null/undefined response', async () => {
			mockArivoApiRequest.mockResolvedValue(null);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getProductCategories.call(mockLoadOptionsFunction)).rejects.toThrow('No data got returned');
		});
	});

	describe('getUserOptions', () => {
		it('should return users from API', async () => {
			const mockUsers = [
				{ id: '1', name: 'Tony Stark', email: 'tstark@avengers.com' },
				{ id: '2', name: 'Steve Rogers', email: 'srogers@avengers.com' },
			];

			mockArivoApiRequest.mockResolvedValue(mockUsers);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getUserOptions.call(mockLoadOptionsFunction);

			expect(result).toEqual([
				{ name: 'Tony Stark', value: '1' },
				{ name: 'Steve Rogers', value: '2' },
			]);
			expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/users');
		});

		it('should handle API errors gracefully', async () => {
			mockArivoApiRequest.mockRejectedValue(new Error('API Error'));

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getUserOptions.call(mockLoadOptionsFunction)).rejects.toThrow('API Error');
		});

		it('should handle empty response', async () => {
			mockArivoApiRequest.mockResolvedValue([]);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getUserOptions.call(mockLoadOptionsFunction);

			expect(result).toEqual([]);
		});

		it('should handle null/undefined response', async () => {
			mockArivoApiRequest.mockResolvedValue(null);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getUserOptions.call(mockLoadOptionsFunction)).rejects.toThrow('No data got returned');
		});
	});

	describe('getTeamOptions', () => {
		it('should return teams from API', async () => {
			const mockTeams = [
				{ id: '1', name: 'Sua equipe' },
				{ id: '2', name: 'Irmandade de Mutantes' },
			];

			mockArivoApiRequest.mockResolvedValue(mockTeams);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getTeamOptions.call(mockLoadOptionsFunction);

			expect(result).toEqual([
				{ name: 'Sua equipe', value: '1' },
				{ name: 'Irmandade de Mutantes', value: '2' },
			]);
			expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/teams');
		});

		it('should handle API errors gracefully', async () => {
			mockArivoApiRequest.mockRejectedValue(new Error('API Error'));

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getTeamOptions.call(mockLoadOptionsFunction)).rejects.toThrow('API Error');
		});

		it('should handle empty response', async () => {
			mockArivoApiRequest.mockResolvedValue([]);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();
			const result = await getTeamOptions.call(mockLoadOptionsFunction);

			expect(result).toEqual([]);
		});

		it('should handle null/undefined response', async () => {
			mockArivoApiRequest.mockResolvedValue(null);

			const mockLoadOptionsFunction = createMockLoadOptionsFunctions();

			await expect(getTeamOptions.call(mockLoadOptionsFunction)).rejects.toThrow('No data got returned');
		});
	});
});