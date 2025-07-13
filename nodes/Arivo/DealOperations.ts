import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { arivoApiRequest, arivoApiRequestAllItems } from './GenericFunctions';

function buildCommonDealBody(body: IDataObject, fields: IDataObject): IDataObject {
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

export async function createDeal(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const dealName = this.getNodeParameter('dealName', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		name: dealName,
		...additionalFields,
	};

	buildCommonDealBody(body, additionalFields);

	return await arivoApiRequest.call(this, 'POST', '/deals', body);
}

export async function deleteDeal(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const dealId = this.getNodeParameter('dealId', index) as string;

	return await arivoApiRequest.call(this, 'DELETE', `/deals/${dealId}`);
}

export async function getDeal(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const dealId = this.getNodeParameter('dealId', index) as string;

	return await arivoApiRequest.call(this, 'GET', `/deals/${dealId}`);
}

export async function getDeals(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject[]> {
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const query: IDataObject = {};
	
	// Add all additional fields to query if they have values
	Object.keys(additionalFields).forEach(key => {
		const value = additionalFields[key];
		if (value !== undefined && value !== '' && value !== null) {
			query[key] = value;
		}
	});

	// Always use arivoApiRequestAllItems to handle pagination properly
	// The function will internally check returnAll and limit parameters
	return await arivoApiRequestAllItems.call(this, 'GET', '/deals', {}, query);
}

export async function updateDeal(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const dealId = this.getNodeParameter('dealId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	// Handle the updateDealName if it exists
	if (updateFields.updateDealName) {
		body.name = updateFields.updateDealName;
		delete body.updateDealName;
	}

	buildCommonDealBody(body, updateFields);

	return await arivoApiRequest.call(this, 'PUT', `/deals/${dealId}`, body);
}