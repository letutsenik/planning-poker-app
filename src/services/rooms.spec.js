const { testSum } = require('./rooms');

describe('testSum', () => {
    test('first tests', () => {
        expect(testSum(1, 3)).toBe(4);
    });

    test('second tests', () => {
        expect(testSum(-1, 3)).toBe(2);
    });
});
