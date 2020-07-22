import { statsCount, calcMedianValue } from '../../utils';

describe('statsCount', () => {
	test('empty votes', () => {
		const votes: Array<number> = [];
		const result = { min: 0, max: 0, median: 0, mean: 0 };
		expect(statsCount(votes)).toStrictEqual(result);
	});

	test('first __tests__', () => {
		const votes = [3, 8, 5, 13];
		const result = { min: 3, max: 13, median: 6.5, mean: 7.3 };
		expect(statsCount(votes)).toStrictEqual(result);
	});

	test('second __tests__', () => {
		const votes = [8, 5, 5, 8, 8, 5, 5, 8];
		const result = { min: 5, max: 8, median: 6.5, mean: 6.5 };
		expect(statsCount(votes)).toStrictEqual(result);
	});

	test('second __tests__', () => {
		const votes = [9, 4, 7, 6, 5, 8, 2];
		const result = { min: 2, max: 9, median: 6, mean: 5.9 };
		expect(statsCount(votes)).toStrictEqual(result);
	});
});

describe('calcMedianValue', () => {
	test('first __tests__', () => {
		const values = [9, 4, 7, 6, 5, 8, 2];
		expect(calcMedianValue(values)).toBe(6);
	});

	test('second __tests__', () => {
		const values = [1, 2, 3, 4];
		expect(calcMedianValue(values)).toBe(2.5);
	});

	test('third __tests__', () => {
		const values = [3, 8, 5, 13];
		expect(calcMedianValue(values)).toBe(6.5);
	});
});
