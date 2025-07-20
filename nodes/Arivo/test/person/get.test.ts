import * as getPerson from '../../PersonOperations';
import { createMockExecuteFunction, mockPersonData } from '../helpers';
import { arivoApiRequest } from '../../GenericFunctions';

// Mock the GenericFunctions module
jest.mock('../../GenericFunctions', () => ({
	arivoApiRequest: jest.fn(),
}));

const mockArivoApiRequest = arivoApiRequest as jest.MockedFunction<typeof arivoApiRequest>;

describe('Arivo Person Get Operation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should get a person by ID', async () => {
		const nodeParameters = {
			personId: '123',
		};

		mockArivoApiRequest.mockResolvedValue(mockPersonData);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getPerson.getPerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledTimes(1);
		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/contacts/123');
		expect(result).toEqual(mockPersonData);
	});

	it('should handle string person ID', async () => {
		const nodeParameters = {
			personId: 'abc123',
		};

		const mockPersonWithStringId = {
			...mockPersonData,
			id: 'abc123',
		};

		mockArivoApiRequest.mockResolvedValue(mockPersonWithStringId);

		const mockExecuteFunction = createMockExecuteFunction(nodeParameters);
		const result = await getPerson.getPerson.call(mockExecuteFunction, 0);

		expect(mockArivoApiRequest).toHaveBeenCalledWith('GET', '/contacts/abc123');
		expect(result).toEqual(mockPersonWithStringId);
	});
});