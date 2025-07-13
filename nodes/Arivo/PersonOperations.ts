import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { arivoApiRequest, arivoApiRequestAllItems } from './GenericFunctions';

function buildCommonPersonBody(body: IDataObject, fields: IDataObject): IDataObject {
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

export async function createPerson(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const personName = this.getNodeParameter('personName', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		name: personName,
		contact_type: 'person', // Hard-coded for person type
		...additionalFields,
	};

	buildCommonPersonBody(body, additionalFields);

	return await arivoApiRequest.call(this, 'POST', '/contacts', body);
}

export async function deletePerson(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const personId = this.getNodeParameter('personId', index) as string;

	return await arivoApiRequest.call(this, 'DELETE', `/contacts/${personId}`);
}

export async function getPerson(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const personId = this.getNodeParameter('personId', index) as string;

	return await arivoApiRequest.call(this, 'GET', `/contacts/${personId}`);
}

export async function getPersons(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject[]> {
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const query: IDataObject = {
		contact_type: 'person', // Automatically filter for person contacts only
	};
	
	// Add all additional fields to query if they have values
	Object.keys(additionalFields).forEach(key => {
		const value = additionalFields[key];
		if (value !== undefined && value !== '' && value !== null) {
			query[key] = value;
		}
	});

	// Always use arivoApiRequestAllItems to handle pagination properly
	// The function will internally check returnAll and limit parameters
	return await arivoApiRequestAllItems.call(this, 'GET', '/contacts', {}, query);
}

export async function updatePerson(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const personId = this.getNodeParameter('personId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const body: IDataObject = {
		contact_type: 'person', // Ensure we maintain person type
		...updateFields,
	};

	// Handle the updatePersonName if it exists
	if (updateFields.updatePersonName) {
		body.name = updateFields.updatePersonName;
		delete body.updatePersonName;
	}

	buildCommonPersonBody(body, updateFields);

	return await arivoApiRequest.call(this, 'PUT', `/contacts/${personId}`, body);
} 