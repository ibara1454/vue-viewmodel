import { sum } from '@/index';

test('basic', () => {
  expect(sum()).toBe(0);
});

test('basic again', () => {
  expect(sum(1, 2)).toBe(3);
});

describe('describe', () => {
  it('should be', () => {
    expect('Hello, Tom!').toBe('Hello, Tom!');
  });
});
