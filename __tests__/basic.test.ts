// Basic JavaScript test that doesn't require any special setup
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

  test('should work with strings', () => {
    expect('hello world').toContain('hello');
    expect('test').toHaveLength(4);
    expect('').toBe('');
  });

  test('should work with arrays', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr).toHaveLength(5);
    expect(arr[0]).toBe(1);
    expect(arr[arr.length - 1]).toBe(5);
  });

  test('should work with functions', () => {
    const add = (a, b) => a + b;
    const multiply = (a, b) => a * b;
    
    expect(add(2, 3)).toBe(5);
    expect(multiply(4, 5)).toBe(20);
  });
});