import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { arivoApiRequest, arivoApiRequestAllItems } from './GenericFunctions';

export async function createAddress(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactId = this.getNodeParameter('contactId', index) as string;
	const addressFields = this.getNodeParameter('addressFields', index, {}) as IDataObject;

	const body: IDataObject = {
		...addressFields,
	};

	return await arivoApiRequest.call(this, 'POST', `/contacts/${contactId}/addresses`, body);
}

export async function deleteAddress(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactId = this.getNodeParameter('contactId', index) as string;
	const addressId = this.getNodeParameter('addressId', index) as string;

	return await arivoApiRequest.call(this, 'DELETE', `/contacts/${contactId}/addresses/${addressId}`);
}

export async function getAddress(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactId = this.getNodeParameter('contactId', index) as string;
	const addressId = this.getNodeParameter('addressId', index) as string;

	return await arivoApiRequest.call(this, 'GET', `/contacts/${contactId}/addresses/${addressId}`);
}

export async function updateAddress(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactId = this.getNodeParameter('contactId', index) as string;
	const addressId = this.getNodeParameter('addressId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	return await arivoApiRequest.call(this, 'PUT', `/contacts/${contactId}/addresses/${addressId}`, body);
}

export async function getAddresses(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject[]> {
	const contactId = this.getNodeParameter('contactId', index) as string;
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

	// Add options to query if they have values
	Object.keys(options).forEach(key => {
		const value = options[key];
		if (value !== undefined && value !== '' && value !== null) {
			query[key] = value;
		}
	});

	// Use arivoApiRequestAllItems to handle pagination properly
	// The function will internally check returnAll and limit parameters
	return await arivoApiRequestAllItems.call(this, 'GET', `/contacts/${contactId}/addresses`, {}, query);
}