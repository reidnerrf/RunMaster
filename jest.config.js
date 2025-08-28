module.exports = {
	preset: 'react-native',
	testEnvironment: 'jsdom',
	testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
	transform: {
		'^.+\\.[jt]sx?$': 'babel-jest',
	},
	setupFiles: ['<rootDir>/jest.setup.pre.js'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	transformIgnorePatterns: [
		'node_modules/(?!(react-native|@react-native|@react-native/js-polyfills|react-clone-referenced-element|@react-navigation|@react-native-community|expo|expo-.*|@expo|expo-modules-core)/)'
	],
    moduleNameMapper: {
      '^react-native$': 'react-native-web',
      '^react-native-reanimated$': 'react-native-reanimated/mock',
      '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
      '^@react-native/js-polyfills$': '<rootDir>/__mocks__/empty.js',
      '^@react-native/js-polyfills/(.*)$': '<rootDir>/__mocks__/empty.js',
      '^expo-modules-core$': '<rootDir>/__mocks__/empty.js',
      '^expo-modules-core/(.*)$': '<rootDir>/__mocks__/empty.js',
      '^expo-crypto$': '<rootDir>/__mocks__/expo-crypto.js',
      '^expo-constants$': '<rootDir>/__mocks__/expo-constants.js',
      '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/async-storage.js',
      '^expo-status-bar$': '<rootDir>/__mocks__/expo-status-bar.js',
      '^expo-haptics$': '<rootDir>/__mocks__/expo-haptics.js'
    }
};