import { INodeProperties } from 'n8n-workflow';

export const addressOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['address'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new address',
				action: 'Create an address',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an address',
				action: 'Delete an address',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an address',
				action: 'Get an address',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many addresses',
				action: 'Get many addresses',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an address',
				action: 'Update an address',
			},
		],
		default: 'create',
	},
];

export const addressFields: INodeProperties[] = [
	// ----------------------------------
	//       address:create
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['address'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the contact to add this address to',
	},
	{
		displayName: 'Address Fields',
		name: 'addressFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['address'],
			},
		},
		default: {},
		description: 'At least one address field is required',
		options: [
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City name',
			},
			{
				displayName: 'Complement',
				name: 'complement',
				type: 'string',
				default: '',
				description: 'Address complement',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Country name',
			},
			{
				displayName: 'District',
				name: 'district',
				type: 'string',
				default: '',
				description: 'District or neighborhood',
			},
			{
				displayName: 'Number',
				name: 'number',
				type: 'string',
				default: '',
				description: 'Street number',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State name',
			},
			{
				displayName: 'Street',
				name: 'street',
				type: 'string',
				default: '',
				description: 'Street name, avenue, square, etc',
			},
			{
				displayName: 'ZIP Code',
				name: 'zip_code',
				type: 'string',
				default: '',
				description: 'ZIP code or postal code',
			},
		],
	},

	// ----------------------------------
	//       address:delete
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['address'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the contact',
	},
	{
		displayName: 'Address ID',
		name: 'addressId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['address'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the address to delete',
	},

	// ----------------------------------
	//       address:get
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['address'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the contact',
	},
	{
		displayName: 'Address ID',
		name: 'addressId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['address'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the address to retrieve',
	},

	// ----------------------------------
	//       address:update
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['address'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the contact',
	},
	{
		displayName: 'Address ID',
		name: 'addressId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['address'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the address to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['address'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City name',
			},
			{
				displayName: 'Complement',
				name: 'complement',
				type: 'string',
				default: '',
				description: 'Address complement',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Country name',
			},
			{
				displayName: 'District',
				name: 'district',
				type: 'string',
				default: '',
				description: 'District or neighborhood',
			},
			{
				displayName: 'Number',
				name: 'number',
				type: 'string',
				default: '',
				description: 'Street number',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State name',
			},
			{
				displayName: 'Street',
				name: 'street',
				type: 'string',
				default: '',
				description: 'Street name, avenue, square, etc',
			},
			{
				displayName: 'ZIP Code',
				name: 'zip_code',
				type: 'string',
				default: '',
				description: 'ZIP code or postal code',
			},
		],
	},

	// ----------------------------------
	//       address:getMany
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['address'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the contact to get addresses for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['address'],
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
				resource: ['address'],
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
				resource: ['address'],
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
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'Filter by state',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Filter by country',
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
				resource: ['address'],
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
						name: 'City',
						value: 'city',
					},
					{
						name: 'Country',
						value: 'country',
					},
					{
						name: 'Created At',
						value: 'created_at',
					},
					{
						name: 'State',
						value: 'state',
					},
					{
						name: 'Updated At',
						value: 'updated_at',
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