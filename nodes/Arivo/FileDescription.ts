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
		displayName: 'User Name or ID',
		name: 'user_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getUserOptions',
		},
		default: '',
		description: 'The user responsible for this file. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	} as INodeProperties,
	teamId: {
		displayName: 'Team Name or ID',
		name: 'team_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTeamOptions',
		},
		default: '',
		description: 'The team responsible for this file. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
				description: 'Delete a file permanently',
				action: 'Delete a file',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a file',
				action: 'Get a file',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Retrieve a list of files',
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
		},
		default: 50,
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
			},
		],
	},
];
