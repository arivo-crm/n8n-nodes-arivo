import { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
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
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact',
				action: 'Delete a contact',
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
];

export const contactFields: INodeProperties[] = [
	// ----------------------------------
	//         contact:create
	// ----------------------------------
	{
		displayName: 'Contact Name',
		name: 'contactName',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['contact'],
			},
		},
		default: '',
		required: true,
		description: 'The name of the contact',
	},
	{
		displayName: 'Contact Type',
		name: 'contact_type',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['contact'],
			},
		},
		options: [
			{
				name: 'Person',
				value: 'person',
			},
			{
				name: 'Company',
				value: 'company',
			},
		],
		default: 'person',
		required: true,
		description: 'The type of the contact',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['contact'],
			},
		},
		default: {},
		options: [
			{
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
								displayName: 'E-mail address',
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
				description: 'The email addresses of the contact',
			},
			{
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
				description: 'The phone numbers of the contact',
			},
			{
				displayName: 'Company ID',
				name: 'company_id',
				type: 'string',
				default: '',
				description: 'The company ID of the contact',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'string',
				default: '',
				description: 'The job position of the contact',
			},
            {
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'The tags of the contact',
			},
            {
				displayName: 'User ID',
				name: 'user_id',
				type: 'string',
				default: '',
				description: 'The user ID owner of the contact',
			},
            {
				displayName: 'Team ID',
				name: 'team_id',
				type: 'string',
				default: '',
				description: 'The team ID owner of the contact',
			},            
			{
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
								description: 'The city',
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
								description: 'The district',
							},
							{
								displayName: 'Country',
								name: 'country',
								type: 'string',
								default: '',
								description: 'The country',
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
				description: 'The addresses of the contact',
			},
			{
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
									loadOptionsMethod: 'getContactCustomFields',
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
				description: 'Custom fields for the contact',
			},
		],
	},

	// ----------------------------------
	//         contact:delete
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['contact'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the contact',
	},

	// ----------------------------------
	//         contact:get
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['contact'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the contact',
	},

	// ----------------------------------
	//         contact:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['contact'],
			},
		},
		default: true,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['contact'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 100,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['getMany'],
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
				description: 'Filter by contact name',
			},
			{
				displayName: 'CPF',
				name: 'cpf',
				type: 'string',
				default: '',
				description: 'Filter by CPF (Brazilian individual taxpayer registration)',
			},
			{
				displayName: 'CNPJ',
				name: 'cnpj',
				type: 'string',
				default: '',
				description: 'Filter by CNPJ (Brazilian corporate taxpayer registration)',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Filter by email address',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Filter by phone number',
			},
			{
				displayName: 'District',
				name: 'district',
				type: 'string',
				default: '',
				description: 'Filter by district',
			},
            {
				displayName: 'Zip code',
				name: 'zip_code',
				type: 'string',
				default: '',
				description: 'Filter by ZIP code',
			},
            {
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'Filter by city',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'Filter by state/province',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Filter by country',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Filter by tags (comma-separated)',
			},
			{
				displayName: 'Company ID',
				name: 'company_id',
				type: 'string',
				default: '',
				description: 'Filter by company ID',
			},
			{
				displayName: 'User ID',
				name: 'user_id',
				type: 'string',
				default: '',
				description: 'Filter by user ID',
			},
            {
				displayName: 'Team ID',
				name: 'team_id',
				type: 'string',
				default: '',
				description: 'Filter by team ID',
			},
			{
				displayName: 'Contact Type',
				name: 'contact_type',
				type: 'options',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Person',
						value: 'person',
					},
					{
						name: 'Company',
						value: 'company',
					},
				],
				default: '',
				description: 'Filter by contact type',
			},
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
						name: 'Updated At',
						value: 'updated_at',
					},
					{
						name: 'Name',
						value: 'name',
					},
					{
						name: 'Email',
						value: 'email',
					},
				],
				default: 'created_at',
				description: 'Field to sort by',
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
				description: 'Sort order',
			},
		],
	},

	// ----------------------------------
	//         contact:update
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['contact'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the contact',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['contact'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Contact Name',
				name: 'updateContactName',
				type: 'string',
				default: '',
				description: 'The name of the contact',
			},
			{
				displayName: 'Contact Type',
				name: 'updateContactType',
				type: 'options',
				options: [
					{
						name: 'Person',
						value: 'person',
					},
					{
						name: 'Company',
						value: 'company',
					},
				],
				default: 'person',
				description: 'The type of the contact',
			},
			{
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
								displayName: 'E-mail address',
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
				description: 'The email addresses of the contact',
			},
			{
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
				description: 'The phone numbers of the contact',
			},
			{
				displayName: 'Company ID',
				name: 'company_id',
				type: 'string',
				default: '',
				description: 'The company ID of the contact',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'string',
				default: '',
				description: 'The job position of the contact',
			},
            {
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'The tags of the contact',
			},
            {
				displayName: 'User ID',
				name: 'user_id',
				type: 'string',
				default: '',
				description: 'The user ID owner of the contact',
			},
            {
				displayName: 'Team ID',
				name: 'team_id',
				type: 'string',
				default: '',
				description: 'The team ID owner of the contact',
			},
			{
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
								description: 'The city',
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
								description: 'The district',
							},
							{
								displayName: 'Country',
								name: 'country',
								type: 'string',
								default: '',
								description: 'The country',
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
				description: 'The addresses of the contact',
			},
			{
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
									loadOptionsMethod: 'getContactCustomFields',
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
				description: 'Custom fields for the contact',
			},
		],
	},
]; 