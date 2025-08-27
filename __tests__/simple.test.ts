// Simple test to verify Jest is working
describe('Basic functionality', () => {
  test('should work with basic JavaScript', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toBe('hello');
    expect([1, 2, 3]).toHaveLength(3);
  });

  test('should handle basic math', () => {
    expect(5 * 5).toBe(25);
    expect(10 / 2).toBe(5);
    expect(7 - 3).toBe(4);
  });

  test('should work with objects', () => {
    const obj = { name: 'test', value: 42 };
    expect(obj.name).toBe('test');
    expect(obj.value).toBe(42);
  });
});