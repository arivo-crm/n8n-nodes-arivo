import type {
	JsonObject,
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILogger,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

interface IContextWithLogger {
	logger?: ILogger;
}

/**
 * Make an API request to Arivo
 */
export async function arivoApiRequest(
	this: (IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions) & IContextWithLogger,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
	returnFullResponse: boolean = false,
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
		returnFullResponse: returnFullResponse,
	};

	const credentials = await this.getCredentials('arivoApi');
	options.headers = {
		...options.headers,
		'Authorization': `Bearer ${credentials.apiKey}`,
	};

	try {
		if (this.logger) {
			this.logger.debug(`Request URL: ${options.url}`);
			this.logger.debug(`Request body: ${JSON.stringify(options.body)}`);
			this.logger.debug(`Request query: ${JSON.stringify(options.qs)}`);
			this.logger.debug('Request options:', options);
		}
		const response = await this.helpers.requestWithAuthentication.call(this, 'arivoApi', options);
		if (this.logger) {
			this.logger.debug('Response:', response);
		}
		return response;
	} catch (error) {
		if (this.logger) {
			this.logger.error('Error:', error);
		}
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
	this: (IHookFunctions | IExecuteFunctions) & IContextWithLogger,
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

	if (this.logger) {
		this.logger.debug(`Starting pagination for endpoint: ${endpoint}`);
		this.logger.debug(`Return all: ${returnAll}, Limit: ${limit}`);
	}

	do {
		pageCount++;
		
		if (this.logger) {
			this.logger.debug(`Fetching page ${pageCount} from: ${currentUrl}`);
		}

		const response = await arivoApiRequest.call(this, method, currentUrl, body, query, true);
		
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

		if (this.logger) {
			this.logger.debug(`Page ${pageCount} returned ${newItems.length} items`);
		}

		items.push(...newItems);

		// Check if we've reached the user-specified limit
		if (!returnAll && limit && items.length >= limit) {
			if (this.logger) {
				this.logger.debug(`Reached user limit of ${limit}, returning ${items.length} items`);
			}
			return items.slice(0, limit);
		}

		// Check for next page URL in headers
		const nextPageUrl = response.headers?.['X-Next-Page'] || response.headers?.['x-next-page'];
		
		if (!nextPageUrl) {
			if (this.logger) {
				this.logger.debug(`No X-Next-Page header found, pagination complete. Total items: ${items.length}`);
			}
			break;
		}

		// Extract the path from the full URL for the next request
		// Remove the base URL to get just the path and query string
		const baseUrl = (globalThis as any).process?.env?.ARIVO_BASE_URL || 'https://arivo.com.br/api/v2';
		currentUrl = nextPageUrl.replace(baseUrl, '');

		if (this.logger) {
			this.logger.debug(`Next page URL: ${currentUrl}`);
		}

		// Note: Rate limiting can be handled by the API itself
	} while (true);

	if (this.logger) {
		this.logger.debug(`Pagination complete. Total pages: ${pageCount}, Total items: ${items.length}`);
	}

	return items;
} 