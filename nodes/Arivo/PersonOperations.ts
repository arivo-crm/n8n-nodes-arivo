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

	// Handle tags - convert comma-separated string to array
	if (body.tags && typeof body.tags === 'string') {
		body.tags = (body.tags as string).split(',').map(tag => tag.trim()).filter(tag => tag !== '');
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

export async function createOrUpdatePerson(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const personName = this.getNodeParameter('personName', index) as string;
	const matchField = this.getNodeParameter('matchField', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		name: personName,
		contact_type: 'person',
		...additionalFields,
	};

	buildCommonPersonBody(body, additionalFields);

	// Search for existing person by the selected field
	let existingPerson: IDataObject | null = null;
	let searchValue: string | undefined;

	// Determine the search value based on the selected match field
	if (matchField === 'name') {
		searchValue = personName;
	} else if (matchField === 'email') {
		// Get the first email address from the emails array
		if (body.emails && Array.isArray(body.emails) && body.emails.length > 0) {
			const firstEmail = body.emails[0];
			if (firstEmail && firstEmail.address) {
				searchValue = firstEmail.address;
			}
		}
	} else if (matchField === 'cpf') {
		searchValue = body.cpf as string;
	} else if (matchField === 'phone') {
		// Get the first phone number from the phones array
		if (body.phones && Array.isArray(body.phones) && body.phones.length > 0) {
			const firstPhone = body.phones[0];
			if (firstPhone && firstPhone.number) {
				searchValue = firstPhone.number;
			}
		}
	}

	// Only search if we have a value to search for
	if (searchValue) {
		try {
			const searchQuery: IDataObject = { contact_type: 'person' };
			searchQuery[matchField] = searchValue;
			
			const searchResults = await arivoApiRequestAllItems.call(this, 'GET', '/contacts', {}, searchQuery);
			if (searchResults && searchResults.length > 0) {
				existingPerson = searchResults[0];
			}
		} catch (error) {
			// If search fails, continue with creating new person
		}
	}

	if (existingPerson) {
		// Update existing person
		const personId = existingPerson.id as string;
		const updatedPerson = await arivoApiRequest.call(this, 'PUT', `/contacts/${personId}`, body);
		return {
			...updatedPerson,
			__n8n_operation: 'updated',
		};
	} else {
		// Create new person
		const newPerson = await arivoApiRequest.call(this, 'POST', '/contacts', body);
		return {
			...newPerson,
			__n8n_operation: 'created',
		};
	}
}

export async function deletePerson(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const personId = this.getNodeParameter('personId', index) as string;

	await arivoApiRequest.call(this, 'DELETE', `/contacts/${personId}`);
	return { deleted: true };
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
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	const query: IDataObject = {
		contact_type: 'person', // Automatically filter for person contacts only
	};
	
	// Add all filters to query if they have values
	Object.keys(filters).forEach(key => {
		const value = filters[key];
		if (value !== undefined && value !== '' && value !== null) {
			query[key] = value;
		}
	});

	// Add all options to query if they have values
	Object.keys(options).forEach(key => {
		const value = options[key];
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
