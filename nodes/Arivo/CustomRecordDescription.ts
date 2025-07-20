import { INodeProperties } from 'n8n-workflow';

// Operation descriptions
export const customRecordOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customRecord'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new custom record',
				action: 'Create a custom record',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a custom record',
				action: 'Delete a custom record',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a custom record',
				action: 'Get a custom record',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many custom records',
				action: 'Get many custom records',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a custom record',
				action: 'Update a custom record',
			},
		],
		default: 'create',
	},
];

// Custom fields component
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
					displayName: 'Field',
					name: 'field',
					type: 'options',
					typeOptions: {
						loadOptionsMethod: 'getCustomRecordCustomFields',
						loadOptionsDependsOn: ['customRecordDefinitionId'],
					},
					default: '',
					description: 'The custom field to set',
				},
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
					description: 'The value for this custom field',
				},
			],
		},
	],
	description: 'Custom fields for the custom record',
};

// Basic field definitions
const basicFields = {
	customRecordDefinitionId: {
		displayName: 'Custom Record Definition',
		name: 'customRecordDefinitionId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getCustomRecordDefinitions',
		},
		default: '',
		required: true,
		description: 'The custom record definition that defines the structure of this record',
	} as INodeProperties,
	dealId: {
		displayName: 'Deal ID',
		name: 'deal_id',
		type: 'string',
		default: '',
		description: 'ID of the deal associated with this custom record',
	} as INodeProperties,
	contactId: {
		displayName: 'Contact ID',
		name: 'contact_id',
		type: 'string',
		default: '',
		description: 'ID of the contact associated with this custom record',
	} as INodeProperties,
	tags: {
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: '',
		description: 'Tags for the custom record (comma-separated)',
	} as INodeProperties,
	userId: {
		displayName: 'User',
		name: 'user_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getUserOptions',
		},
		default: '',
		description: 'The user responsible for this custom record',
	} as INodeProperties,
	teamId: {
		displayName: 'Team',
		name: 'team_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTeamOptions',
		},
		default: '',
		description: 'The team responsible for this custom record',
	} as INodeProperties,
};

// Field definitions for each operation
export const customRecordFields: INodeProperties[] = [
	// Create operation
	{
		displayName: 'Custom Record Definition',
		name: 'customRecordDefinitionId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getCustomRecordDefinitions',
		},
		displayOptions: {
			show: {
				resource: ['customRecord'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The custom record definition that defines the structure of this record',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['customRecord'],
				operation: ['create'],
			},
		},
		options: [
			basicFields.dealId,
			basicFields.contactId,
			basicFields.tags,
			basicFields.userId,
			basicFields.teamId,
			customFields,
		],
	},

	// Get operation
	{
		displayName: 'Custom Record Definition',
		name: 'customRecordDefinitionId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getCustomRecordDefinitions',
		},
		displayOptions: {
			show: {
				resource: ['customRecord'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The custom record definition',
	},
	{
		displayName: 'Custom Record ID',
		name: 'customRecordId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customRecord'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the custom record',
	},

	// Get Many operation
	{
		displayName: 'Custom Record Definition',
		name: 'customRecordDefinitionId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getCustomRecordDefinitions',
		},
		displayOptions: {
			show: {
				resource: ['customRecord'],
				operation: ['getMany'],
			},
		},
		default: '',
		required: true,
		description: 'The custom record definition',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['customRecord'],
				operation: ['getMany'],
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
				resource: ['customRecord'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['customRecord'],
				operation: ['getMany'],
			},
		},
		options: [
			basicFields.contactId,
			basicFields.dealId,
			basicFields.tags,
			basicFields.userId,
			basicFields.teamId,
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['customRecord'],
				operation: ['getMany'],
			},
		},
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
				],
				default: 'updated_at',
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

	// Update operation
	{
		displayName: 'Custom Record Definition',
		name: 'customRecordDefinitionId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getCustomRecordDefinitions',
		},
		displayOptions: {
			show: {
				resource: ['customRecord'],
				operation: ['update'],
			},
		},
		default: '',
		required: true,
		description: 'The custom record definition',
	},
	{
		displayName: 'Custom Record ID',
		name: 'customRecordId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customRecord'],
				operation: ['update'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the custom record to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['customRecord'],
				operation: ['update'],
			},
		},
		options: [
			basicFields.dealId,
			basicFields.contactId,
			basicFields.tags,
			basicFields.userId,
			basicFields.teamId,
			customFields,
		],
	},

	// Delete operation
	{
		displayName: 'Custom Record Definition',
		name: 'customRecordDefinitionId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getCustomRecordDefinitions',
		},
		displayOptions: {
			show: {
				resource: ['customRecord'],
				operation: ['delete'],
			},
		},
		default: '',
		required: true,
		description: 'The custom record definition',
	},
	{
		displayName: 'Custom Record ID',
		name: 'customRecordId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customRecord'],
				operation: ['delete'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the custom record to delete',
	},
];