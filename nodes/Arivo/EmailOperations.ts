import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { arivoApiRequest, arivoApiRequestAllItems } from './GenericFunctions';

export async function createEmail(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactId = this.getNodeParameter('contactId', index) as string;
	const address = this.getNodeParameter('address', index) as string;
	const email_type = this.getNodeParameter('email_type', index) as string;

	const body: IDataObject = {
		address,
		email_type,
	};

	return await arivoApiRequest.call(this, 'POST', `/contacts/${contactId}/emails`, body);
}

export async function deleteEmail(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactId = this.getNodeParameter('contactId', index) as string;
	const emailId = this.getNodeParameter('emailId', index) as string;

	return await arivoApiRequest.call(this, 'DELETE', `/contacts/${contactId}/emails/${emailId}`);
}

export async function getEmail(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactId = this.getNodeParameter('contactId', index) as string;
	const emailId = this.getNodeParameter('emailId', index) as string;

	return await arivoApiRequest.call(this, 'GET', `/contacts/${contactId}/emails/${emailId}`);
}

export async function updateEmail(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactId = this.getNodeParameter('contactId', index) as string;
	const emailId = this.getNodeParameter('emailId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	return await arivoApiRequest.call(this, 'PUT', `/contacts/${contactId}/emails/${emailId}`, body);
}

export async function getEmails(
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
	return await arivoApiRequestAllItems.call(this, 'GET', `/contacts/${contactId}/emails`, {}, query);
}