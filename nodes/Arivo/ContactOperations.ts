import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { arivoApiRequest, arivoApiRequestAllItems } from './GenericFunctions';

function buildCommonContactBody(body: IDataObject, fields: IDataObject): IDataObject {
	// Handle emails
	if (fields.email && Array.isArray((fields.email as any).email)) {
		body.emails = (fields.email as any).email
			.filter((e: any) => !!e && !!e.address);
		delete body.email;
	}

	// Handle phones
	if (fields.phone && Array.isArray((fields.phone as any).phone)) {
		body.phones = (fields.phone as any).phone
			.filter((p: any) => !!p && !!p.number);
		delete body.phone;
	}

	// Handle addresses
	if (fields.address && Array.isArray((fields.address as any).address)) {
		body.addresses = (fields.address as any).address
			.filter((a: any) => !!a && !!a.street);
		delete body.address;
	}

	// Handle custom fields
	if (fields.customFieldsUi && (fields.customFieldsUi as any).customFieldsValues) {
		const customFields = (fields.customFieldsUi as any).customFieldsValues as IDataObject[];
		if (Array.isArray(customFields)) {
			body.custom_fields = {};
			customFields
				.filter((field: any) => !!field.field && !!field.value)
				.forEach((field: any) => {
					(body.custom_fields as any)[field.field] = field.value;
				});
		}
		delete body.customFieldsUi;
	}
	return body;
}

export async function createContact(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactName = this.getNodeParameter('contactName', index) as string;
	const contactType = this.getNodeParameter('contact_type', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		name: contactName,
		contact_type: contactType,
		...additionalFields,
	};

	buildCommonContactBody(body, additionalFields);

	return await arivoApiRequest.call(this, 'POST', '/contacts', body);
}

export async function deleteContact(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactId = this.getNodeParameter('contactId', index) as string;

	return await arivoApiRequest.call(this, 'DELETE', `/contacts/${contactId}`);
}

export async function getContact(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactId = this.getNodeParameter('contactId', index) as string;

	return await arivoApiRequest.call(this, 'GET', `/contacts/${contactId}`);
}

export async function getContacts(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject[]> {
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const query: IDataObject = {};
	
	// Add all additional fields to query if they have values
	Object.keys(additionalFields).forEach(key => {
		if (additionalFields[key] !== undefined && additionalFields[key] !== '') {
			query[key] = additionalFields[key];
		}
	});

	// Always use arivoApiRequestAllItems to handle pagination properly
	// The function will internally check returnAll and limit parameters
	return await arivoApiRequestAllItems.call(this, 'GET', '/contacts', {}, query);
}

export async function updateContact(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const contactId = this.getNodeParameter('contactId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	// Handle the updateContactName if it exists
	if (updateFields.updateContactName) {
		body.name = updateFields.updateContactName;
		delete body.updateContactName;
	}

	// Handle the updateContactType if it exists
	if (updateFields.updateContactType) {
		body.contact_type = updateFields.updateContactType;
		delete body.updateContactType;
	}

	buildCommonContactBody(body, updateFields);

	return await arivoApiRequest.call(this, 'PUT', `/contacts/${contactId}`, body);
} 