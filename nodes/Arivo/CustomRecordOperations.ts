import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { arivoApiRequest, arivoApiRequestAllItems } from './GenericFunctions';

function buildCommonCustomRecordBody(body: IDataObject, fields: IDataObject): IDataObject {
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

export async function createCustomRecord(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const definitionId = this.getNodeParameter('customRecordDefinitionId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		...additionalFields,
	};

	buildCommonCustomRecordBody(body, additionalFields);

	const endpoint = `/custom_record_definitions/${definitionId}/custom_records`;
	return await arivoApiRequest.call(this, 'POST', endpoint, body);
}

export async function deleteCustomRecord(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const definitionId = this.getNodeParameter('customRecordDefinitionId', index) as string;
	const customRecordId = this.getNodeParameter('customRecordId', index) as string;

	const endpoint = `/custom_record_definitions/${definitionId}/custom_records/${customRecordId}`;
	return await arivoApiRequest.call(this, 'DELETE', endpoint);
}

export async function getCustomRecord(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const definitionId = this.getNodeParameter('customRecordDefinitionId', index) as string;
	const customRecordId = this.getNodeParameter('customRecordId', index) as string;

	const endpoint = `/custom_record_definitions/${definitionId}/custom_records/${customRecordId}`;
	return await arivoApiRequest.call(this, 'GET', endpoint);
}

export async function getCustomRecords(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject[]> {
	const definitionId = this.getNodeParameter('customRecordDefinitionId', index) as string;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	const query: IDataObject = {};
	
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

	const endpoint = `/custom_record_definitions/${definitionId}/custom_records`;
	
	// Always use arivoApiRequestAllItems to handle pagination properly
	// The function will internally check returnAll and limit parameters
	return await arivoApiRequestAllItems.call(this, 'GET', endpoint, {}, query);
}

export async function updateCustomRecord(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const definitionId = this.getNodeParameter('customRecordDefinitionId', index) as string;
	const customRecordId = this.getNodeParameter('customRecordId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	buildCommonCustomRecordBody(body, updateFields);

	const endpoint = `/custom_record_definitions/${definitionId}/custom_records/${customRecordId}`;
	return await arivoApiRequest.call(this, 'PUT', endpoint, body);
}