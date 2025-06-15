import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { contactOperations, contactFields } from './ContactDescription';
import { createContact, getContact, getContacts, updateContact, deleteContact } from './ContactOperations';
import { getContactCustomFields } from './loadOptions';

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
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Deal',
						value: 'deal',
					},
				],
				default: 'contact',
			},
			...contactOperations,
			...contactFields,
			// TODO: Add deal operations and fields
		],
	};

	methods = {
		loadOptions: {
			getContactCustomFields
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'contact') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createContact.call(this, i);
					} else if (operation === 'delete') {
						response = await deleteContact.call(this, i);
					} else if (operation === 'get') {
						response = await getContact.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getContacts.call(this, i);
						for (const contact of responseArray) {
							returnData.push({ json: contact, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updateContact.call(this, i);
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