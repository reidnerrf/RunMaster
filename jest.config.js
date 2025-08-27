module.exports = {
	preset: 'react-native',
	testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
	transform: {
		'^.+\\.(ts|tsx)$': 'babel-jest',
	},
	setupFilesAfterEnv: [],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};