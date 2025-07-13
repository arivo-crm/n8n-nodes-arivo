import {
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { arivoApiRequest } from './GenericFunctions';

async function getCustomFields(this: ILoadOptionsFunctions, fieldType: string): Promise<INodePropertyOptions[]> {
    const endpoint = `/custom_fields/${fieldType}`;
    const responseData = await arivoApiRequest.call(this, 'GET', endpoint);

    if (responseData === undefined) {
        throw new NodeOperationError(this.getNode(), 'No data got returned');
    }

    const returnData: INodePropertyOptions[] = [];
    
    // The response is an object with field keys as properties
    // Each property contains the field metadata
    for (const [fieldKey, fieldData] of Object.entries(responseData)) {
        const field = fieldData as { label: string; field_type: string };
        returnData.push({
            name: field.label || fieldKey,
            value: fieldKey,
        });
    }
    
    return returnData;
}

export async function getPersonCustomFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    return getCustomFields.call(this, 'person');
}

export async function getCompanyCustomFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    return getCustomFields.call(this, 'company');
}

export async function getDealCustomFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    return getCustomFields.call(this, 'deal');
}

export async function getTaskTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    const responseData = await arivoApiRequest.call(this, 'GET', '/task_types');

    if (responseData === undefined) {
        throw new NodeOperationError(this.getNode(), 'No data got returned');
    }

    const returnData: INodePropertyOptions[] = [];
    
    // The response is an array of task types
    if (Array.isArray(responseData)) {
        for (const taskType of responseData) {
            const type = taskType as { id: number; label: string };
            returnData.push({
                name: type.label,
                value: type.id,
            });
        }
    }
    
    return returnData;
}
