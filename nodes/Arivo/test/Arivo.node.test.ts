import { Arivo } from '../Arivo.node';
import { createMockExecuteFunction, mockPersonData, mockPersonsListResponse } from './helpers';
import * as PersonOperations from '../PersonOperations';

// Mock the PersonOperations module
jest.mock('../PersonOperations', () => ({
	createPerson: jest.fn(),
	getPerson: jest.fn(),
	getPersons: jest.fn(),
	updatePerson: jest.fn(),
	deletePerson: jest.fn(),
}));

// Mock the loadOptions module
jest.mock('../loadOptions', () => ({
	getPersonCustomFields: jest.fn(),
}));

const mockCreatePerson = PersonOperations.createPerson as jest.MockedFunction<typeof PersonOperations.createPerson>;
const mockGetPerson = PersonOperations.getPerson as jest.MockedFunction<typeof PersonOperations.getPerson>;
const mockGetPersons = PersonOperations.getPersons as jest.MockedFunction<typeof PersonOperations.getPersons>;
const mockUpdatePerson = PersonOperations.updatePerson as jest.MockedFunction<typeof PersonOperations.updatePerson>;
const mockDeletePerson = PersonOperations.deletePerson as jest.MockedFunction<typeof PersonOperations.deletePerson>;

describe('Arivo Node', () => {
	let arivoNode: Arivo;

	beforeEach(() => {
		arivoNode = new Arivo();
		jest.clearAllMocks();
	});

	describe('Node Properties', () => {
		it('should have correct node properties', () => {
			expect(arivoNode.description.displayName).toBe('Arivo');
			expect(arivoNode.description.name).toBe('arivo');
			expect(arivoNode.description.group).toEqual(['transform']);
			expect(arivoNode.description.version).toBe(1);
			expect(arivoNode.description.description).toBe('Create and edit data in Arivo CRM');
		});

		it('should have correct credentials configuration', () => {
			expect(arivoNode.description.credentials).toEqual([
				{
					name: 'arivoApi',
					required: true,
				},
			]);
		});

		it('should have person resource configured', () => {
			const resourceProperty = arivoNode.description.properties.find(
				(prop) => prop.name === 'resource',
			);
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty?.options).toEqual([
				{
					name: 'Address',
					value: 'address',
				},
				{
					name: 'Company',
					value: 'company',
				},
				{
					name: 'Custom Record',
					value: 'customRecord',
				},
				{
					name: 'Deal',
					value: 'deal',
				},
				{
					name: 'Deal Item',
					value: 'dealItem',
				},
				{
					name: 'Email',
					value: 'email',
				},
				{
					name: 'File',
					value: 'file',
				},
				{
					name: 'Note',
					value: 'note',
				},
				{
					name: 'Person',
					value: 'person',
				},
				{
					name: 'Phone',
					value: 'phone',
				},
				{
					name: 'Product',
					value: 'product',
				},
				{
					name: 'Product Category',
					value: 'productCategory',
				},
				{
					name: 'Task',
					value: 'task',
				},
			]);
			expect(resourceProperty?.default).toBe('person');
		});

		it('should have load options methods configured', () => {
			expect(arivoNode.methods?.loadOptions?.getPersonCustomFields).toBeDefined();
			// Check if new methods exist in the keys array (they're there but undefined when accessed directly)
			const loadOptionsMethods = Object.keys(arivoNode.methods?.loadOptions || {});
			expect(loadOptionsMethods).toContain('getTaskTypes');
			expect(loadOptionsMethods).toContain('getCompanyCustomFields');
			expect(loadOptionsMethods).toContain('getDealCustomFields');
			expect(loadOptionsMethods).toContain('getCustomRecordDefinitions');
			expect(loadOptionsMethods).toContain('getCustomRecordCustomFields');
			expect(loadOptionsMethods).toContain('getPipelines');
			expect(loadOptionsMethods).toContain('getPipelineSteps');
			expect(loadOptionsMethods).toContain('getDealPipelineSteps');
			expect(loadOptionsMethods).toContain('getProductCategories');
		});
	});

	describe('Person Operations', () => {
		describe('Create Person', () => {
			it('should execute create person operation', async () => {
				const nodeParameters = {
					resource: 'person',
					operation: 'create',
					personName: 'John Doe',
				};

				mockCreatePerson.mockResolvedValue(mockPersonData);

				const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
				const result = await arivoNode.execute.call(mockExecuteFunction);

				expect(mockCreatePerson).toHaveBeenCalledTimes(1);
				expect(mockCreatePerson).toHaveBeenCalledWith(0);
				expect(result).toEqual([
					[
						{
							json: mockPersonData,
							pairedItem: { item: 0 },
						},
					],
				]);
			});
		});

		describe('Get Person', () => {
			it('should execute get person operation', async () => {
				const nodeParameters = {
					resource: 'person',
					operation: 'get',
					personId: '123',
				};

				mockGetPerson.mockResolvedValue(mockPersonData);

				const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
				const result = await arivoNode.execute.call(mockExecuteFunction);

				expect(mockGetPerson).toHaveBeenCalledTimes(1);
				expect(mockGetPerson).toHaveBeenCalledWith(0);
				expect(result).toEqual([
					[
						{
							json: mockPersonData,
							pairedItem: { item: 0 },
						},
					],
				]);
			});
		});

		describe('Get Many Persons', () => {
			it('should execute getMany persons operation', async () => {
				const nodeParameters = {
					resource: 'person',
					operation: 'getMany',
					returnAll: false,
					limit: 50,
				};

				mockGetPersons.mockResolvedValue(mockPersonsListResponse.data);

				const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
				const result = await arivoNode.execute.call(mockExecuteFunction);

				expect(mockGetPersons).toHaveBeenCalledTimes(1);
				expect(mockGetPersons).toHaveBeenCalledWith(0);
				expect(result).toEqual([
					[
						{
							json: mockPersonsListResponse.data[0],
							pairedItem: { item: 0 },
						},
						{
							json: mockPersonsListResponse.data[1],
							pairedItem: { item: 0 },
						},
					],
				]);
			});

			it('should handle empty results for getMany operation', async () => {
				const nodeParameters = {
					resource: 'person',
					operation: 'getMany',
					returnAll: false,
					limit: 50,
				};

				mockGetPersons.mockResolvedValue([]);

				const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
				const result = await arivoNode.execute.call(mockExecuteFunction);

				expect(mockGetPersons).toHaveBeenCalledTimes(1);
				expect(result).toEqual([[]]);
			});
		});

		describe('Update Person', () => {
			it('should execute update person operation', async () => {
				const nodeParameters = {
					resource: 'person',
					operation: 'update',
					personId: '123',
					updateFields: {
						updatePersonName: 'John Updated',
					},
				};

				const updatedPersonData = { ...mockPersonData, name: 'John Updated' };
				mockUpdatePerson.mockResolvedValue(updatedPersonData);

				const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
				const result = await arivoNode.execute.call(mockExecuteFunction);

				expect(mockUpdatePerson).toHaveBeenCalledTimes(1);
				expect(mockUpdatePerson).toHaveBeenCalledWith(0);
				expect(result).toEqual([
					[
						{
							json: updatedPersonData,
							pairedItem: { item: 0 },
						},
					],
				]);
			});
		});

		describe('Delete Person', () => {
			it('should execute delete person operation', async () => {
				const nodeParameters = {
					resource: 'person',
					operation: 'delete',
					personId: '123',
				};

				const deleteResponse = { success: true, message: 'Person deleted successfully' };
				mockDeletePerson.mockResolvedValue(deleteResponse);

				const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
				const result = await arivoNode.execute.call(mockExecuteFunction);

				expect(mockDeletePerson).toHaveBeenCalledTimes(1);
				expect(mockDeletePerson).toHaveBeenCalledWith(0);
				expect(result).toEqual([
					[
						{
							json: deleteResponse,
							pairedItem: { item: 0 },
						},
					],
				]);
			});
		});
	});

	describe('Multiple Items Processing', () => {
		it('should process multiple input items', async () => {
			const nodeParameters = {
				resource: 'person',
				operation: 'create',
				personName: 'John Doe',
			};

			const items = [{ json: { input: 'item1' } }, { json: { input: 'item2' } }];

			mockCreatePerson
				.mockResolvedValueOnce(mockPersonData)
				.mockResolvedValueOnce({ ...mockPersonData, id: 124 });

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters, items);
			const result = await arivoNode.execute.call(mockExecuteFunction);

			expect(mockCreatePerson).toHaveBeenCalledTimes(2);
			expect(mockCreatePerson).toHaveBeenNthCalledWith(1, 0);
			expect(mockCreatePerson).toHaveBeenNthCalledWith(2, 1);
			expect(result).toEqual([
				[
					{
						json: mockPersonData,
						pairedItem: { item: 0 },
					},
					{
						json: { ...mockPersonData, id: 124 },
						pairedItem: { item: 1 },
					},
				],
			]);
		});
	});

	describe('Error Handling', () => {
		it('should handle operation errors and continue on fail', async () => {
			const nodeParameters = {
				resource: 'person',
				operation: 'create',
				personName: 'John Doe',
			};

			const error = new Error('API Error');
			mockCreatePerson.mockRejectedValue(error);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			// Mock continueOnFail to return true
			mockExecuteFunction.continueOnFail = jest.fn().mockReturnValue(true);

			const result = await arivoNode.execute.call(mockExecuteFunction);

			expect(mockCreatePerson).toHaveBeenCalledTimes(1);
			expect(result).toEqual([
				[
					{
						json: {
							error: 'API Error',
						},
						pairedItem: { item: 0 },
					},
				],
			]);
		});

		it('should throw error when continueOnFail is false', async () => {
			const nodeParameters = {
				resource: 'person',
				operation: 'create',
				personName: 'John Doe',
			};

			const error = new Error('API Error');
			mockCreatePerson.mockRejectedValue(error);

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			// Mock continueOnFail to return false (default)
			mockExecuteFunction.continueOnFail = jest.fn().mockReturnValue(false);

			await expect(arivoNode.execute.call(mockExecuteFunction)).rejects.toThrow('API Error');
		});
	});

	describe('Unknown Operations', () => {
		it('should handle unknown resource gracefully', async () => {
			const nodeParameters = {
				resource: 'unknown',
				operation: 'create',
			};

			const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
			const result = await arivoNode.execute.call(mockExecuteFunction);

			// Should return empty result for unknown resource
			expect(result).toEqual([[]]);
		});
	});
});