import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { arivoApiRequest } from './GenericFunctions';

export async function createDealItem(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const dealId = this.getNodeParameter('dealId', index) as string;
	const itemName = this.getNodeParameter('itemName', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		name: itemName,
		deal_id: dealId,
		...additionalFields,
	};

	return await arivoApiRequest.call(this, 'POST', `/deals/${dealId}/quote_items`, body);
}

export async function deleteDealItem(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const dealId = this.getNodeParameter('dealId', index) as string;
	const itemId = this.getNodeParameter('itemId', index) as string;

	return await arivoApiRequest.call(this, 'DELETE', `/deals/${dealId}/quote_items/${itemId}`);
}

export async function getDealItem(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const dealId = this.getNodeParameter('dealId', index) as string;
	const itemId = this.getNodeParameter('itemId', index) as string;

	return await arivoApiRequest.call(this, 'GET', `/deals/${dealId}/quote_items/${itemId}`);
}

export async function getDealItems(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject[]> {
	const dealId = this.getNodeParameter('dealId', index) as string;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	// Get the deal data which includes quote_items
	const dealData = await arivoApiRequest.call(this, 'GET', `/deals/${dealId}`);
	
	if (!dealData || !dealData.quote_items) {
		return [];
	}

	let items = dealData.quote_items as IDataObject[];

	// Apply filters if specified
	if (filters) {
		items = items.filter((item: IDataObject) => {
			return Object.keys(filters).every(key => {
				const filterValue = filters[key];
				if (filterValue === undefined || filterValue === '' || filterValue === null) {
					return true; // Skip empty filters
				}
				
				const itemValue = item[key];
				if (typeof filterValue === 'string' && typeof itemValue === 'string') {
					// For string filters, check if the item value contains the filter value (case insensitive)
					return itemValue.toLowerCase().includes(filterValue.toLowerCase());
				}
				
				// For exact matches
				return itemValue === filterValue;
			});
		});
	}

	// Apply sorting if specified
	if (options && options.sort_field) {
		const sortField = options.sort_field as string;
		const sortOrder = (options.sort_order as string) || 'desc';
		
		items.sort((a: IDataObject, b: IDataObject) => {
			const aValue = a[sortField];
			const bValue = b[sortField];
			
			// Handle different data types
			if (typeof aValue === 'string' && typeof bValue === 'string') {
				const comparison = aValue.localeCompare(bValue);
				return sortOrder === 'asc' ? comparison : -comparison;
			}
			
			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
			}
			
			// Convert to string for comparison
			const aStr = String(aValue || '');
			const bStr = String(bValue || '');
			const comparison = aStr.localeCompare(bStr);
			return sortOrder === 'asc' ? comparison : -comparison;
		});
	}

	// Apply pagination manually since we can't use arivoApiRequestAllItems
	const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
	if (!returnAll) {
		const limit = this.getNodeParameter('limit', index, 50) as number;
		items = items.slice(0, limit);
	}

	return items;
}

export async function updateDealItem(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const dealId = this.getNodeParameter('dealId', index) as string;
	const itemId = this.getNodeParameter('itemId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	return await arivoApiRequest.call(this, 'PUT', `/deals/${dealId}/quote_items/${itemId}`, body);
}