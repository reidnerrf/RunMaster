module.exports = {
	preset: 'react-native',
	testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
	transform: {
		'^.+\\.(ts|tsx)$': 'babel-jest',
	},
	setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};