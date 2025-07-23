import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { arivoApiRequest, arivoApiRequestAllItems } from './GenericFunctions';

function buildCommonCompanyBody(body: IDataObject, fields: IDataObject): IDataObject {
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

export async function createCompany(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const companyName = this.getNodeParameter('companyName', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		name: companyName,
		contact_type: 'company', // Hard-coded for company type
		...additionalFields,
	};

	buildCommonCompanyBody(body, additionalFields);

	return await arivoApiRequest.call(this, 'POST', '/contacts', body);
}

export async function createOrUpdateCompany(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const companyName = this.getNodeParameter('companyName', index) as string;
	const matchField = this.getNodeParameter('matchField', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		name: companyName,
		contact_type: 'company',
		...additionalFields,
	};

	buildCommonCompanyBody(body, additionalFields);

	// Search for existing company by the selected field
	let existingCompany: IDataObject | null = null;
	let searchValue: string | undefined;

	// Determine the search value based on the selected match field
	if (matchField === 'name') {
		searchValue = companyName;
	} else if (matchField === 'email') {
		// Get the first email address from the emails array
		if (body.emails && Array.isArray(body.emails) && body.emails.length > 0) {
			const firstEmail = body.emails[0];
			if (firstEmail && firstEmail.address) {
				searchValue = firstEmail.address;
			}
		}
	} else if (matchField === 'cnpj') {
		searchValue = body.cnpj as string;
	}

	// Only search if we have a value to search for
	if (searchValue) {
		try {
			const searchQuery: IDataObject = { contact_type: 'company' };
			searchQuery[matchField] = searchValue;
			
			const searchResults = await arivoApiRequestAllItems.call(this, 'GET', '/contacts', {}, searchQuery);
			if (searchResults && searchResults.length > 0) {
				existingCompany = searchResults[0];
			}
		} catch (error) {
			// If search fails, continue with creating new company
		}
	}

	if (existingCompany) {
		// Update existing company
		const companyId = existingCompany.id as string;
		const updatedCompany = await arivoApiRequest.call(this, 'PUT', `/contacts/${companyId}`, body);
		return {
			...updatedCompany,
			__n8n_operation: 'updated',
		};
	} else {
		// Create new company
		const newCompany = await arivoApiRequest.call(this, 'POST', '/contacts', body);
		return {
			...newCompany,
			__n8n_operation: 'created',
		};
	}
}

export async function deleteCompany(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const companyId = this.getNodeParameter('companyId', index) as string;

	await arivoApiRequest.call(this, 'DELETE', `/contacts/${companyId}`);
	return { deleted: true };
}

export async function getCompany(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const companyId = this.getNodeParameter('companyId', index) as string;

	return await arivoApiRequest.call(this, 'GET', `/contacts/${companyId}`);
}

export async function getCompanies(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject[]> {
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	const query: IDataObject = {
		contact_type: 'company', // Automatically filter for company contacts only
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

export async function updateCompany(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const companyId = this.getNodeParameter('companyId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const body: IDataObject = {
		contact_type: 'company', // Ensure we maintain company type
		...updateFields,
	};

	// Handle the updateCompanyName if it exists
	if (updateFields.updateCompanyName) {
		body.name = updateFields.updateCompanyName;
		delete body.updateCompanyName;
	}

	buildCommonCompanyBody(body, updateFields);

	return await arivoApiRequest.call(this, 'PUT', `/contacts/${companyId}`, body);
}
