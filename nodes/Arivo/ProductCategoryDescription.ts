import { INodeProperties } from 'n8n-workflow';

// Product Category-specific field definitions
const productCategoryFieldDefinitions = {
	name: {
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Name of the product category',
	} as INodeProperties,
	code: {
		displayName: 'Code',
		name: 'code',
		type: 'string',
		default: '',
		description: 'External code for system identification',
	} as INodeProperties,
};

export const productCategoryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['productCategory'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new product category',
				action: 'Create a product category',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a product category',
				action: 'Delete a product category',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a product category',
				action: 'Get a product category',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many product categories',
				action: 'Get many product categories',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a product category',
				action: 'Update a product category',
			},
		],
		default: 'create',
	},
];

export const productCategoryFields: INodeProperties[] = [
	// ----------------------------------
	//       productCategory:create
	// ----------------------------------
	{
		displayName: 'Category Name',
		name: 'categoryName',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['productCategory'],
			},
		},
		default: '',
		required: true,
		description: 'Name of the product category',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['productCategory'],
			},
		},
		default: {},
		options: [
			{
				...productCategoryFieldDefinitions.code,
				required: false,
			},
		],
	},

	// ----------------------------------
	//       productCategory:delete
	// ----------------------------------
	{
		displayName: 'Category ID',
		name: 'categoryId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['productCategory'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the product category to delete',
	},

	// ----------------------------------
	//       productCategory:get
	// ----------------------------------
	{
		displayName: 'Category ID',
		name: 'categoryId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['productCategory'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the product category to retrieve',
	},

	// ----------------------------------
	//       productCategory:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['productCategory'],
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
				resource: ['productCategory'],
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
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['productCategory'],
			},
		},
		default: {},
		options: [
			{
				...productCategoryFieldDefinitions.code,
				displayName: 'Code',
				description: 'Filter by category code',
			},
			{
				...productCategoryFieldDefinitions.name,
				displayName: 'Name',
				description: 'Filter by category name (partial match supported)',
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
				resource: ['productCategory'],
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
						name: 'Code',
						value: 'code',
					},
					{
						name: 'Created At',
						value: 'created_at',
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
	//       productCategory:update
	// ----------------------------------
	{
		displayName: 'Category ID',
		name: 'categoryId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['productCategory'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the product category to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['productCategory'],
			},
		},
		default: {},
		options: [
			{
				...productCategoryFieldDefinitions.code,
				required: false,
			},
			{
				...productCategoryFieldDefinitions.name,
				required: false,
			},
		],
	},
];