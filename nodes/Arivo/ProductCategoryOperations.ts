import { IExecuteFunctions } from 'n8n-workflow';
import { IDataObject } from 'n8n-workflow';
import { arivoApiRequest, arivoApiRequestAllItems } from './GenericFunctions';

export async function createProductCategory(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const categoryName = this.getNodeParameter('categoryName', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		name: categoryName,
		...additionalFields,
	};

	return await arivoApiRequest.call(this, 'POST', '/product_categories', body);
}

export async function deleteProductCategory(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const categoryId = this.getNodeParameter('categoryId', index) as string;

	return await arivoApiRequest.call(this, 'DELETE', `/product_categories/${categoryId}`);
}

export async function getProductCategory(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const categoryId = this.getNodeParameter('categoryId', index) as string;

	return await arivoApiRequest.call(this, 'GET', `/product_categories/${categoryId}`);
}

export async function getProductCategories(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject[]> {
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	const query: IDataObject = {};

	// Add filters to query if they have values
	if (filters) {
		Object.keys(filters).forEach(key => {
			const value = filters[key];
			if (value !== undefined && value !== '' && value !== null) {
				query[key] = value;
			}
		});
	}

	// Add sorting options
	if (options && options.sort_field) {
		query.sort_field = options.sort_field;
	}
	if (options && options.sort_order) {
		query.sort_order = options.sort_order;
	}

	// Always use arivoApiRequestAllItems to handle pagination properly
	// The function will internally check returnAll and limit parameters
	return await arivoApiRequestAllItems.call(this, 'GET', '/product_categories', {}, query);
}

export async function updateProductCategory(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const categoryId = this.getNodeParameter('categoryId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	return await arivoApiRequest.call(this, 'PUT', `/product_categories/${categoryId}`, body);
}
