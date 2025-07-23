import { INodeProperties } from 'n8n-workflow';

// Product-specific field definitions
const productFieldDefinitions = {
	name: {
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Name of the product',
	} as INodeProperties,
	code: {
		displayName: 'Code',
		name: 'code',
		type: 'string',
		default: '',
		description: 'External product code for system identification',
	} as INodeProperties,
	description: {
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		default: '',
		description: 'Description of the product',
	} as INodeProperties,
	price: {
		displayName: 'Price',
		name: 'price',
		type: 'number',
		default: 0,
		description: 'Catalog price per unit of the product',
	} as INodeProperties,
	available: {
		displayName: 'Available',
		name: 'available',
		type: 'boolean',
		default: true,
		description: 'Whether the product is available in catalog',
	} as INodeProperties,
	productCategoryId: {
		displayName: 'Product Category Name or ID',
		name: 'product_category_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getProductCategories',
		},
		default: '',
		description: 'Category for this product. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	} as INodeProperties,
	tags: {
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: '',
		description: 'Comma-separated tags for the product. Tags cannot contain spaces or commas and are stored in lowercase.',
	} as INodeProperties,
};

export const productOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['product'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a product',
				action: 'Create a product',
			},
			{
				name: 'Create or Update',
				value: 'createOrUpdate',
				description: 'Create a new product, or update the current one if it already exists (upsert)',
				action: 'Create or update a product',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a product permanently',
				action: 'Delete a product',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a product',
				action: 'Get a product',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Retrieve a list of products',
				action: 'Get many products',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a product',
				action: 'Update a product',
			},
		],
		default: 'create',
	},
];

export const productFields: INodeProperties[] = [
	// ----------------------------------
	//         product:create
	// ----------------------------------
	{
		displayName: 'Product Name',
		name: 'productName',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['product'],
			},
		},
		default: '',
		required: true,
		description: 'The name of the product',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['product'],
			},
		},
		default: {},
		options: [
			productFieldDefinitions.code,
			productFieldDefinitions.description,
			productFieldDefinitions.price,
			productFieldDefinitions.available,
			productFieldDefinitions.productCategoryId,
			productFieldDefinitions.tags,
		],
	},

	// ----------------------------------
	//         product:createOrUpdate
	// ----------------------------------
	{
		displayName: 'Product Name',
		name: 'productName',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['createOrUpdate'],
				resource: ['product'],
			},
		},
		default: '',
		required: true,
		description: 'The name of the product',
	},
	{
		displayName: 'Field to Match On',
		name: 'matchField',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['createOrUpdate'],
				resource: ['product'],
			},
		},
		options: [
			{
				name: 'Name',
				value: 'name',
				description: 'Match products by name',
			},
			{
				name: 'Code',
				value: 'code',
				description: 'Match products by external product code',
			},
		],
		default: 'name',
		description: 'The field to use for finding existing products to update',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['createOrUpdate'],
				resource: ['product'],
			},
		},
		default: {},
		options: [
			productFieldDefinitions.code,
			productFieldDefinitions.description,
			productFieldDefinitions.price,
			productFieldDefinitions.available,
			productFieldDefinitions.productCategoryId,
			productFieldDefinitions.tags,
		],
	},

	// ----------------------------------
	//         product:delete
	// ----------------------------------
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['product'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the product to delete',
	},

	// ----------------------------------
	//         product:get
	// ----------------------------------
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['product'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the product to retrieve',
	},

	// ----------------------------------
	//         product:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['product'],
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
				resource: ['product'],
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
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['product'],
			},
		},
		default: {},
		options: [
			{
				...productFieldDefinitions.available,
				displayName: 'Available',
				description: 'Filter by product availability',
			},
			{
				...productFieldDefinitions.code,
				displayName: 'Code',
				description: 'Filter by external product code',
			},
			{
				...productFieldDefinitions.name,
				displayName: 'Name',
				description: 'Filter by product name (partial match supported)',
			},
			{
				...productFieldDefinitions.productCategoryId,
				displayName: 'Product Category ID',
				description: 'Filter by product category ID',
			},
			{
				...productFieldDefinitions.tags,
				displayName: 'Tags',
				description: 'Filter by tags (comma-separated for multiple tags)',
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
				resource: ['product'],
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
						name: 'Price',
						value: 'price',
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
	//         product:update
	// ----------------------------------
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['product'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the product to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['product'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Product Name',
				name: 'updateProductName',
				type: 'string',
				default: '',
				description: 'The name of the product',
			},
			productFieldDefinitions.code,
			productFieldDefinitions.description,
			productFieldDefinitions.price,
			productFieldDefinitions.available,
			productFieldDefinitions.productCategoryId,
			productFieldDefinitions.tags,
		],
	},
];
