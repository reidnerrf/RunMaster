module.exports = {
	preset: 'jest-expo',
	testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
	transform: {
		'^.+\\.[jt]sx?$': 'babel-jest',
	},
	setupFilesAfterEnv: [],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	transformIgnorePatterns: [
		'node_modules/(?!(react-native|@react-native|@react-native/js-polyfills|react-clone-referenced-element|@react-navigation|@react-native-community|expo|expo-.*|@expo|expo-modules-core)/)'
	],
    moduleNameMapper: {
      '^react-native-reanimated$': 'react-native-reanimated/mock',
      '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
      '^@react-native/js-polyfills$': '<rootDir>/__mocks__/empty.js',
      '^@react-native/js-polyfills/(.*)$': '<rootDir>/__mocks__/empty.js',
      '^expo-modules-core$': '<rootDir>/__mocks__/empty.js'
    }
};