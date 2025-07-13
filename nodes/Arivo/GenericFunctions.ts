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
 * Sleep for a specified number of milliseconds
 */
async function sleep(ms: number): Promise<void> {
	return new Promise(resolve => (globalThis as any).setTimeout(resolve, ms));
}


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

	let maxRetries = 3;
	let response;

	do {
		try {
			response = await this.helpers.requestWithAuthentication.call(this, 'arivoApi', options);
			return response;
		} catch (error: any) {
			// Handle 429 Too Many Requests with retry logic
			if (error.statusCode === 429) {
				// Get retry-after from header, default to 1 second if not provided
				const retryAfter = error.response?.headers['retry-after'] || 
								   error.response?.headers['x-ratelimit-reset'] || 
								   1000;
				
				await sleep(+retryAfter * 1000); // Convert to milliseconds if needed
				maxRetries--;
				continue;
			}
			
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	} while (maxRetries > 0);

	// If we've exhausted all retries
	throw new NodeApiError(this.getNode(), {
		message: 'Could not complete API request. Maximum number of rate-limit retries reached.',
	} as JsonObject);
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
	// Try to get returnAll parameter, but default to false if it doesn't exist
	let returnAll = false;
	try {
		returnAll = this.getNodeParameter('returnAll', 0) as boolean;
	} catch (error) {
		// If returnAll parameter doesn't exist, default to false (use limit)
		returnAll = false;
	}
	
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

		// Rate limiting: check headers and wait if needed
		const rateLimitRemaining = parseInt(headers['x-ratelimit-remaining'] || '999', 10);
		const rateLimitReset = parseInt(headers['x-ratelimit-reset'] || '0', 10);
		
		// If we're close to the rate limit, wait a bit before next request
		if (rateLimitRemaining <= 5) {
			const currentTime = Math.floor(Date.now() / 1000);
			const waitTime = Math.max(1000, (rateLimitReset - currentTime) * 1000 + 1000); // Wait until reset + 1 second
			
			await sleep(Math.min(waitTime, 60000)); // Max 1 minute wait
		} else if (pageCount > 1) {
			// Small delay between requests to be API-friendly
			await sleep(100);
		}
	} while (true);

	return items;
} 