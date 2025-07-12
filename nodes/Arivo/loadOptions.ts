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
