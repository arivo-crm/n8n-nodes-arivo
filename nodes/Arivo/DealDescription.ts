import { INodeProperties } from 'n8n-workflow';

// Reusable custom fields definition for deals
const customFields: INodeProperties = {
	displayName: 'Custom Fields',
	name: 'customFieldsUi',
	placeholder: 'Add Custom Field',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
	},
	default: {},
	options: [
		{
			name: 'customFieldsValues',
			displayName: 'Custom Field',
			values: [
				{
					displayName: 'Field Name or ID',
					name: 'field',
					type: 'options',
					typeOptions: {
						loadOptionsMethod: 'getDealCustomFields',
					},
					default: '',
					description: 'Name of the custom field. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				},
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
					description: 'Value of the custom field',
				},
			],
		},
	],
	description: 'Custom fields for the deal',
};

// Deal-specific field definitions
const dealFieldDefinitions = {
	description: {
		displayName: 'Description',
		name: 'description',
		type: 'string',
		placeholder: 'e.g. Annual software license renewal for 100 users',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		default: '',
		description: 'Description of the deal',
	} as INodeProperties,
	value: {
		displayName: 'Value',
		name: 'value',
		type: 'number',
		default: 0,
		description: 'Estimated value of the deal',
	} as INodeProperties,
	companyId: {
		displayName: 'Company ID',
		name: 'company_id',
		type: 'string',
		default: '',
		description: 'ID of the client company for this deal',
	} as INodeProperties,
	contactId: {
		displayName: 'Contact ID',
		name: 'contact_id',
		type: 'string',
		default: '',
		description: 'ID of the main contact for this deal',
	} as INodeProperties,
	status: {
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{
				name: 'Open',
				value: 'open',
			},
			{
				name: 'Won',
				value: 'won',
			},
			{
				name: 'Lost',
				value: 'lost',
			},
		],
		default: 'open',
		description: 'Status of the deal',
	} as INodeProperties,
	temperature: {
		displayName: 'Temperature',
		name: 'temperature',
		type: 'options',
		options: [
			{
				name: 'Cold',
				value: 'cold',
			},
			{
				name: 'Warm',
				value: 'warm',
			},
			{
				name: 'Hot',
				value: 'hot',
			},
		],
		default: 'warm',
		description: 'Temperature indicating probability of success',
	} as INodeProperties,
	openedAt: {
		displayName: 'Opened At',
		name: 'opened_at',
		type: 'dateTime',
		default: '',
		description: 'Date when the deal was opened (ISO-8601 format)',
	} as INodeProperties,
	estimatedCloseDate: {
		displayName: 'Estimated Close Date',
		name: 'estimated_close_date',
		type: 'dateTime',
		default: '',
		description: 'Estimated date when the deal will close (ISO-8601 format)',
	} as INodeProperties,
	closedAt: {
		displayName: 'Closed At',
		name: 'closed_at',
		type: 'dateTime',
		default: '',
		description: 'Date when the deal was closed (ISO-8601 format)',
	} as INodeProperties,
	pipelineId: {
		displayName: 'Pipeline Name or ID',
		name: 'pipeline_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getPipelines',
		},
		default: '',
		description: 'Sales pipeline for this deal. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	} as INodeProperties,
	pipelineStepId: {
		displayName: 'Pipeline Step Name or ID',
		name: 'pipeline_step_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getPipelineSteps',
			loadOptionsDependsOn: ['pipeline_id'],
		},
		default: '',
		description: 'Current step in the selected pipeline. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	} as INodeProperties,
	dealPipelineStepId: {
		displayName: 'Pipeline Step Name or ID',
		name: 'pipeline_step_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDealPipelineSteps',
		},
		default: '',
		description: 'New pipeline step for this deal. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	} as INodeProperties,
	tags: {
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: '',
		description: 'The tags of the deal',
	} as INodeProperties,
	userId: {
		displayName: 'User Name or ID',
		name: 'user_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getUserOptions',
		},
		default: '',
		description: 'The user assigned to this deal. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	} as INodeProperties,
	teamId: {
		displayName: 'Team Name or ID',
		name: 'team_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTeamOptions',
		},
		default: '',
		description: 'The team assigned to this deal. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	} as INodeProperties,
};

export const dealOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deal'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a deal',
				action: 'Create a deal',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a deal permanently',
				action: 'Delete a deal',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a deal',
				action: 'Get a deal',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Retrieve a list of deals',
				action: 'Get many deals',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a deal',
				action: 'Update a deal',
			},
		],
		default: 'create',
	},
];

export const dealFields: INodeProperties[] = [
	// ----------------------------------
	//         deal:create
	// ----------------------------------
	{
		displayName: 'Deal Name',
		name: 'dealName',
		type: 'string',
		placeholder: 'e.g. Software License Deal',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['deal'],
			},
		},
		default: '',
		required: true,
		description: 'The name of the deal',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['deal'],
			},
		},
		default: {},
		options: [
			dealFieldDefinitions.description,
			dealFieldDefinitions.value,
			dealFieldDefinitions.companyId,
			dealFieldDefinitions.contactId,
			dealFieldDefinitions.temperature,
			dealFieldDefinitions.openedAt,
			dealFieldDefinitions.estimatedCloseDate,
			dealFieldDefinitions.pipelineId,
			dealFieldDefinitions.tags,
			dealFieldDefinitions.userId,
			dealFieldDefinitions.teamId,
			customFields,
		],
	},

	// ----------------------------------
	//         deal:delete
	// ----------------------------------
	{
		displayName: 'Deal ID',
		name: 'dealId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['deal'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the deal',
	},

	// ----------------------------------
	//         deal:get
	// ----------------------------------
	{
		displayName: 'Deal ID',
		name: 'dealId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['deal'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the deal',
	},

	// ----------------------------------
	//         deal:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['deal'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['deal'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['deal'],
			},
		},
		default: {},
		options: [
			{
				...dealFieldDefinitions.companyId,
				description: 'Filter by company ID',
			},
			{
				...dealFieldDefinitions.contactId,
				description: 'Filter by contact ID',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				placeholder: 'e.g. Software License',
				default: '',
				description: 'Filter by deal name',
			},
			{
				...dealFieldDefinitions.pipelineId,
				description: 'Filter by pipeline ID',
			},
			{
				...dealFieldDefinitions.pipelineStepId,
				description: 'Filter by pipeline step ID',
			},
			{
				...dealFieldDefinitions.status,
				description: 'Filter by deal status',
			},
			{
				...dealFieldDefinitions.tags,
				description: 'Filter by tags (comma-separated)',
			},
			{
				...dealFieldDefinitions.teamId,
				description: 'Filter by team ID',
			},
			{
				...dealFieldDefinitions.temperature,
				description: 'Filter by deal temperature',
			},
			{
				...dealFieldDefinitions.userId,
				description: 'Filter by user ID',
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['deal'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Sort By',
				name: 'sort_field',
				type: 'options',
				options: [
					{
						name: 'Created At',
						value: 'created_at',
					},
					{
						name: 'Estimated Close Date',
						value: 'estimated_close_date',
					},
					{
						name: 'Name',
						value: 'name',
					},
					{
						name: 'Opened At',
						value: 'opened_at',
					},
					{
						name: 'Updated At',
						value: 'updated_at',
					},
					{
						name: 'Value',
						value: 'value',
					},
				],
				default: 'created_at',
				description: 'Field to sort results by',
			},
			{
				displayName: 'Sort Order',
				name: 'sort_order',
				type: 'options',
				options: [
					{
						name: 'Ascending',
						value: 'asc',
					},
					{
						name: 'Descending',
						value: 'desc',
					},
				],
				default: 'desc',
				description: 'Order to sort results by',
			},
		],
	},

	// ----------------------------------
	//         deal:update
	// ----------------------------------
	{
		displayName: 'Deal ID',
		name: 'dealId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['deal'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the deal',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['deal'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Deal Name',
				name: 'updateDealName',
				type: 'string',
				placeholder: 'e.g. Software License Deal',
				default: '',
				description: 'The name of the deal',
			},
			dealFieldDefinitions.description,
			dealFieldDefinitions.value,
			dealFieldDefinitions.companyId,
			dealFieldDefinitions.contactId,
			dealFieldDefinitions.status,
			dealFieldDefinitions.temperature,
			dealFieldDefinitions.openedAt,
			dealFieldDefinitions.estimatedCloseDate,
			dealFieldDefinitions.closedAt,
			dealFieldDefinitions.dealPipelineStepId,
			dealFieldDefinitions.tags,
			dealFieldDefinitions.userId,
			dealFieldDefinitions.teamId,
			customFields,
		],
	},
];
