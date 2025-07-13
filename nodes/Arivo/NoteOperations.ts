import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { arivoApiRequest, arivoApiRequestAllItems } from './GenericFunctions';

export async function createNote(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const text = this.getNodeParameter('text', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		text,
		...additionalFields,
	};

	return await arivoApiRequest.call(this, 'POST', '/notes', body);
}

export async function deleteNote(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const noteId = this.getNodeParameter('noteId', index) as string;

	return await arivoApiRequest.call(this, 'DELETE', `/notes/${noteId}`);
}

export async function getNote(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const noteId = this.getNodeParameter('noteId', index) as string;

	return await arivoApiRequest.call(this, 'GET', `/notes/${noteId}`);
}

export async function getNotes(
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
	return await arivoApiRequestAllItems.call(this, 'GET', '/notes', {}, query);
}

export async function updateNote(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const noteId = this.getNodeParameter('noteId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	// Handle the updateText if it exists
	if (updateFields.updateText) {
		body.text = updateFields.updateText;
		delete body.updateText;
	}

	return await arivoApiRequest.call(this, 'PUT', `/notes/${noteId}`, body);
}