import { setLang, t } from '../utils/i18n';

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
});