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

export async function getPipelines(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    const responseData = await arivoApiRequest.call(this, 'GET', '/pipelines');

    if (!responseData) {
        throw new NodeOperationError(this.getNode(), 'No data got returned');
    }

    const returnData: INodePropertyOptions[] = [];
    
    // The response is an array of pipelines
    if (Array.isArray(responseData)) {
        for (const pipeline of responseData) {
            const pipelineData = pipeline as { id: string; name: string };
            returnData.push({
                name: pipelineData.name,
                value: pipelineData.id,
            });
        }
    }
    
    return returnData;
}

export async function getPipelineSteps(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    let pipelineId: string | undefined;
    
    // Try different parameter paths depending on where the field is located
    const possiblePaths = [
        'additionalFields.pipeline_id',  // For create operations
        'updateFields.pipeline_id',      // For update operations  
        'filters.pipeline_id',           // For getMany operations
        'pipeline_id'                    // For standalone field (if any)
    ];
    
    for (const path of possiblePaths) {
        try {
            pipelineId = this.getCurrentNodeParameter(path) as string;
            if (pipelineId) {
                break;
            }
        } catch (error) {
            // Field might not exist in this collection, try next path
            continue;
        }
    }
    
    if (!pipelineId) {
        return [];
    }

    const pipeline = await arivoApiRequest.call(this, 'GET', `/pipelines/${pipelineId}`);

    if (!pipeline || !pipeline.pipeline_steps) {
        throw new NodeOperationError(this.getNode(), 'No pipeline steps found for the selected pipeline');
    }

    const returnData: INodePropertyOptions[] = [];
    
    if (Array.isArray(pipeline.pipeline_steps)) {
        for (const step of pipeline.pipeline_steps) {
            const pipelineStep = step as { id: string; name: string };
            returnData.push({
                name: pipelineStep.name,
                value: pipelineStep.id,
            });
        }
    }
    
    return returnData;
}

export async function getDealPipelineSteps(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    let dealId: string | undefined;
    
    // Try to get the deal ID from different contexts
    const possibleDealIdPaths = [
        'dealId',                    // For update operations
        'updateFields.dealId',       // Alternative path
        'id',                        // Generic ID field
    ];
    
    for (const path of possibleDealIdPaths) {
        try {
            dealId = this.getCurrentNodeParameter(path) as string;
            if (dealId) {
                break;
            }
        } catch (error) {
            // Field might not exist in this context, try next path
            continue;
        }
    }
    
    if (!dealId) {
        return [];
    }

    // Fetch the deal to get its pipeline_id
    const deal = await arivoApiRequest.call(this, 'GET', `/deals/${dealId}`);
    
    if (!deal || !deal.pipeline_id) {
        throw new NodeOperationError(this.getNode(), 'Could not determine pipeline for this deal');
    }

    // Now fetch the pipeline steps using the deal's pipeline_id
    const pipeline = await arivoApiRequest.call(this, 'GET', `/pipelines/${deal.pipeline_id}`);

    if (!pipeline || !pipeline.pipeline_steps) {
        throw new NodeOperationError(this.getNode(), 'No pipeline steps found for the deal pipeline');
    }

    const returnData: INodePropertyOptions[] = [];
    
    if (Array.isArray(pipeline.pipeline_steps)) {
        for (const step of pipeline.pipeline_steps) {
            const pipelineStep = step as { id: string; name: string };
            returnData.push({
                name: pipelineStep.name,
                value: pipelineStep.id,
            });
        }
    }
    
    return returnData;
}

export async function getProductOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    const responseData = await arivoApiRequest.call(this, 'GET', '/products');

    if (!responseData) {
        throw new NodeOperationError(this.getNode(), 'No data got returned');
    }

    const returnData: INodePropertyOptions[] = [];
    
    // The response is an array of products
    if (Array.isArray(responseData)) {
        for (const product of responseData) {
            const productData = product as { id: string; name: string };
            returnData.push({
                name: productData.name,
                value: productData.id,
            });
        }
    }
    
    return returnData;
}

export async function getProductCategories(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    const responseData = await arivoApiRequest.call(this, 'GET', '/product_categories');

    if (!responseData) {
        throw new NodeOperationError(this.getNode(), 'No data got returned');
    }

    const returnData: INodePropertyOptions[] = [];
    
    // The response is an array of product categories
    if (Array.isArray(responseData)) {
        for (const category of responseData) {
            const categoryData = category as { id: string; name: string };
            returnData.push({
                name: categoryData.name,
                value: categoryData.id,
            });
        }
    }
    
    return returnData;
}
