import { INodeProperties } from 'n8n-workflow';

// Deal Item-specific field definitions
const dealItemFieldDefinitions = {
	name: {
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Name of the deal item',
	} as INodeProperties,
	deal_id: {
		displayName: 'Deal ID',
		name: 'deal_id',
		type: 'string',
		default: '',
		description: 'ID of the deal this item belongs to',
	} as INodeProperties,
	product_id: {
		displayName: 'Product Name or ID',
		name: 'product_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getProducts',
		},
		default: '',
		description: 'Product associated with this deal item. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	} as INodeProperties,
	price: {
		displayName: 'Price',
		name: 'price',
		type: 'number',
		default: 0,
		description: 'Unit price of the item',
	} as INodeProperties,
	quantity: {
		displayName: 'Quantity',
		name: 'quantity',
		type: 'number',
		default: 1,
		description: 'Quantity of the item',
	} as INodeProperties,
	discount: {
		displayName: 'Discount',
		name: 'discount',
		type: 'number',
		default: 0,
		description: 'Discount amount or percentage',
	} as INodeProperties,
	total_price: {
		displayName: 'Total Price',
		name: 'total_price',
		type: 'number',
		default: 0,
		description: 'Total price after quantity and discount calculations',
	} as INodeProperties,
};

export const dealItemOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['dealItem'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new deal item',
				action: 'Create a deal item',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a deal item',
				action: 'Delete a deal item',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a deal item',
				action: 'Get a deal item',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many deal items',
				action: 'Get many deal items',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a deal item',
				action: 'Update a deal item',
			},
		],
		default: 'create',
	},
];

export const dealItemFields: INodeProperties[] = [
	// ----------------------------------
	//       dealItem:create
	// ----------------------------------
	{
		displayName: 'Deal ID',
		name: 'dealId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['dealItem'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the deal to add this item to',
	},
	{
		displayName: 'Item Name',
		name: 'itemName',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['dealItem'],
			},
		},
		default: '',
		required: true,
		description: 'Name of the deal item',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['dealItem'],
			},
		},
		default: {},
		options: [
			{
				...dealItemFieldDefinitions.discount,
				required: false,
			},
			{
				...dealItemFieldDefinitions.price,
				required: false,
			},
			{
				...dealItemFieldDefinitions.product_id,
				required: false,
			},
			{
				...dealItemFieldDefinitions.quantity,
				required: false,
			},
		],
	},

	// ----------------------------------
	//       dealItem:delete
	// ----------------------------------
	{
		displayName: 'Deal ID',
		name: 'dealId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['dealItem'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the deal',
	},
	{
		displayName: 'Item ID',
		name: 'itemId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['dealItem'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the deal item to delete',
	},

	// ----------------------------------
	//       dealItem:get
	// ----------------------------------
	{
		displayName: 'Deal ID',
		name: 'dealId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['dealItem'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the deal',
	},
	{
		displayName: 'Item ID',
		name: 'itemId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['dealItem'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the deal item to retrieve',
	},

	// ----------------------------------
	//       dealItem:getMany
	// ----------------------------------
	{
		displayName: 'Deal ID',
		name: 'dealId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['dealItem'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the deal to get items from',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: ['dealItem'],
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
				resource: ['dealItem'],
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
				resource: ['dealItem'],
			},
		},
		default: {},
		options: [
			{
				...dealItemFieldDefinitions.name,
				displayName: 'Name',
				description: 'Filter by item name (partial match supported)',
			},
			{
				...dealItemFieldDefinitions.product_id,
				displayName: 'Product ID',
				description: 'Filter by product ID',
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
				resource: ['dealItem'],
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
						name: 'Quantity',
						value: 'quantity',
					},
					{
						name: 'Total Price',
						value: 'total_price',
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
	//       dealItem:update
	// ----------------------------------
	{
		displayName: 'Deal ID',
		name: 'dealId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['dealItem'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the deal',
	},
	{
		displayName: 'Item ID',
		name: 'itemId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['dealItem'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the deal item to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['dealItem'],
			},
		},
		default: {},
		options: [
			{
				...dealItemFieldDefinitions.discount,
				required: false,
			},
			{
				...dealItemFieldDefinitions.name,
				required: false,
			},
			{
				...dealItemFieldDefinitions.price,
				required: false,
			},
			{
				...dealItemFieldDefinitions.product_id,
				required: false,
			},
			{
				...dealItemFieldDefinitions.quantity,
				required: false,
			},
		],
	},
];
