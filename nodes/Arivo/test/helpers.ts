import {
	ICredentialDataDecryptedObject,
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	INode,
	INodeExecutionData,
} from 'n8n-workflow';

// Mock node definition for testing
export const mockNode: INode = {
	name: 'Arivo Test Node',
	typeVersion: 1,
	type: 'n8n-nodes-arivo.arivo',
	position: [0, 0],
	parameters: {},
};

// Helper to create mock execute function for person operations
export const createMockExecuteFunction = (
	nodeParameters: IDataObject,
	items: INodeExecutionData[] = [{ json: {} }],
): IExecuteFunctions => {
	const mockExecuteFunction = {
		getInputData(): INodeExecutionData[] {
			return items;
		},

		getNodeParameter(
			parameterName: string,
			itemIndex: number,
			fallbackValue?: any,
			options?: { extractValue?: boolean },
		): any {
			const parameter = options?.extractValue ? `${parameterName}.value` : parameterName;
			return getNestedProperty(nodeParameters, parameter, fallbackValue);
		},

		getNode(): INode {
			return mockNode;
		},

		helpers: {
			constructExecutionMetaData(
				inputData: INodeExecutionData[],
				options: { itemData: { item: number } },
			): INodeExecutionData[] {
				return inputData.map((item) => ({
					...item,
					pairedItem: { item: options.itemData.item },
				}));
			},

			returnJsonArray(jsonData: IDataObject[]): INodeExecutionData[] {
				return jsonData.map((item) => ({ json: item }));
			},

			requestWithAuthentication: jest.fn(),
		},

		continueOnFail(): boolean {
			return false;
		},

		getCredentials: jest.fn().mockResolvedValue({
			apiKey: 'test-api-key',
			baseUrl: 'https://test.arivo.com.br/api/v2',
		}),
	} as unknown as IExecuteFunctions;

	return mockExecuteFunction;
};

// Helper to create mock hook function for trigger tests
export const createMockHookFunction = (
	nodeParameters: IDataObject,
	credentials: ICredentialDataDecryptedObject = {},
): IHookFunctions => {
	return {
		getNodeParameter(parameterName: string, fallbackValue?: any): any {
			return getNestedProperty(nodeParameters, parameterName, fallbackValue);
		},

		getNode(): INode {
			return mockNode;
		},

		getNodeWebhookUrl(name: string): string {
			return `https://test-webhook.n8n.cloud/webhook/${name}`;
		},

		getWorkflowStaticData(type: string): IDataObject {
			return {};
		},

		getCredentials: jest.fn().mockResolvedValue(credentials),

		helpers: {
			requestWithAuthentication: jest.fn(),
			returnJsonArray: jest.fn().mockImplementation((data) => 
				data.map((item: any) => ({ json: item }))
			),
			request: jest.fn(),
		},
	} as unknown as IHookFunctions;
};

// Helper to create mock load options function
export const createMockLoadOptionsFunctions = (
	nodeParameters: IDataObject = {},
): ILoadOptionsFunctions => {
	return {
		getNodeParameter(parameterName: string, fallbackValue?: any): any {
			return getNestedProperty(nodeParameters, parameterName, fallbackValue);
		},

		getNode(): INode {
			return mockNode;
		},

		getCredentials: jest.fn().mockResolvedValue({
			apiKey: 'test-api-key',
			baseUrl: 'https://test.arivo.com.br/api/v2',
		}),

		helpers: {
			requestWithAuthentication: jest.fn(),
			returnJsonArray: jest.fn().mockImplementation((data) => 
				data.map((item: any) => ({ json: item }))
			),
		},
	} as unknown as ILoadOptionsFunctions;
};

// Utility function to get nested property from object using dot notation
function getNestedProperty(obj: any, path: string, fallbackValue?: any): any {
	const keys = path.split('.');
	let current = obj;

	for (const key of keys) {
		if (current === null || current === undefined || !(key in current)) {
			return fallbackValue;
		}
		current = current[key];
	}

	return current;
}

// Common test data for person operations
export const mockPersonData = {
	id: 123,
	name: 'John Doe',
	contact_type: 'person',
	cpf: '123.456.789-00',
	birth_date: '1990-01-01',
	position: 'Software Engineer',
	company_id: 456,
	emails: [
		{
			address: 'john.doe@example.com',
			type: 'work',
		},
	],
	phones: [
		{
			number: '+55 11 99999-9999',
			type: 'mobile',
		},
	],
	addresses: [
		{
			street: '123 Main St',
			city: 'São Paulo',
			state: 'SP',
			country: 'Brazil',
			zip: '01234-567',
			type: 'work',
		},
	],
	custom_fields: {
		'custom_field_1': 'Custom Value 1',
	},
	tags: ['tag1', 'tag2'],
	user_id: 789,
	team_id: 101,
	created_at: '2023-01-01T10:00:00Z',
	updated_at: '2023-01-02T10:00:00Z',
};

// Mock API response for getMany operation
export const mockPersonsListResponse = {
	data: [
		mockPersonData,
		{
			...mockPersonData,
			id: 124,
			name: 'Jane Smith',
			cpf: '987.654.321-00',
			emails: [
				{
					address: 'jane.smith@example.com',
					type: 'work',
				},
			],
		},
	],
	meta: {
		pagination: {
			current_page: 1,
			per_page: 20,
			total: 2,
		},
	},
};

// Mock API response headers
export const mockApiHeaders = {
	'x-total': '2',
	'x-next-page': null,
	'x-ratelimit-limit': '1000',
	'x-ratelimit-remaining': '999',
	'x-ratelimit-reset': '1672531200',
	'content-type': 'application/json',
};