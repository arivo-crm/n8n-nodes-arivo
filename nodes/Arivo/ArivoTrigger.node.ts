import {
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
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
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const webhookData = this.getWorkflowStaticData('node');

				try {
					const response = await this.helpers.request({
						method: 'GET',
						url: '/webhooks',
					});

					if (response.data && Array.isArray(response.data)) {
						const existingWebhook = response.data.find((webhook: any) => 
							webhook.url === webhookUrl && 
							webhook.events && 
							webhook.events.includes(event)
						);

						if (existingWebhook) {
							webhookData.webhookId = existingWebhook.id;
							return true;
						}
					}
				} catch (error) {
					// If we can't check, assume it doesn't exist
					return false;
				}

				return false;
			},
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
		const bodyData = this.getBodyData();
		return {
			workflowData: [this.helpers.returnJsonArray([bodyData])],
		};
	}
} 