import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, Image, Pressable } from 'react-native';
import * as Location from 'expo-location';
import { getCurrentWeather, getForecast, makeLatLonQuery } from '../utils/weather';

type WeatherJson = any;

export default function WeatherWidget() {
  const [q, setQ] = useState<string>('Sao Paulo');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<WeatherJson | null>(null);
  const [forecast, setForecast] = useState<WeatherJson | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [c, f] = await Promise.all([
        getCurrentWeather<WeatherJson>({ q }),
        getForecast<WeatherJson>({ q, days: 1, hours: 6 })
      ]);
      setCurrent(c); setForecast(f);
    } catch (e: any) { setError(e?.message || 'Erro ao carregar clima'); }
    finally { setLoading(false); }
  }, [q]);

  useEffect(() => { load(); }, [load]);

  const useGps = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({});
      setQ(makeLatLonQuery(pos.coords.latitude, pos.coords.longitude));
    } catch {}
  };

  if (loading) return (
    <View style={{ padding: 14 }}>
      <ActivityIndicator />
    </View>
  );
  if (error) return (
    <View style={{ padding: 14 }}>
      <Text style={{ color: '#b00' }}>{error}</Text>
    </View>
  );

  const temp = Math.round(current?.current?.temp_c ?? 0);
  const icon = current?.current?.condition?.icon;
  const cond = current?.current?.condition?.text || '—';
  const hours = forecast?.forecast?.forecastday?.[0]?.hour || [];

  return (
    <View style={{ padding: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {icon ? <Image source={{ uri: icon.startsWith('http') ? icon : `https:${icon}` }} style={{ width: 40, height: 40 }} /> : null}
          <Text style={{ fontSize: 18, fontWeight: '800' }}>{temp}°C · {cond}</Text>
        </View>
        <Pressable onPress={useGps} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#eee' }}>
          <Text>GPS</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
        {hours.slice(0, 4).map((h: any) => (
          <View key={h.time_epoch} style={{ backgroundColor: '#f5f5f5', borderRadius: 10, padding: 8, minWidth: 60, alignItems: 'center' }}>
            <Text style={{ fontWeight: '700' }}>{new Date(h.time).getHours()}h</Text>
            <Text>{Math.round(h.temp_c)}°</Text>
            <Text style={{ color: '#666' }}>{Math.round(h.chance_of_rain || 0)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

