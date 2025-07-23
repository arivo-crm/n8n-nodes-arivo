import { INodeProperties } from 'n8n-workflow';

// Reusable field definitions from PersonDescription
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
						loadOptionsMethod: 'getCompanyCustomFields',
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
	description: 'Custom fields for the company',
};

const emailField: INodeProperties = {
	displayName: 'Email',
	name: 'email',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
	},
	default: {},
	options: [
		{
			displayName: 'Email',
			name: 'email',
			values: [
				{
					displayName: 'E-Mail Address',
					name: 'address',
					type: 'string',
					default: '',
					description: 'The email address',
				},
				{
					displayName: 'Type',
					name: 'type',
					type: 'options',
					options: [
						{
							name: 'Work',
							value: 'work',
						},
						{
							name: 'Personal',
							value: 'personal',
						},
						{
							name: 'Other',
							value: 'other',
						},
					],
					default: 'work',
					description: 'The type of email address',
				},
			],
		},
	],
	description: 'The email addresses of the company',
};

const phoneField: INodeProperties = {
	displayName: 'Phone',
	name: 'phone',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
	},
	default: {},
	options: [
		{
			displayName: 'Phone',
			name: 'phone',
			values: [
				{
					displayName: 'Number',
					name: 'number',
					type: 'string',
					default: '',
					description: 'The phone number',
				},
				{
					displayName: 'Type',
					name: 'type',
					type: 'options',
					options: [
						{
							name: 'Work',
							value: 'work',
						},
						{
							name: 'Mobile',
							value: 'mobile',
						},
						{
							name: 'Home',
							value: 'home',
						},
						{
							name: 'Other',
							value: 'other',
						},
					],
					default: 'work',
					description: 'The type of phone number',
				},
			],
		},
	],
	description: 'The phone numbers of the company',
};

const addressField: INodeProperties = {
	displayName: 'Address',
	name: 'address',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
	},
	default: {},
	options: [
		{
			displayName: 'Address',
			name: 'address',
			values: [
				{
					displayName: 'Street',
					name: 'street',
					type: 'string',
					default: '',
					description: 'The street address',
				},
				{
					displayName: 'City',
					name: 'city',
					type: 'string',
					default: '',
				},
				{
					displayName: 'State',
					name: 'state',
					type: 'string',
					default: '',
					description: 'The state/province',
				},
				{
					displayName: 'District',
					name: 'district',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Country',
					name: 'country',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Zip',
					name: 'zip',
					type: 'string',
					default: '',
					description: 'The postal code',
				},
				{
					displayName: 'Type',
					name: 'type',
					type: 'options',
					options: [
						{
							name: 'Work',
							value: 'work',
						},
						{
							name: 'Home',
							value: 'home',
						},
						{
							name: 'Other',
							value: 'other',
						},
					],
					default: 'work',
					description: 'The type of address',
				},
			],
		},
	],
	description: 'The addresses of the company',
};

// Company-specific field definitions
const companyFieldDefinitions = {
	cnpj: {
		displayName: 'CNPJ',
		name: 'cnpj',
		type: 'string',
		default: '',
		description: 'Brazilian company taxpayer registration (CNPJ)',
	} as INodeProperties,
	mainContactId: {
		displayName: 'Main Contact ID',
		name: 'main_contact_id',
		type: 'string',
		default: '',
		description: 'ID of the main contact person for this company',
	} as INodeProperties,
	website: {
		displayName: 'Website',
		name: 'website',
		type: 'string',
		default: '',
		description: 'Company website URL',
	} as INodeProperties,
	tags: {
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: '',
		description: 'The tags of the company',
	} as INodeProperties,
	userId: {
		displayName: 'User Name or ID',
		name: 'user_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getUserOptions',
		},
		default: '',
		description: 'The user assigned to this company. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	} as INodeProperties,
	teamId: {
		displayName: 'Team Name or ID',
		name: 'team_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTeamOptions',
		},
		default: '',
		description: 'The team assigned to this company. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	} as INodeProperties,
};

export const companyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['company'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a company',
				action: 'Create a company',
			},
			{
				name: 'Create or Update',
				value: 'createOrUpdate',
				description: 'Create a new company, or update the current one if it already exists (upsert)',
				action: 'Create or update a company',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a company permanently',
				action: 'Delete a company',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a company',
				action: 'Get a company',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Retrieve a list of companies',
				action: 'Get many companies',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a company',
				action: 'Update a company',
			},
		],
		default: 'create',
	},
];

export const companyFields: INodeProperties[] = [
	// ----------------------------------
	//         company:create
	// ----------------------------------
	{
		displayName: 'Company Name',
		name: 'companyName',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['company'],
			},
		},
		default: '',
		required: true,
		description: 'The name of the company',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['company'],
			},
		},
		default: {},
		options: [
			companyFieldDefinitions.cnpj,
			companyFieldDefinitions.mainContactId,
			companyFieldDefinitions.website,
			emailField,
			phoneField,
			companyFieldDefinitions.tags,
			companyFieldDefinitions.userId,
			companyFieldDefinitions.teamId,
			addressField,
			customFields,
		],
	},

	// ----------------------------------
	//         company:createOrUpdate
	// ----------------------------------
	{
		displayName: 'Company Name',
		name: 'companyName',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['createOrUpdate'],
				resource: ['company'],
			},
		},
		default: '',
		required: true,
		description: 'The name of the company',
	},
	{
		displayName: 'Field to Match On',
		name: 'matchField',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['createOrUpdate'],
				resource: ['company'],
			},
		},
		options: [
			{
				name: 'Name',
				value: 'name',
				description: 'Match companies by name',
			},
			{
				name: 'Email',
				value: 'email',
				description: 'Match companies by email address',
			},
			{
				name: 'CNPJ',
				value: 'cnpj',
				description: 'Match companies by CNPJ (Brazilian company taxpayer registration)',
			},
		],
		default: 'name',
		description: 'The field to use for finding existing companies to update',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['createOrUpdate'],
				resource: ['company'],
			},
		},
		default: {},
		options: [
			companyFieldDefinitions.cnpj,
			companyFieldDefinitions.mainContactId,
			companyFieldDefinitions.website,
			emailField,
			phoneField,
			companyFieldDefinitions.tags,
			companyFieldDefinitions.userId,
			companyFieldDefinitions.teamId,
			addressField,
			customFields,
		],
	},

	// ----------------------------------
	//         company:delete
	// ----------------------------------
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['company'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the company',
	},

	// ----------------------------------
	//         company:get
	// ----------------------------------
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['company'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the company',
	},

	// ----------------------------------
	//         company:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['company'],
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
				resource: ['company'],
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
				resource: ['company'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'Filter by city',
			},
			{
				...companyFieldDefinitions.cnpj,
				description: 'Filter by CNPJ (Brazilian company taxpayer registration)',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Filter by country',
			},
			{
				displayName: 'District',
				name: 'district',
				type: 'string',
				default: '',
				description: 'Filter by district',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Filter by email address',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by company name',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Filter by phone number',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'Filter by state/province',
			},
			{
				...companyFieldDefinitions.tags,
				description: 'Filter by tags (comma-separated)',
			},
			{
				...companyFieldDefinitions.teamId,
				description: 'Filter by team ID',
			},
			{
				...companyFieldDefinitions.userId,
				description: 'Filter by user ID',
			},
			{
				displayName: 'Zip Code',
				name: 'zip_code',
				type: 'string',
				default: '',
				description: 'Filter by ZIP code',
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
				resource: ['company'],
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
						name: 'Email',
						value: 'email',
					},
					{
						name: 'Name',
						value: 'name',
					},
					{
						name: 'Updated At',
						value: 'updated_at',
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
	//         company:update
	// ----------------------------------
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['company'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the company',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['company'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Company Name',
				name: 'updateCompanyName',
				type: 'string',
				default: '',
				description: 'The name of the company',
			},
			companyFieldDefinitions.cnpj,
			companyFieldDefinitions.mainContactId,
			companyFieldDefinitions.website,
			emailField,
			phoneField,
			companyFieldDefinitions.tags,
			companyFieldDefinitions.userId,
			companyFieldDefinitions.teamId,
			addressField,
			customFields,
		],
	},
];
