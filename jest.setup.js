// Global test setup for Jest
// Configure any global mocks or setup here

// Mock console methods to reduce noise in tests
global.console = {
	...console,
	// Uncomment to suppress logs during tests
	// log: jest.fn(),
	// debug: jest.fn(),
	// info: jest.fn(),
	// warn: jest.fn(),
	// error: jest.fn(),
};

// Mock global objects that might be used in n8n context
global.process = {
	...process,
	env: {
		...process.env,
		// Set any test-specific environment variables here
		NODE_ENV: 'test',
		ARIVO_BASE_URL: 'https://test.arivo.com.br/api/v2',
	},
};

// Extended jest matchers
expect.extend({
	toBeValidNodeParameter(received) {
		const pass = received && typeof received === 'object' && 'displayName' in received;
		if (pass) {
			return {
				message: () => `expected ${received} not to be a valid node parameter`,
				pass: true,
			};
		} else {
			return {
				message: () => `expected ${received} to be a valid node parameter`,
				pass: false,
			};
		}
	},
});