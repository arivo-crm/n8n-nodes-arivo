import {
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IDataObject,
	IWebhookResponseData,
	IHookFunctions,
} from 'n8n-workflow';

export class ArivoTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Arivo Trigger',
		name: 'arivoTrigger',
		icon: 'file:arivo.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when Arivo events occur',
		defaults: {
			name: 'Arivo Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'arivoApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Contact Created',
						value: 'contact.created',
					},
					{
						name: 'Contact Updated',
						value: 'contact.updated',
					},
					{
						name: 'Contact Deleted',
						value: 'contact.deleted',
					},
					{
						name: 'Deal Created',
						value: 'deal.created',
					},
					{
						name: 'Deal Updated',
						value: 'deal.updated',
					},
					{
						name: 'Deal Deleted',
						value: 'deal.deleted',
					},
				],
				default: 'contact.created',
			},
		],
	};

	webhookMethods = {
		default: {
			async create(this: IHookFunctions) {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const webhookData = this.getWorkflowStaticData('node');

				const response = await this.helpers.request({
					method: 'POST',
					url: '/webhooks',
					body: {
						url: webhookUrl,
						event: event,
					},
				});
				
				if (!response.id) {
					return false;
				}

				webhookData.webhookId = response.id as string;
				return true;
			},
			async delete(this: IHookFunctions) {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId) {
					try {
						await this.helpers.request({
							method: 'DELETE',
							url: `/webhooks/${webhookData.webhookId}`,
						});
						delete webhookData.webhookId;
					} catch (error) {
						// It's possible the webhook was already deleted, so we'll ignore errors here.
						return false;
					}
				}
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const bodyArray = Array.isArray(req.body) ? req.body : [req.body];
		return {
			workflowData: [this.helpers.returnJsonArray(bodyArray as IDataObject[])],
		};
	}
} 