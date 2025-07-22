import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { arivoApiRequest, arivoApiRequestAllItems } from './GenericFunctions';

export async function getFile(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const fileId = this.getNodeParameter('fileId', index) as string;

	return await arivoApiRequest.call(this, 'GET', `/attachment_files/${fileId}`);
}

export async function deleteFile(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const fileId = this.getNodeParameter('fileId', index) as string;

	await arivoApiRequest.call(this, 'DELETE', `/attachment_files/${fileId}`);
	return { deleted: true };
}

export async function getFiles(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
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

	if (returnAll) {
		return await arivoApiRequestAllItems.call(this, 'GET', '/attachment_files', {}, query);
	} else {
		const limit = this.getNodeParameter('limit', index, 20) as number;
		query.per_page = limit;
		const response = await arivoApiRequest.call(this, 'GET', '/attachment_files', {}, query);
		return Array.isArray(response) ? response : [response];
	}
}
