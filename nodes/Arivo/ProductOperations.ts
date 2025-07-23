import { IExecuteFunctions } from 'n8n-workflow';
import { IDataObject } from 'n8n-workflow';
import { arivoApiRequest, arivoApiRequestAllItems } from './GenericFunctions';

function buildCommonProductBody(body: IDataObject, fields: IDataObject): void {
	// Handle tags conversion from string to array
	if (body.tags && typeof body.tags === 'string') {
		body.tags = (body.tags as string).split(',').map(tag => tag.trim()).filter(tag => tag !== '');
	}

	// Handle price conversion to number
	if (fields.price !== undefined) {
		body.price = Number(fields.price);
	}

	// Handle available conversion to boolean
	if (fields.available !== undefined) {
		body.available = Boolean(fields.available);
	}

	// Handle product_category_id conversion to number
	if (fields.product_category_id !== undefined && fields.product_category_id !== '') {
		body.product_category_id = Number(fields.product_category_id);
	}
}

export async function createProduct(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const productName = this.getNodeParameter('productName', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		name: productName,
		...additionalFields,
	};

	buildCommonProductBody(body, additionalFields);

	return await arivoApiRequest.call(this, 'POST', '/products', body);
}

export async function createOrUpdateProduct(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const productName = this.getNodeParameter('productName', index) as string;
	const matchField = this.getNodeParameter('matchField', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		name: productName,
		...additionalFields,
	};

	buildCommonProductBody(body, additionalFields);

	// Search for existing product by the selected field
	let existingProduct: IDataObject | null = null;
	let searchValue: string | undefined;

	// Determine the search value based on the selected match field
	if (matchField === 'name') {
		searchValue = productName;
	} else if (matchField === 'code') {
		searchValue = body.code as string;
	}

	// Only search if we have a value to search for
	if (searchValue) {
		try {
			const searchQuery: IDataObject = {};
			searchQuery[matchField] = searchValue;
			
			const searchResults = await arivoApiRequestAllItems.call(this, 'GET', '/products', {}, searchQuery);
			if (searchResults && searchResults.length > 0) {
				existingProduct = searchResults[0];
			}
		} catch (error) {
			// If search fails, continue with creating new product
		}
	}

	if (existingProduct) {
		// Update existing product
		const productId = existingProduct.id as string;
		const updatedProduct = await arivoApiRequest.call(this, 'PUT', `/products/${productId}`, body);
		return {
			...updatedProduct,
			__n8n_operation: 'updated',
		};
	} else {
		// Create new product
		const newProduct = await arivoApiRequest.call(this, 'POST', '/products', body);
		return {
			...newProduct,
			__n8n_operation: 'created',
		};
	}
}

export async function deleteProduct(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const productId = this.getNodeParameter('productId', index) as string;

	await arivoApiRequest.call(this, 'DELETE', `/products/${productId}`);
	return { deleted: true };
}

export async function getProduct(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const productId = this.getNodeParameter('productId', index) as string;

	return await arivoApiRequest.call(this, 'GET', `/products/${productId}`);
}

export async function getProducts(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject[]> {
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	const query: IDataObject = {};

	// Add filters to query if they have values
	Object.keys(filters).forEach(key => {
		const value = filters[key];
		if (value !== undefined && value !== '' && value !== null) {
			query[key] = value;
		}
	});

	// Add sorting options
	if (options.sort_field) {
		query.sort_field = options.sort_field;
	}
	if (options.sort_order) {
		query.sort_order = options.sort_order;
	}

	// Always use arivoApiRequestAllItems to handle pagination properly
	// The function will internally check returnAll and limit parameters
	return await arivoApiRequestAllItems.call(this, 'GET', '/products', {}, query);
}

export async function updateProduct(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const productId = this.getNodeParameter('productId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	// Handle the updateProductName if it exists
	if (updateFields.updateProductName) {
		body.name = updateFields.updateProductName;
		delete body.updateProductName;
	}

	buildCommonProductBody(body, updateFields);

	return await arivoApiRequest.call(this, 'PUT', `/products/${productId}`, body);
}
