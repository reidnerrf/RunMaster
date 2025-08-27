// Tipos para estações e horários
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Interface para informações de data
export interface DateInfo {
  date: Date;
  season: Season;
  timeOfDay: TimeOfDay;
  isWeekend: boolean;
  isHoliday: boolean;
  dayOfWeek: string;
  month: string;
  year: number;
}

// Interface para configurações de horário
export interface TimeConfig {
  morning: { start: string; end: string };
  afternoon: { start: string; end: string };
  evening: { start: string; end: string };
  night: { start: string; end: string };
}

// Configurações padrão de horários
const DEFAULT_TIME_CONFIG: TimeConfig = {
  morning: { start: '06:00', end: '11:59' },
  afternoon: { start: '12:00', end: '17:59' },
  evening: { start: '18:00', end: '19:59' },
  night: { start: '20:00', end: '05:59' },
};

// Configurações de estações (hemisfério sul)
const SOUTHERN_HEMISPHERE_SEASONS = {
  spring: { startMonth: 9, endMonth: 11 },   // Setembro a Novembro
  summer: { startMonth: 12, endMonth: 2 },   // Dezembro a Fevereiro
  autumn: { startMonth: 3, endMonth: 5 },    // Março a Maio
  winter: { startMonth: 6, endMonth: 8 },    // Junho a Agosto
};

// Configurações de estações (hemisfério norte)
const NORTHERN_HEMISPHERE_SEASONS = {
  spring: { startMonth: 3, endMonth: 5 },    // Março a Maio
  summer: { startMonth: 6, endMonth: 8 },    // Junho a Agosto
  autumn: { startMonth: 9, endMonth: 11 },   // Setembro a Novembro
  winter: { startMonth: 12, endMonth: 2 },   // Dezembro a Fevereiro
};

// Função para obter a estação atual
export function getSeason(date: Date = new Date(), hemisphere: 'north' | 'south' = 'south'): Season {
  try {
    const month = date.getMonth() + 1; // getMonth() retorna 0-11
    const seasons = hemisphere === 'north' ? NORTHERN_HEMISPHERE_SEASONS : SOUTHERN_HEMISPHERE_SEASONS;
    
    if (month >= seasons.spring.startMonth && month <= seasons.spring.endMonth) {
      return 'spring';
    } else if (month >= seasons.summer.startMonth || month <= seasons.summer.endMonth) {
      return 'summer';
    } else if (month >= seasons.autumn.startMonth && month <= seasons.autumn.endMonth) {
      return 'autumn';
    } else {
      return 'winter';
    }
    
  } catch (error) {
    console.error('Erro ao obter estação:', error);
    return 'spring'; // Fallback
  }
}

// Função para obter o período do dia
export function getTimeOfDay(date: Date = new Date(), config: TimeConfig = DEFAULT_TIME_CONFIG): TimeOfDay {
  try {
    const timeString = date.toTimeString().slice(0, 5); // HH:mm
    
    if (isTimeBetween(timeString, config.morning.start, config.morning.end)) {
      return 'morning';
    } else if (isTimeBetween(timeString, config.afternoon.start, config.afternoon.end)) {
      return 'afternoon';
    } else if (isTimeBetween(timeString, config.evening.start, config.evening.end)) {
      return 'evening';
    } else {
      return 'night';
    }
    
  } catch (error) {
    console.error('Erro ao obter período do dia:', error);
    return 'morning'; // Fallback
  }
}

// Função para verificar se é noite
export function isNightTime(
  currentTime: string,
  nightStart: string,
  nightEnd: string
): boolean {
  try {
    // Se o horário noturno cruza a meia-noite
    if (nightStart > nightEnd) {
      return currentTime >= nightStart || currentTime <= nightEnd;
    } else {
      return currentTime >= nightStart && currentTime <= nightEnd;
    }
    
  } catch (error) {
    console.error('Erro ao verificar se é noite:', error);
    return false;
  }
}

// Função para verificar se um horário está entre dois outros
function isTimeBetween(time: string, start: string, end: string): boolean {
  try {
    return time >= start && time <= end;
  } catch (error) {
    console.error('Erro ao verificar horário entre:', error);
    return false;
  }
}

// Função para obter informações completas de uma data
export function getDateInfo(date: Date = new Date(), hemisphere: 'north' | 'south' = 'south'): DateInfo {
  try {
    const season = getSeason(date, hemisphere);
    const timeOfDay = getTimeOfDay(date);
    const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    const month = date.toLocaleDateString('pt-BR', { month: 'long' });
    const year = date.getFullYear();
    
    // Verificar se é fim de semana
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    // Verificar se é feriado (lista básica brasileira)
    const isHoliday = isBrazilianHoliday(date);
    
    return {
      date,
      season,
      timeOfDay,
      isWeekend,
      isHoliday,
      dayOfWeek,
      month,
      year,
    };
    
  } catch (error) {
    console.error('Erro ao obter informações de data:', error);
    return {
      date: new Date(),
      season: 'spring',
      timeOfDay: 'morning',
      isWeekend: false,
      isHoliday: false,
      dayOfWeek: 'Segunda-feira',
      month: 'Janeiro',
      year: new Date().getFullYear(),
    };
  }
}

// Função para verificar se é feriado brasileiro
function isBrazilianHoliday(date: Date): boolean {
  try {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Feriados nacionais fixos
    const fixedHolidays = [
      { month: 1, day: 1 },   // Ano Novo
      { month: 4, day: 21 },  // Tiradentes
      { month: 5, day: 1 },   // Dia do Trabalho
      { month: 9, day: 7 },   // Independência
      { month: 10, day: 12 }, // Nossa Senhora
      { month: 11, day: 2 },  // Finados
      { month: 11, day: 15 }, // Proclamação da República
      { month: 12, day: 25 }, // Natal
    ];
    
    // Verificar feriados fixos
    const isFixedHoliday = fixedHolidays.some(holiday => 
      holiday.month === month && holiday.day === day
    );
    
    if (isFixedHoliday) return true;
    
    // Verificar feriados móveis (Páscoa, Carnaval, etc.)
    const easter = getEasterDate(date.getFullYear());
    const carnival = getCarnivalDate(easter);
    const corpusChristi = getCorpusChristiDate(easter);
    
    const movableHolidays = [
      { date: easter, name: 'Páscoa' },
      { date: carnival, name: 'Carnaval' },
      { date: corpusChristi, name: 'Corpus Christi' },
    ];
    
    const isMovableHoliday = movableHolidays.some(holiday => 
      holiday.date.getMonth() === date.getMonth() && 
      holiday.date.getDate() === date.getDate()
    );
    
    return isMovableHoliday;
    
  } catch (error) {
    console.error('Erro ao verificar feriado:', error);
    return false;
  }
}

// Função para calcular a data da Páscoa (Algoritmo de Meeus/Jones/Butcher)
function getEasterDate(year: number): Date {
  try {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    
    return new Date(year, month - 1, day);
    
  } catch (error) {
    console.error('Erro ao calcular Páscoa:', error);
    return new Date(year, 3, 1); // Fallback para 1º de abril
  }
}

// Função para calcular a data do Carnaval (47 dias antes da Páscoa)
function getCarnivalDate(easter: Date): Date {
  try {
    const carnival = new Date(easter);
    carnival.setDate(easter.getDate() - 47);
    return carnival;
  } catch (error) {
    console.error('Erro ao calcular Carnaval:', error);
    return new Date(easter.getFullYear(), 1, 1); // Fallback para 1º de fevereiro
  }
}

// Função para calcular Corpus Christi (60 dias após a Páscoa)
function getCorpusChristiDate(easter: Date): Date {
  try {
    const corpusChristi = new Date(easter);
    corpusChristi.setDate(easter.getDate() + 60);
    return corpusChristi;
  } catch (error) {
    console.error('Erro ao calcular Corpus Christi:', error);
    return new Date(easter.getFullYear(), 5, 1); // Fallback para 1º de junho
  }
}

// Função para obter o próximo feriado
export function getNextHoliday(date: Date = new Date()): { date: Date; name: string } | null {
  try {
    const currentYear = date.getFullYear();
    const nextYear = currentYear + 1;
    
    // Lista de feriados para o ano atual e próximo
    const holidays = [
      { date: new Date(currentYear, 0, 1), name: 'Ano Novo' },
      { date: new Date(currentYear, 3, 21), name: 'Tiradentes' },
      { date: new Date(currentYear, 4, 1), name: 'Dia do Trabalho' },
      { date: new Date(currentYear, 8, 7), name: 'Independência' },
      { date: new Date(currentYear, 9, 12), name: 'Nossa Senhora' },
      { date: new Date(currentYear, 10, 2), name: 'Finados' },
      { date: new Date(currentYear, 10, 15), name: 'Proclamação da República' },
      { date: new Date(currentYear, 11, 25), name: 'Natal' },
      { date: getEasterDate(currentYear), name: 'Páscoa' },
      { date: getEasterDate(nextYear), name: 'Páscoa' },
    ];
    
    // Filtrar feriados futuros
    const futureHolidays = holidays.filter(holiday => holiday.date > date);
    
    if (futureHolidays.length === 0) return null;
    
    // Retornar o próximo feriado
    return futureHolidays.reduce((next, current) => 
      current.date < next.date ? current : next
    );
    
  } catch (error) {
    console.error('Erro ao obter próximo feriado:', error);
    return null;
  }
}

// Função para obter o número de dias até uma data
export function getDaysUntil(targetDate: Date, fromDate: Date = new Date()): number {
  try {
    const timeDiff = targetDate.getTime() - fromDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  } catch (error) {
    console.error('Erro ao calcular dias até:', error);
    return 0;
  }
}

// Função para formatar data em português
export function formatDate(date: Date, format: 'short' | 'long' | 'full' = 'short'): string {
  try {
    const options: Intl.DateTimeFormatOptions = {};
    
    switch (format) {
      case 'short':
        options.day = '2-digit';
        options.month = '2-digit';
        options.year = 'numeric';
        break;
      case 'long':
        options.day = '2-digit';
        options.month = 'long';
        options.year = 'numeric';
        break;
      case 'full':
        options.weekday = 'long';
        options.day = '2-digit';
        options.month = 'long';
        options.year = 'numeric';
        break;
    }
    
    return date.toLocaleDateString('pt-BR', options);
    
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return date.toDateString();
  }
}

// Função para formatar horário
export function formatTime(date: Date, format: '12h' | '24h' = '24h'): string {
  try {
    if (format === '12h') {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }
  } catch (error) {
    console.error('Erro ao formatar horário:', error);
    return date.toTimeString();
  }
}

// Função para obter a idade
export function getAge(birthDate: Date): number {
  try {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('Erro ao calcular idade:', error);
    return 0;
  }
}

// Função para verificar se é dia útil
export function isBusinessDay(date: Date = new Date()): boolean {
  try {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = isBrazilianHoliday(date);
    
    return !isWeekend && !isHoliday;
  } catch (error) {
    console.error('Erro ao verificar se é dia útil:', error);
    return true;
  }
}

// Função para obter o próximo dia útil
export function getNextBusinessDay(date: Date = new Date()): Date {
  try {
    let nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    
    while (!isBusinessDay(nextDay)) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    
    return nextDay;
  } catch (error) {
    console.error('Erro ao obter próximo dia útil:', error);
    return date;
  }
}

// Função para obter informações da semana
export function getWeekInfo(date: Date = new Date()): {
  weekNumber: number;
  weekStart: Date;
  weekEnd: Date;
  isCurrentWeek: boolean;
} {
  try {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    
    const weekStart = new Date(date);
    const dayOfWeek = date.getDay();
    weekStart.setDate(date.getDate() - dayOfWeek);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const today = new Date();
    const isCurrentWeek = weekStart <= today && today <= weekEnd;
    
    return {
      weekNumber,
      weekStart,
      weekEnd,
      isCurrentWeek,
    };
    
  } catch (error) {
    console.error('Erro ao obter informações da semana:', error);
    return {
      weekNumber: 1,
      weekStart: date,
      weekEnd: date,
      isCurrentWeek: true,
    };
  }
}

// Função para obter informações do mês
export function getMonthInfo(date: Date = new Date()): {
  monthNumber: number;
  monthName: string;
  daysInMonth: number;
  firstDay: Date;
  lastDay: Date;
  isCurrentMonth: boolean;
} {
  try {
    const monthNumber = date.getMonth() + 1;
    const monthName = date.toLocaleDateString('pt-BR', { month: 'long' });
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth(), daysInMonth);
    
    const today = new Date();
    const isCurrentMonth = today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear();
    
    return {
      monthNumber,
      monthName,
      daysInMonth,
      firstDay,
      lastDay,
      isCurrentMonth,
    };
    
  } catch (error) {
    console.error('Erro ao obter informações do mês:', error);
    return {
      monthNumber: 1,
      monthName: 'Janeiro',
      daysInMonth: 31,
      firstDay: date,
      lastDay: date,
      isCurrentMonth: true,
    };
  }
}

export default {
  getSeason,
  getTimeOfDay,
  isNightTime,
  getDateInfo,
  getNextHoliday,
  getDaysUntil,
  formatDate,
  formatTime,
  getAge,
  isBusinessDay,
  getNextBusinessDay,
  getWeekInfo,
  getMonthInfo,
};