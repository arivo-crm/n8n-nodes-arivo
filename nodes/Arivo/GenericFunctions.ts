import type {
	JsonObject,
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

/**
 * Make an API request to Arivo
 */
export async function arivoApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<any> {
	const options: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method,
		qs: query,
		url: `https://arivo.com.br/api/v2${endpoint}`,
		json: true,
	};

	if (Object.keys(body).length !== 0) {
		options.body = body;
	}

	try {
		const responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'arivoApi',
			options,
		);

		if (responseData.success === false) {
			throw new NodeApiError(this.getNode(), responseData as JsonObject);
		}

		return responseData;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an API request to paginated Arivo endpoint
 * and return all results
 */
export async function arivoApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<any> {
	if (query === undefined) {
		query = {};
	}
	query.limit = 100;
	query.offset = 0;

	const returnData: IDataObject[] = [];

	let responseData;

	do {
		responseData = await arivoApiRequest.call(this, method, endpoint, body, query);
		returnData.push.apply(returnData, responseData.data as IDataObject[]);
		query.offset = responseData.meta.next_offset;
	} while (responseData.meta.has_more === true);

	return {
		data: returnData,
	};
} 