import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class ArivoApi implements ICredentialType {
	name = 'arivoApi';
	displayName = 'Arivo API';
	documentationUrl = 'https://arivo.docs.apiary.io';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			placeholder: 'key1234567890abcdefkey1234567890',
			required: true,
		},
		// {
		// 	displayName: 'API URL',
		// 	name: 'apiUrl',
		// 	type: 'string',
		// 	default: 'https://arivo.com.br/api/v2/',
		// 	required: true,
		// },
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '=Token token={{$credentials.apiKey}}',
				'Content-Type': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: (globalThis as any).process?.env?.ARIVO_BASE_URL || 'https://arivo.com.br/api/v2/',
			url: '/teams?per_page=1',
		},
	};
} 