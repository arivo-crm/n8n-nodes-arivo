import { INodeProperties } from 'n8n-workflow';

// Note-specific field definitions
const noteFieldDefinitions = {
	text: {
		displayName: 'Text',
		name: 'text',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		default: '',
		description: 'The content text of the note',
	} as INodeProperties,
	contactId: {
		displayName: 'Contact ID',
		name: 'contact_id',
		type: 'string',
		default: '',
		description: 'ID of the contact or company to link this note to',
	} as INodeProperties,
	dealId: {
		displayName: 'Deal ID',
		name: 'deal_id',
		type: 'string',
		default: '',
		description: 'ID of the deal/opportunity to link this note to',
	} as INodeProperties,
	taskId: {
		displayName: 'Task ID',
		name: 'task_id',
		type: 'string',
		default: '',
		description: 'ID of the task/activity to link this note to',
	} as INodeProperties,
	userId: {
		displayName: 'User ID',
		name: 'user_id',
		type: 'string',
		default: '',
		description: 'ID of the user responsible for this note',
	} as INodeProperties,
	teamId: {
		displayName: 'Team ID',
		name: 'team_id',
		type: 'string',
		default: '',
		description: 'ID of the team responsible for this note',
	} as INodeProperties,
};

export const noteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['note'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a note',
				action: 'Create a note',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a note',
				action: 'Delete a note',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a note',
				action: 'Get a note',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many notes',
				action: 'Get many notes',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a note',
				action: 'Update a note',
			},
		],
		default: 'create',
	},
];

export const noteFields: INodeProperties[] = [
	// ----------------------------------
	//         note:create
	// ----------------------------------
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['note'],
			},
		},
		default: '',
		required: true,
		description: 'The content text of the note',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['note'],
			},
		},
		default: {},
		options: [
			noteFieldDefinitions.contactId,
			noteFieldDefinitions.dealId,
			noteFieldDefinitions.taskId,
			noteFieldDefinitions.userId,
			noteFieldDefinitions.teamId,
		],
	},

	// ----------------------------------
	//         note:delete
	// ----------------------------------
	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['note'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the note',
	},

	// ----------------------------------
	//         note:get
	// ----------------------------------
	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['note'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the note',
	},

	// ----------------------------------
	//         note:getMany
	// ----------------------------------
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['note'],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['note'],
			},
		},
		default: {},
		options: [
			{
				...noteFieldDefinitions.contactId,
				description: 'Filter by contact ID',
			},
			{
				...noteFieldDefinitions.dealId,
				description: 'Filter by deal ID',
			},
			{
				...noteFieldDefinitions.taskId,
				description: 'Filter by task ID',
			},
			{
				...noteFieldDefinitions.userId,
				description: 'Filter by user ID',
			},
			{
				...noteFieldDefinitions.teamId,
				description: 'Filter by team ID',
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

	// ----------------------------------
	//         note:update
	// ----------------------------------
	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['note'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the note',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['note'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Text',
				name: 'updateText',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				description: 'The content text of the note',
			},
			noteFieldDefinitions.contactId,
			noteFieldDefinitions.dealId,
			noteFieldDefinitions.taskId,
			noteFieldDefinitions.userId,
			noteFieldDefinitions.teamId,
		],
	},
];