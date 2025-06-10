import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { arivoApiRequest, arivoApiRequestAllItems } from './GenericFunctions';

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
			// Operations for Contact
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contact'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a contact',
						action: 'Create a contact',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a contact',
						action: 'Get a contact',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many contacts',
						action: 'Get many contacts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a contact',
						action: 'Update a contact',
					},
				],
				default: 'create',
			},
			// Fields for Contact
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['get', 'update'],
						resource: ['contact'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the contact',
			},
			{
				displayName: 'Contact Fields',
				name: 'contactFields',
				type: 'collection',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['contact'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The name of the contact',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						description: 'The email address of the contact',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
						description: 'The phone number of the contact',
					},
					{
						displayName: 'Company',
						name: 'company',
						type: 'string',
						default: '',
						description: 'The company name of the contact',
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'The job title of the contact',
					},
					{
						displayName: 'Address',
						name: 'address',
						type: 'string',
						default: '',
						description: 'The address of the contact',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						description: 'The city of the contact',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'string',
						default: '',
						description: 'The state/province of the contact',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'The country of the contact',
					},
					{
						displayName: 'Zip',
						name: 'zip',
						type: 'string',
						default: '',
						description: 'The postal code of the contact',
					},
					{
						displayName: 'Notes',
						name: 'notes',
						type: 'string',
						default: '',
						description: 'Additional notes about the contact',
					},
				],
			},
			// TODO: Add handlers for 'deal' resource
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'contact') {
					if (operation === 'create') {
						const contactFields = this.getNodeParameter('contactFields', i, {}) as IDataObject;
						const response = await arivoApiRequest.call(this, 'POST', '/contacts', contactFields);
						returnData.push({ json: response, pairedItem: { item: i } });
					} else if (operation === 'get') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const response = await arivoApiRequest.call(this, 'GET', `/contacts/${contactId}`);
						returnData.push({ json: response, pairedItem: { item: i } });
					} else if (operation === 'getMany') {
						const response = await arivoApiRequestAllItems.call(this, 'GET', '/contacts');
						returnData.push({ json: response, pairedItem: { item: i } });
					} else if (operation === 'update') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const contactFields = this.getNodeParameter('contactFields', i, {}) as IDataObject;
						const response = await arivoApiRequest.call(this, 'PUT', `/contacts/${contactId}`, contactFields);
						returnData.push({ json: response, pairedItem: { item: i } });
					}
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