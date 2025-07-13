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

// Common test data for company operations
export const mockCompanyData = {
	id: 456,
	name: 'Acme Corporation',
	contact_type: 'company',
	cnpj: '12.345.678/0001-90',
	main_contact_id: '123',
	website: 'https://acme.com',
	emails: [
		{
			address: 'contact@acme.com',
			type: 'work',
		},
	],
	phones: [
		{
			number: '(11) 1234-5678',
			type: 'work',
		},
	],
	addresses: [
		{
			street: '123 Business Ave',
			city: 'São Paulo',
			state: 'SP',
			district: 'Centro',
			country: 'Brazil',
			zip: '01234-567',
			type: 'work',
		},
	],
	custom_fields: {
		'industry': 'Technology',
		'employees': '100-500',
	},
	tags: ['corporate', 'technology'],
	user_id: '1',
	team_id: '2',
	created_at: '2024-01-15T10:30:00-03:00',
	updated_at: '2024-01-15T10:30:00-03:00',
};

// Mock API response for getMany companies operation
export const mockCompaniesListResponse = {
	data: [
		mockCompanyData,
		{
			...mockCompanyData,
			id: 789,
			name: 'Global Tech Solutions',
			cnpj: '98.765.432/0001-10',
			main_contact_id: '124',
			website: 'https://globaltech.com',
			emails: [],
			phones: [],
			addresses: [],
			tags: ['global', 'solutions'],
			custom_fields: {},
			user_id: '2',
			team_id: '1',
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

// Common test data for deal operations
export const mockDealData = {
	id: 100,
	name: 'Big Software Deal',
	description: 'Large enterprise software implementation project',
	value: 150000.00,
	company_id: '456',
	contact_id: '123',
	status: 'open',
	temperature: 'hot',
	opened_at: '2024-01-15T10:30:00-03:00',
	estimated_close_date: '2024-03-15T00:00:00-03:00',
	closed_at: null,
	pipeline_id: '1',
	pipeline_step_id: '3',
	quote_items: [],
	custom_fields: {
		'probability': '80%',
		'source': 'website',
	},
	tags: ['enterprise', 'software'],
	user_id: '1',
	team_id: '2',
	created_at: '2024-01-15T10:30:00-03:00',
	updated_at: '2024-01-15T10:30:00-03:00',
};

// Mock API response for getMany deals operation
export const mockDealsListResponse = {
	data: [
		mockDealData,
		{
			...mockDealData,
			id: 101,
			name: 'Consulting Project',
			description: 'Strategic consulting engagement',
			value: 75000.00,
			company_id: '789',
			contact_id: '124',
			temperature: 'warm',
			opened_at: '2024-01-16T14:20:00-03:00',
			estimated_close_date: '2024-02-28T00:00:00-03:00',
			pipeline_step_id: '2',
			tags: ['consulting', 'strategy'],
			custom_fields: {},
			user_id: '2',
			team_id: '1',
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

// Common test data for note operations
export const mockNoteData = {
	id: '1',
	object: 'note',
	text: 'This is a sample note for testing purposes',
	contact_id: '123',
	deal_id: null,
	task_id: null,
	user_id: '1',
	team_id: '2',
	created_at: '2012-06-25T04:08:00-03:00',
	updated_at: '2012-06-25T04:08:00-03:00',
};

// Mock API response for getMany notes operation
export const mockNotesListResponse = {
	data: [
		mockNoteData,
		{
			...mockNoteData,
			id: '2',
			text: 'Another note linked to a deal',
			contact_id: null,
			deal_id: '456',
			user_id: '2',
			team_id: '1',
			created_at: '2012-06-25T04:09:00-03:00',
			updated_at: '2012-06-25T04:09:00-03:00',
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

// Common test data for task operations
export const mockTaskData = {
	id: '1',
	object: 'task',
	created_at: '2012-06-25T04:08:00-03:00',
	updated_at: '2012-06-25T04:08:00-03:00',
	name: 'Conversa sobre o contrato',
	done: false,
	task_type_id: '1',
	due_type_id: 998,
	due_date: '2012-12-31T16:00:00-02:00',
	due_date_end: '2012-12-31T17:00:00-02:00',
	completed_at: null,
	comment: 'Marquei no café ao lado do prédio.',
	contact_id: null,
	deal_id: null,
	task_recurrence: null,
	tags: [],
	team_id: null,
	user_id: '1',
	creator_id: null,
};

// Mock API response for getMany tasks operation
export const mockTasksListResponse = {
	data: [
		mockTaskData,
		{
			...mockTaskData,
			id: '2',
			name: 'Entregar documentação do míssil',
			done: true,
			task_type_id: '2',
			due_type_id: 999,
			due_date: null,
			due_date_end: null,
			completed_at: '2012-06-26T10:00:00-03:00',
			comment: 'Documentação entregue com sucesso',
			contact_id: null,
			deal_id: '456',
			tags: ['urgent', 'documentation'],
			team_id: '1',
			user_id: '2',
			creator_id: '1',
		},
	],
	meta: {
		pagination: {
			current_page: 1,
			per_page: 50,
			total: 2,
		},
	},
};

// Mock activity types data
export const mockActivityTypes = [
	{
		id: 7,
		label: 'Tarefa',
	},
	{
		id: 8,
		label: 'Visita',
	},
	{
		id: 9,
		label: 'Ligação',
	},
	{
		id: 10,
		label: 'Email',
	},
	{
		id: 11,
		label: 'Reunião',
	},
];

// Mock API response headers
export const mockApiHeaders = {
	'x-total': '2',
	'x-next-page': null,
	'x-ratelimit-limit': '1000',
	'x-ratelimit-remaining': '999',
	'x-ratelimit-reset': '1672531200',
	'content-type': 'application/json',
};