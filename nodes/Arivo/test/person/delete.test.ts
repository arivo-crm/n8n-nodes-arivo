import * as deletePerson from '../../PersonOperations';
import { createMockExecuteFunction } from '../helpers';
import { arivoApiRequest } from '../../GenericFunctions';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Person Delete Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should delete a person by ID', async () => {
		const nodeParameters = {
			personId: '123',
		};

		const expectedResponse = {
			deleted: true,
		};

		mockArivoApiRequest.mockResolvedValue({});

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deletePerson.deletePerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/contacts/123');
		expect(result).toEqual(expectedResponse);
	});

	it('should handle string person ID', async () => {
		const nodeParameters = {
			personId: 'abc123',
		};

		const expectedResponse = {
			deleted: true,
		};

		mockArivoApiRequest.mockResolvedValue({});

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deletePerson.deletePerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/contacts/abc123');
		expect(result).toEqual(expectedResponse);
	});

	it('should handle empty response from API', async () => {
		const nodeParameters = {
			personId: '123',
		};

		const expectedResponse = {
			deleted: true,
		};

		// API returns empty response on successful deletion, but operation returns {deleted: true}
		mockArivoApiRequest.mockResolvedValue({});

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await deletePerson.deletePerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('DELETE', '/contacts/123');
		expect(result).toEqual(expectedResponse);
	});
});
