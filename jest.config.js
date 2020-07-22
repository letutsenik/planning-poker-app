module.exports = {
	roots: ['<rootDir>/src'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	testRegex: '(/__tests__/.*|(\\.|/)(__tests__|spec))\\.tsx?$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
