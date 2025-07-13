import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { arivoApiRequest, arivoApiRequestAllItems } from './GenericFunctions';

export async function createTask(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		name,
		...additionalFields,
	};

	// Handle tags - convert comma-separated string to array
	if (body.tags && typeof body.tags === 'string') {
		body.tags = (body.tags as string).split(',').map(tag => tag.trim()).filter(tag => tag !== '');
	}

	// Set default due_type_id if not provided
	if (body.due_type_id === undefined) {
		body.due_type_id = 998; // Default to "with date"
	}

	// Remove due_date fields if due_type_id is 999 (no date)
	if (body.due_type_id === 999) {
		delete body.due_date;
		delete body.due_date_end;
	}

	return await arivoApiRequest.call(this, 'POST', '/tasks', body);
}

export async function deleteTask(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const taskId = this.getNodeParameter('taskId', index) as string;

	return await arivoApiRequest.call(this, 'DELETE', `/tasks/${taskId}`);
}

export async function getTask(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const taskId = this.getNodeParameter('taskId', index) as string;

	return await arivoApiRequest.call(this, 'GET', `/tasks/${taskId}`);
}

export async function getTasks(
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
	// The function will internally check limit parameters (no returnAll for tasks)
	return await arivoApiRequestAllItems.call(this, 'GET', '/tasks', {}, query);
}

export async function updateTask(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const taskId = this.getNodeParameter('taskId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const body: IDataObject = {
		...updateFields,
	};

	// Handle tags - convert comma-separated string to array
	if (body.tags && typeof body.tags === 'string') {
		body.tags = (body.tags as string).split(',').map(tag => tag.trim()).filter(tag => tag !== '');
	}

	// Remove due_date fields if due_type_id is 999 (no date)
	if (body.due_type_id === 999) {
		delete body.due_date;
		delete body.due_date_end;
	}

	return await arivoApiRequest.call(this, 'PUT', `/tasks/${taskId}`, body);
}