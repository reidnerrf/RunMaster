// Test utility functions that don't require React Native
import { setLang, t } from '../utils/i18n';

describe('Utility Functions', () => {
  describe('i18n', () => {
    beforeEach(() => {
      // Reset to Portuguese for each test
      setLang('pt');
    });

    test('should return Portuguese text by default', () => {
      expect(t('home_welcome')).toBe('Pronto para correr?');
      expect(t('auth_login')).toBe('Entrar');
    });

    test('should switch to English when setLang is called', () => {
      setLang('en');
      expect(t('home_welcome')).toBe('Ready to run?');
      expect(t('auth_login')).toBe('Login');
    });

    test('should return key when translation is missing', () => {
      expect(t('nonexistent_key')).toBe('nonexistent_key');
    });

    test('should handle both languages correctly', () => {
      setLang('pt');
      expect(t('workouts_title')).toBe('Treinos');
      
      setLang('en');
      expect(t('workouts_title')).toBe('Workouts');
    });

    test('should handle common translations', () => {
      setLang('pt');
      expect(t('common_loading')).toBe('Carregando...');
      expect(t('common_error')).toBe('Erro');
      
      setLang('en');
      expect(t('common_loading')).toBe('Loading...');
      expect(t('common_error')).toBe('Error');
    });
  });

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
});