module.exports = {
	preset: 'jest-expo',
	testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
	transform: {
		'^.+\\.(ts|tsx)$': 'babel-jest',
	},
	setupFilesAfterEnv: [],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	transformIgnorePatterns: [
		'node_modules/(?!(react-native|@react-native|@react-native/js-polyfills|react-clone-referenced-element|@react-navigation|@react-native-community)/)'
	],
    moduleNameMapper: {
      '^react-native-reanimated$': 'react-native-reanimated/mock',
      '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
    }
};