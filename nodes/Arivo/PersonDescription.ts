import { INodeProperties } from 'n8n-workflow';

// Reusable field definitions
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
						loadOptionsMethod: 'getPersonCustomFields',
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
	description: 'Custom fields for the person',
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
					placeholder: 'e.g. nathan@example.com',
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
	description: 'The email addresses of the person',
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
					placeholder: 'e.g. +55 11 99999-9999',
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
	description: 'The phone numbers of the person',
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
					placeholder: 'e.g. 123 Main Street',
					default: '',
					description: 'The street address',
				},
				{
					displayName: 'City',
					name: 'city',
					type: 'string',
					placeholder: 'e.g. São Paulo',
					default: '',
				},
				{
					displayName: 'State',
					name: 'state',
					type: 'string',
					placeholder: 'e.g. SP',
					default: '',
					description: 'The state/province',
				},
				{
					displayName: 'District',
					name: 'district',
					type: 'string',
					placeholder: 'e.g. Vila Madalena',
					default: '',
				},
				{
					displayName: 'Country',
					name: 'country',
					type: 'string',
					placeholder: 'e.g. Brazil',
					default: '',
				},
				{
					displayName: 'Zip',
					name: 'zip',
					type: 'string',
					placeholder: 'e.g. 01310-100',
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
	description: 'The addresses of the person',
};

// Basic field definitions
const basicFields = {
	cpf: {
		displayName: 'CPF',
		name: 'cpf',
		type: 'string',
		default: '',
		description: 'Brazilian individual taxpayer registration (CPF)',
	} as INodeProperties,
	birthDate: {
		displayName: 'Birth Date',
		name: 'birth_date',
		type: 'dateTime',
		default: '',
		description: 'Birth date of the person (YYYY-MM-DD format)',
	} as INodeProperties,
	position: {
		displayName: 'Position',
		name: 'position',
		type: 'string',
		placeholder: 'e.g. Software Engineer',
		default: '',
		description: 'Job position of the person',
	} as INodeProperties,
	companyId: {
		displayName: 'Company ID',
		name: 'company_id',
		type: 'string',
		default: '',
		description: 'ID of the company where this person works',
	} as INodeProperties,
	tags: {
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: '',
		description: 'The tags of the person',
	} as INodeProperties,
	userId: {
		displayName: 'User Name or ID',
		name: 'user_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getUserOptions',
		},
		default: '',
		description: 'The user assigned to this person. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	} as INodeProperties,
	teamId: {
		displayName: 'Team Name or ID',
		name: 'team_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTeamOptions',
		},
		default: '',
		description: 'The team assigned to this person. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	} as INodeProperties,
};

export const personOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['person'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a person',
				action: 'Create a person',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a person permanently',
				action: 'Delete a person',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a person',
				action: 'Get a person',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Retrieve a list of persons',
				action: 'Get many persons',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a person',
				action: 'Update a person',
			},
		],
		default: 'create',
	},
];

export const personFields: INodeProperties[] = [
	// ----------------------------------
	//         person:create
	// ----------------------------------
	{
		displayName: 'Person Name',
		name: 'personName',
		type: 'string',
		placeholder: 'e.g. Nathan Smith',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['person'],
			},
		},
		default: '',
		required: true,
		description: 'The name of the person',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['person'],
			},
		},
		default: {},
		options: [
			basicFields.cpf,
			basicFields.birthDate,
			basicFields.position,
			basicFields.companyId,
			emailField,
			phoneField,
			basicFields.tags,
			basicFields.userId,
			basicFields.teamId,
			addressField,
			customFields,
		],
	},

	// ----------------------------------
	//         person:delete
	// ----------------------------------
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['person'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the person',
	},

	// ----------------------------------
	//         person:get
	// ----------------------------------
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['person'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the person',
	},

	// ----------------------------------
	//         person:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['person'],
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
				resource: ['person'],
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
				resource: ['person'],
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
				...basicFields.companyId,
				description: 'Filter by company ID',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Filter by country',
			},
			{
				...basicFields.cpf,
				description: 'Filter by CPF (Brazilian individual taxpayer registration)',
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
				placeholder: 'e.g. nathan@example.com',
				default: '',
				description: 'Filter by email address',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				placeholder: 'e.g. John Smith',
				default: '',
				description: 'Filter by contact name',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				placeholder: 'e.g. +55 11 99999-9999',
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
				...basicFields.tags,
				description: 'Filter by tags (comma-separated)',
			},
			{
				...basicFields.teamId,
				description: 'Filter by team ID',
			},
			{
				...basicFields.userId,
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
				resource: ['person'],
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
	//         person:update
	// ----------------------------------
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['person'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the person',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['person'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Person Name',
				name: 'updatePersonName',
				type: 'string',
				default: '',
				description: 'The name of the person',
			},
			basicFields.cpf,
			basicFields.birthDate,
			basicFields.position,
			basicFields.companyId,
			emailField,
			phoneField,
			basicFields.tags,
			basicFields.userId,
			basicFields.teamId,
			addressField,
			customFields,
		],
	},
]; 
