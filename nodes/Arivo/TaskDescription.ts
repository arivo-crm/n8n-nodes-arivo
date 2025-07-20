import { INodeProperties } from 'n8n-workflow';

// Task-specific field definitions
const taskFieldDefinitions = {
	name: {
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Name of the task',
	} as INodeProperties,
	taskType: {
		displayName: 'Task Type Name or ID',
		name: 'task_type_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTaskTypes',
		},
		default: '',
		description: 'Type of the task. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	} as INodeProperties,
	dueType: {
		displayName: 'Due Type',
		name: 'due_type_id',
		type: 'options',
		options: [
			{
				name: 'With Date',
				value: 998,
			},
			{
				name: 'No Date',
				value: 999,
			},
		],
		default: 998,
		description: 'Whether the task has a due date or not',
	} as INodeProperties,
	dueDate: {
		displayName: 'Due Date',
		name: 'due_date',
		type: 'dateTime',
		default: '',
		description: 'Date and time when the task is due',
	} as INodeProperties,
	dueDateEnd: {
		displayName: 'Due Date End',
		name: 'due_date_end',
		type: 'dateTime',
		default: '',
		description: 'End date and time for the task (must be after due date)',
	} as INodeProperties,
	done: {
		displayName: 'Done',
		name: 'done',
		type: 'boolean',
		default: false,
		description: 'Whether the task is marked as completed',
	} as INodeProperties,
	comment: {
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		default: '',
		description: 'Comment about the task',
	} as INodeProperties,
	contactId: {
		displayName: 'Contact ID',
		name: 'contact_id',
		type: 'number',
		default: '',
		description: 'ID of the contact or company related to this task',
	} as INodeProperties,
	dealId: {
		displayName: 'Deal ID',
		name: 'deal_id',
		type: 'number',
		default: '',
		description: 'ID of the deal/opportunity related to this task',
	} as INodeProperties,
	userId: {
		displayName: 'User Name or ID',
		name: 'user_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getUserOptions',
		},
		default: '',
		description: 'The user responsible for this task. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	} as INodeProperties,
	teamId: {
		displayName: 'Team Name or ID',
		name: 'team_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTeamOptions',
		},
		default: '',
		description: 'The team responsible for this task. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	} as INodeProperties,
	tags: {
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: '',
		description: 'Comma-separated list of tags for the task',
	} as INodeProperties,
};

export const taskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['task'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new task',
				action: 'Create a task',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a task',
				action: 'Delete a task',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a task',
				action: 'Get a task',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get multiple tasks',
				action: 'Get multiple tasks',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a task',
				action: 'Update a task',
			},
		],
		default: 'create',
	},
];

export const taskFields: INodeProperties[] = [
	// ----------------------------------
	//         task:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['task'],
			},
		},
		default: '',
		required: true,
		description: 'Name of the task',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['task'],
			},
		},
		default: {},
		options: [
			taskFieldDefinitions.taskType,
			taskFieldDefinitions.dueType,
			{
				...taskFieldDefinitions.dueDate,
				displayOptions: {
					show: {
						'due_type_id': [998],
					},
				},
			},
			{
				...taskFieldDefinitions.dueDateEnd,
				displayOptions: {
					show: {
						'due_type_id': [998],
					},
				},
			},
			taskFieldDefinitions.done,
			taskFieldDefinitions.comment,
			taskFieldDefinitions.contactId,
			taskFieldDefinitions.dealId,
			taskFieldDefinitions.userId,
			taskFieldDefinitions.teamId,
			taskFieldDefinitions.tags,
		],
	},

	// ----------------------------------
	//         task:delete
	// ----------------------------------
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['task'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the task to delete',
	},

	// ----------------------------------
	//         task:get
	// ----------------------------------
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['task'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the task to retrieve',
	},

	// ----------------------------------
	//         task:getMany
	// ----------------------------------
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['task'],
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
				resource: ['task'],
			},
		},
		default: {},
		options: [
			{
				...taskFieldDefinitions.contactId,
				description: 'Filter by contact ID',
			},
			{
				displayName: 'Creator ID',
				name: 'creator_id',
				type: 'number',
				default: '',
				description: 'Filter by creator user ID',
			},
			{
				...taskFieldDefinitions.dealId,
				description: 'Filter by deal ID',
			},
			{
				displayName: 'Done',
				name: 'done',
				type: 'options',
				options: [
					{
						name: 'True',
						value: 'true',
					},
					{
						name: 'False',
						value: 'false',
					},
				],
				default: 'true',
				description: 'Filter by completion status',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by task name (partial match)',
			},
			{
				...taskFieldDefinitions.tags,
				description: 'Filter by tags (comma-separated)',
			},
			{
				...taskFieldDefinitions.taskType,
				description: 'Filter by task type',
			},
			{
				...taskFieldDefinitions.teamId,
				description: 'Filter by team ID',
			},
			{
				...taskFieldDefinitions.userId,
				description: 'Filter by user ID',
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
				resource: ['task'],
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
						name: 'Completed At',
						value: 'completed_at',
					},
					{
						name: 'Created At',
						value: 'created_at',
					},
					{
						name: 'Due Date',
						value: 'due_date',
					},
					{
						name: 'Updated At',
						value: 'updated_at',
					},
				],
				default: 'updated_at',
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
	//         task:update
	// ----------------------------------
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['task'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the task to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['task'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the task',
			},
			taskFieldDefinitions.taskType,
			taskFieldDefinitions.dueType,
			{
				...taskFieldDefinitions.dueDate,
				displayOptions: {
					show: {
						'due_type_id': [998],
					},
				},
			},
			{
				...taskFieldDefinitions.dueDateEnd,
				displayOptions: {
					show: {
						'due_type_id': [998],
					},
				},
			},
			taskFieldDefinitions.done,
			taskFieldDefinitions.comment,
			taskFieldDefinitions.contactId,
			taskFieldDefinitions.dealId,
			taskFieldDefinitions.userId,
			taskFieldDefinitions.teamId,
			taskFieldDefinitions.tags,
		],
	},
];
