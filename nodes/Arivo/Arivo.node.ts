import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { personOperations, personFields } from './PersonDescription';
import { createPerson, getPerson, getPersons, updatePerson, deletePerson } from './PersonOperations';
import { getPersonCustomFields } from './loadOptions';

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
						name: 'Deal',
						value: 'deal',
					},
				],
				default: 'person',
			},
			...personOperations,
			...personFields,
			// TODO: Add deal operations and fields
		],
	};

	methods = {
		loadOptions: {
			getPersonCustomFields
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
				}
				// TODO: Add handlers for 'deal' resource
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