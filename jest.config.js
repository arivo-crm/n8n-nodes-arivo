module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/nodes', '<rootDir>/credentials'],
	testMatch: [
		'**/__tests__/**/*.ts',
		'**/?(*.)+(spec|test).ts',
	],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	collectCoverageFrom: [
		'nodes/**/*.ts',
		'credentials/**/*.ts',
		'!**/*.d.ts',
		'!**/node_modules/**',
		'!**/test/**',
		'!**/dist/**',
	],
	coverageDirectory: 'coverage',
	coverageReporters: [
		'text',
		'lcov',
		'html',
	],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	verbose: true,
	// Increase timeout for integration tests
	testTimeout: 10000,
};