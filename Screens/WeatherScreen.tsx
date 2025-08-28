import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';
import { getCurrentWeather, makeLatLonQuery } from '../utils/weather';

type WeatherJson = {
  location?: { name?: string; region?: string; country?: string };
  current?: {
    temp_c?: number;
    condition?: { text?: string; icon?: string };
    wind_kph?: number;
    humidity?: number;
  };
};

export default function WeatherScreen() {
  const [q, setQ] = useState<string>('Sao Paulo');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState<boolean>(false);
  const [data, setData] = useState<WeatherJson | null>(null);

  useEffect(() => {
    const sub = NetInfo.addEventListener(state => setOffline(!state.isConnected));
    return () => sub();
  }, []);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCurrentWeather<WeatherJson>({ q, format: 'json' });
      setData(result);
    } catch (e: any) {
      setError(e?.message || 'Erro ao buscar clima');
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);

  const onUseGps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('Permissão de localização negada');
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const nextQ = makeLatLonQuery(pos.coords.latitude, pos.coords.longitude);
      setQ(nextQ);
    } catch (e: any) {
      setError(e?.message || 'Falha ao obter localização');
      setLoading(false);
    }
  }, []);

  const header = useMemo(() => {
    const city = data?.location?.name || '—';
    const region = data?.location?.region || '';
    const country = data?.location?.country || '';
    return `${city}${region ? ', ' + region : ''}${country ? ' · ' + country : ''}`;
  }, [data]);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }} refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchWeather} />}>
      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: '700' }}>Clima agora</Text>
        {offline ? <Text style={{ color: '#b00' }}>Você está offline. Exibindo dados em cache se disponíveis.</Text> : null}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={onUseGps} style={{ backgroundColor: '#eee', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 }}>
            <Text>Usar GPS</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={fetchWeather} style={{ backgroundColor: '#eee', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 }}>
            <Text>Atualizar</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ paddingVertical: 40 }}>
            <ActivityIndicator />
          </View>
        ) : error ? (
          <View style={{ paddingVertical: 20 }}>
            <Text style={{ color: '#b00' }}>{error}</Text>
          </View>
        ) : (
          <View style={{ backgroundColor: '#fafafa', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {data?.current?.condition?.icon ? (
              <Image source={{ uri: data.current.condition.icon.startsWith('http') ? data.current.condition.icon : `https:${data.current.condition.icon}` }} style={{ width: 56, height: 56 }} />
            ) : null}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '700' }}>{header}</Text>
              <Text style={{ fontSize: 28, fontWeight: '800' }}>{Math.round(data?.current?.temp_c ?? 0)}°C</Text>
              <Text>{data?.current?.condition?.text || '—'}</Text>
              <Text style={{ color: '#666', marginTop: 4 }}>Vento: {Math.round(data?.current?.wind_kph ?? 0)} km/h · Umidade: {data?.current?.humidity ?? 0}%</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

