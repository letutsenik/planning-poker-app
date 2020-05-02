const { testSum } = require('./rooms');

describe('testSum', () => {
    test('first test', () => {
        expect(testSum(1, 3)).toBe(4);
    });

    test('second test', () => {
        expect(testSum(-1, 3)).toBe(2);
    });
});
