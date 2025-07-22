import { INodeProperties } from 'n8n-workflow';

export const emailOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['email'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an email',
				action: 'Create an email',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an email permanently',
				action: 'Delete an email',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve an email',
				action: 'Get an email',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Retrieve a list of emails',
				action: 'Get many emails',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an email',
				action: 'Update an email',
			},
		],
		default: 'create',
	},
];

export const emailFields: INodeProperties[] = [
	// ----------------------------------
	//       email:create
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['email'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the contact to add this email to',
	},
	{
		displayName: 'Email Address',
		name: 'address',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['email'],
			},
		},
		default: '',
		required: true,
	},
	{
		displayName: 'Email Type',
		name: 'email_type',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['email'],
			},
		},
		options: [
			{
				name: 'Work',
				value: 'work',
			},
			{
				name: 'Home',
				value: 'home',
			},
		],
		default: 'work',
		required: true,
		description: 'Type of email address',
	},

	// ----------------------------------
	//       email:delete
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['email'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the contact',
	},
	{
		displayName: 'Email ID',
		name: 'emailId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['email'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the email to delete',
	},

	// ----------------------------------
	//       email:get
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['email'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the contact',
	},
	{
		displayName: 'Email ID',
		name: 'emailId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['email'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the email to retrieve',
	},

	// ----------------------------------
	//       email:update
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['email'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the contact',
	},
	{
		displayName: 'Email ID',
		name: 'emailId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['email'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the email to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['email'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Email Address',
				name: 'address',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email Type',
				name: 'email_type',
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
				],
				default: 'work',
				description: 'Type of email address',
			},
		],
	},

	// ----------------------------------
	//       email:getMany
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['email'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the contact to get emails for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['email'],
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
				resource: ['email'],
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
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['email'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Email Type',
				name: 'email_type',
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
				description: 'Filter by email type',
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['email'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Sort Field',
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
						name: 'Address',
						value: 'address',
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
			},
		],
	},
];
