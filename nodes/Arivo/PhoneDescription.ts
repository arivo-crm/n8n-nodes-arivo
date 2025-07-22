import { INodeProperties } from 'n8n-workflow';

export const phoneOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['phone'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a phone',
				action: 'Create a phone',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a phone permanently',
				action: 'Delete a phone',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a phone',
				action: 'Get a phone',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Retrieve a list of phones',
				action: 'Get many phones',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a phone',
				action: 'Update a phone',
			},
		],
		default: 'create',
	},
];

export const phoneFields: INodeProperties[] = [
	// ----------------------------------
	//       phone:create
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['phone'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the contact to add this phone to',
	},
	{
		displayName: 'Phone Number',
		name: 'number',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['phone'],
			},
		},
		default: '',
		required: true,
		description: 'Phone number including area code',
	},
	{
		displayName: 'Phone Type',
		name: 'phone_type',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['phone'],
			},
		},
		options: [
			{
				name: 'Work',
				value: 'work',
			},
			{
				name: 'Cell',
				value: 'cell',
			},
			{
				name: 'Home',
				value: 'home',
			},
			{
				name: 'Fax',
				value: 'fax',
			},
		],
		default: 'work',
		required: true,
		description: 'Type of phone number',
	},

	// ----------------------------------
	//       phone:delete
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['phone'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the contact',
	},
	{
		displayName: 'Phone ID',
		name: 'phoneId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['phone'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the phone to delete',
	},

	// ----------------------------------
	//       phone:get
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['phone'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the contact',
	},
	{
		displayName: 'Phone ID',
		name: 'phoneId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['phone'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the phone to retrieve',
	},

	// ----------------------------------
	//       phone:update
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['phone'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the contact',
	},
	{
		displayName: 'Phone ID',
		name: 'phoneId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['phone'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the phone to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['phone'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Phone Number',
				name: 'number',
				type: 'string',
				default: '',
				description: 'Phone number including area code',
			},
			{
				displayName: 'Phone Type',
				name: 'phone_type',
				type: 'options',
				options: [
					{
						name: 'Work',
						value: 'work',
					},
					{
						name: 'Cell',
						value: 'cell',
					},
					{
						name: 'Home',
						value: 'home',
					},
					{
						name: 'Fax',
						value: 'fax',
					},
				],
				default: 'work',
				description: 'Type of phone number',
			},
		],
	},

	// ----------------------------------
	//       phone:getMany
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['phone'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the contact to get phones for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['phone'],
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
				resource: ['phone'],
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
				resource: ['phone'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Phone Type',
				name: 'phone_type',
				type: 'options',
				options: [
					{
						name: 'Cell',
						value: 'cell',
					},
					{
						name: 'Fax',
						value: 'fax',
					},
					{
						name: 'Home',
						value: 'home',
					},
					{
						name: 'Other',
						value: 'other',
					},
					{
						name: 'Work',
						value: 'work',
					},
				],
				default: 'work',
				description: 'Filter by phone type',
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
				resource: ['phone'],
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
						name: 'Number',
						value: 'number',
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
