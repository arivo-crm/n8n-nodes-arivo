import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { arivoApiRequest, arivoApiRequestAllItems } from './GenericFunctions';

export async function createPhone(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactId = this.getNodeParameter('contactId', index) as string;
	const number = this.getNodeParameter('number', index) as string;
	const phone_type = this.getNodeParameter('phone_type', index) as string;

	const body: IDataObject = {
		number,
		phone_type,
	};

	return await arivoApiRequest.call(this, 'POST', `/contacts/${contactId}/phones`, body);
}

export async function deletePhone(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactId = this.getNodeParameter('contactId', index) as string;
	const phoneId = this.getNodeParameter('phoneId', index) as string;

	return await arivoApiRequest.call(this, 'DELETE', `/contacts/${contactId}/phones/${phoneId}`);
}

export async function getPhone(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactId = this.getNodeParameter('contactId', index) as string;
	const phoneId = this.getNodeParameter('phoneId', index) as string;

	return await arivoApiRequest.call(this, 'GET', `/contacts/${contactId}/phones/${phoneId}`);
}

export async function updatePhone(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactId = this.getNodeParameter('contactId', index) as string;
	const phoneId = this.getNodeParameter('phoneId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	return await arivoApiRequest.call(this, 'PUT', `/contacts/${contactId}/phones/${phoneId}`, body);
}

export async function getPhones(
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
	return await arivoApiRequestAllItems.call(this, 'GET', `/contacts/${contactId}/phones`, {}, query);
}
