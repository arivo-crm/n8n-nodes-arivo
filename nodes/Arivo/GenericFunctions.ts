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
	option: IDataObject = {},
): Promise<any> {
	const baseUrl = (globalThis as any).process?.env?.ARIVO_BASE_URL || 'https://arivo.com.br/api/v2';
	
	const options: IHttpRequestOptions = {
		method,
		body,
		qs: query,
		url: `${baseUrl}${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
		},
		json: true,
	};

	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	try {
		const response = await this.helpers.requestWithAuthentication.call(this, 'arivoApi', options);
		return response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an API request to paginated Arivo endpoint
 * and return all results
 * 
 * This function implements link-based pagination as specified in the Arivo API documentation.
 * The next page URL is provided in the X-Next-Page header, not by incrementing page parameters.
 * 
 * The function will:
 * 1. Make requests and check for X-Next-Page header
 * 2. Continue fetching pages using the next page URL until no more pages
 * 3. Respect the user's returnAll and limit settings
 * 4. Handle different response formats (array, data property, items property)
 * 5. Provide detailed logging for debugging
 * 
 * @param method - HTTP method to use
 * @param endpoint - API endpoint to call
 * @param body - Request body (for POST/PUT requests)
 * @param query - Query parameters (will be merged with pagination params)
 * @returns Array of all items from all pages
 */
export async function arivoApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<any> {
	const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	
	// Only try to get limit parameter if returnAll is false
	let limit: number | undefined;
	if (!returnAll) {
		try {
			limit = this.getNodeParameter('limit', 0) as number;
		} catch (error) {
			// If limit parameter is not available, default to 100
			limit = 100;
		}
	}

	const items: any[] = [];
	let currentUrl = endpoint;
	let pageCount = 0;

	do {
		pageCount++;
		
		const response = await arivoApiRequest.call(this, method, currentUrl, body, pageCount === 1 ? query : {}, { resolveWithFullResponse: true });
		
		// Extract data from response
		let responseData: any;
		if (response.body) {
			responseData = response.body;
		} else {
			responseData = response;
		}
		
		// Handle different response formats
		let newItems: any[] = [];
		if (Array.isArray(responseData)) {
			newItems = responseData;
		} else if (responseData.data && Array.isArray(responseData.data)) {
			newItems = responseData.data;
		} else if (responseData.items && Array.isArray(responseData.items)) {
			newItems = responseData.items;
		} else {
			// If response is not an array, assume it's a single item or object
			newItems = [responseData];
		}

		items.push(...newItems);

		// Check if we've reached the user-specified limit
		if (!returnAll && limit && items.length >= limit) {
			return items.slice(0, limit);
		}

		// Check for next page URL in headers
		const headers = response.headers || {};
		const nextPageUrl = headers['x-next-page'];
		
		if (!nextPageUrl) {
			break;
		}

		// Extract the path from the full URL for the next request
		// Remove the base URL to get just the path and query string
		const baseUrl = (globalThis as any).process?.env?.ARIVO_BASE_URL || 'https://arivo.com.br/api/v2';
		currentUrl = nextPageUrl.replace(baseUrl, '');

		// Note: Rate limiting can be handled by the API itself
	} while (true);

	return items;
} 