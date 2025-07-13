import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { personOperations, personFields } from './PersonDescription';
import { companyOperations, companyFields } from './CompanyDescription';
import { dealOperations, dealFields } from './DealDescription';
import { createPerson, getPerson, getPersons, updatePerson, deletePerson } from './PersonOperations';
import { createCompany, getCompany, getCompanies, updateCompany, deleteCompany } from './CompanyOperations';
import { createDeal, getDeal, getDeals, updateDeal, deleteDeal } from './DealOperations';
import { getPersonCustomFields, getCompanyCustomFields, getDealCustomFields } from './loadOptions';

export class Arivo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Arivo',
		name: 'arivo',
		icon: 'file:arivo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Create and edit data in Arivo CRM',
		defaults: {
			name: 'Arivo',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'arivoApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Person',
						value: 'person',
					},
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Deal',
						value: 'deal',
					},
				],
				default: 'person',
			},
			...personOperations,
			...personFields,
			...companyOperations,
			...companyFields,
			...dealOperations,
			...dealFields,
		],
	};

	methods = {
		loadOptions: {
			getPersonCustomFields,
			getCompanyCustomFields,
			getDealCustomFields,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'person') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createPerson.call(this, i);
					} else if (operation === 'delete') {
						response = await deletePerson.call(this, i);
					} else if (operation === 'get') {
						response = await getPerson.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getPersons.call(this, i);
						for (const person of responseArray) {
							returnData.push({ json: person, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updatePerson.call(this, i);
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				} else if (resource === 'company') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createCompany.call(this, i);
					} else if (operation === 'delete') {
						response = await deleteCompany.call(this, i);
					} else if (operation === 'get') {
						response = await getCompany.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getCompanies.call(this, i);
						for (const company of responseArray) {
							returnData.push({ json: company, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updateCompany.call(this, i);
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				} else if (resource === 'deal') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createDeal.call(this, i);
					} else if (operation === 'delete') {
						response = await deleteDeal.call(this, i);
					} else if (operation === 'get') {
						response = await getDeal.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getDeals.call(this, i);
						for (const deal of responseArray) {
							returnData.push({ json: deal, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updateDeal.call(this, i);
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
} 