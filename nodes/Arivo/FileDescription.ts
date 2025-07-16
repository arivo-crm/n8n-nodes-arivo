import { INodeProperties } from 'n8n-workflow';

// File-specific field definitions
const fileFieldDefinitions = {
	fileId: {
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the file',
	} as INodeProperties,
	contactId: {
		displayName: 'Contact ID',
		name: 'contact_id',
		type: 'string',
		default: '',
		description: 'ID of the contact or company linked to this file',
	} as INodeProperties,
	dealId: {
		displayName: 'Deal ID',
		name: 'deal_id',
		type: 'string',
		default: '',
		description: 'ID of the deal/opportunity linked to this file',
	} as INodeProperties,
	noteId: {
		displayName: 'Note ID',
		name: 'note_id',
		type: 'string',
		default: '',
		description: 'ID of the note linked to this file',
	} as INodeProperties,
	userId: {
		displayName: 'User ID',
		name: 'user_id',
		type: 'string',
		default: '',
		description: 'ID of the user responsible for this file',
	} as INodeProperties,
	teamId: {
		displayName: 'Team ID',
		name: 'team_id',
		type: 'string',
		default: '',
		description: 'ID of the team responsible for this file',
	} as INodeProperties,
};

export const fileOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'file',
				],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a file',
				action: 'Delete a file',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a file',
				action: 'Get a file',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many files',
				action: 'Get many files',
			},
		],
		default: 'get',
	},
];

export const fileFields: INodeProperties[] = [
	// ----------------------------------
	//         file:get
	// ----------------------------------
	{
		...fileFieldDefinitions.fileId,
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['get'],
			},
		},
	},

	// ----------------------------------
	//         file:delete
	// ----------------------------------
	{
		...fileFieldDefinitions.fileId,
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['delete'],
			},
		},
	},

	// ----------------------------------
	//         file:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['file'],
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
				resource: ['file'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		default: 20,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['getMany'],
			},
		},
		default: {},
		options: [
			{
				...fileFieldDefinitions.contactId,
				description: 'Filter by contact ID',
			},
			{
				...fileFieldDefinitions.dealId,
				description: 'Filter by deal ID',
			},
			{
				...fileFieldDefinitions.noteId,
				description: 'Filter by note ID',
			},
			{
				...fileFieldDefinitions.userId,
				description: 'Filter by user ID',
			},
			{
				...fileFieldDefinitions.teamId,
				description: 'Filter by team ID',
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['getMany'],
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
						name: 'Name',
						value: 'name',
					},
					{
						name: 'Size',
						value: 'size',
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
];