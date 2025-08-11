import {
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	IHookFunctions,
} from 'n8n-workflow';

import { arivoApiRequest } from './GenericFunctions';

export class ArivoTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Arivo CRM Trigger',
		name: 'arivoTrigger',
		icon: 'file:arivo.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when Arivo events occur',
		defaults: {
			name: 'Arivo CRM Trigger',
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
						name: 'Company Created',
						value: 'contact.company.created',
					},
					{
						name: 'Company Deleted',
						value: 'contact.company.deleted',
					},
					{
						name: 'Company Updated',
						value: 'contact.company.updated',
					},
					{
						name: 'Deal Created',
						value: 'deal.created',
					},
					{
						name: 'Deal Deleted',
						value: 'deal.deleted',
					},
					{
						name: 'Deal Lost',
						value: 'deal.lost',
					},
					{
						name: 'Deal Reopened',
						value: 'deal.reopen',
					},
					{
						name: 'Deal Updated',
						value: 'deal.updated',
					},
					{
						name: 'Deal Won',
						value: 'deal.won',
					},
					{
						name: 'Note Created',
						value: 'note.created',
					},
					{
						name: 'Note Deleted',
						value: 'note.deleted',
					},
					{
						name: 'Note Updated',
						value: 'note.updated',
					},
					{
						name: 'Person Created',
						value: 'contact.person.created',
					},
					{
						name: 'Person Deleted',
						value: 'contact.person.deleted',
					},
					{
						name: 'Person Updated',
						value: 'contact.person.updated',
					},
					{
						name: 'Task Created',
						value: 'task.created',
					},
					{
						name: 'Task Deleted',
						value: 'task.deleted',
					},
					{
						name: 'Task Done',
						value: 'task.done',
					},
					{
						name: 'Task Updated',
						value: 'task.updated',
					},
					{
						name: 'Task Updated to Not Done',
						value: 'task.undone',
					},
				],
				default: 'contact.person.created',
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
					const response = await arivoApiRequest.call(this, 'GET', '/webhooks');

					if (response && Array.isArray(response)) {
						const existingWebhook = response.find((webhook: any) => 
							webhook.callback_url === webhookUrl && 
							webhook.event === event
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

				const response = await arivoApiRequest.call(this, 'POST', '/webhooks', {
					callback_url: webhookUrl,
					event: event,
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
						await arivoApiRequest.call(this, 'DELETE', `/webhooks/${webhookData.webhookId}`);
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
