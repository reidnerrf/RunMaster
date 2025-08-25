import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import type { TrackPoint } from '../hooks/useRunTracker';
import { useTheme } from '../hooks/useTheme';
import MapTrace from './MapTrace';

let RNMaps: any = null;
try { RNMaps = require('react-native-maps'); } catch {}
const hasMaps = !!RNMaps;

export type MapLiveProps = {
  points: TrackPoint[];
  height?: number;
  pois?: { id: string; latitude: number; longitude: number; type: 'water' | 'toilet' | 'park' | 'challenge' | 'collectible'; label?: string }[];
  showLighting?: boolean;
  showAirQuality?: boolean;
  showWeather?: boolean;
};

export default function MapLive({ points, height = 260, pois = [], showLighting, showAirQuality, showWeather }: MapLiveProps) {
  const { theme } = useTheme();
  const mapRef = useRef<any>(null);
  const [aqLayer, setAqLayer] = useState<any[] | null>(null);
  const [lightPins, setLightPins] = useState<{ lat: number; lon: number }[] | null>(null);
  const [weatherCells, setWeatherCells] = useState<{ lat: number; lon: number; i: number }[] | null>(null);

  const region = useMemo(() => {
    if (!points || points.length === 0) return null as any;
    const lats = points.map((p) => p.latitude);
    const lons = points.map((p) => p.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const latDelta = Math.max(0.001, (maxLat - minLat) * 1.4);
    const lonDelta = Math.max(0.001, (maxLon - minLon) * 1.4);
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLon + maxLon) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta,
    };
  }, [points]);

  useEffect(() => {
    if (!hasMaps || !mapRef.current || !region) return;
    try {
      // Prefer fitToCoordinates when we have enough points for a path
      if (points.length >= 2 && typeof mapRef.current.fitToCoordinates === 'function') {
        const coords = points.map((p) => ({ latitude: p.latitude, longitude: p.longitude }));
        mapRef.current.fitToCoordinates(coords, { edgePadding: { top: 40, right: 40, bottom: 40, left: 40 }, animated: true });
      } else {
        mapRef.current.animateToRegion(region, 400);
      }
    } catch {}
  }, [region, points]);

  const polyCoords = useMemo(() => points.map((p) => ({ latitude: p.latitude, longitude: p.longitude })), [points]);

  if (!hasMaps) {
    return <MapTrace points={points} height={height} />;
  }

  const { MapView, Polyline, Marker, PROVIDER_GOOGLE } = RNMaps;

  return (
    <View style={{ height, width: '100%', backgroundColor: theme.colors.card, overflow: 'hidden' }}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={region || { latitude: -23.55052, longitude: -46.633308, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        loadingEnabled
        zoomControlEnabled={Platform.OS === 'android'}
      >
        {/* Safety layers (mock overlays) */}
        {showLighting && lightPins && lightPins.map((c, idx) => (
          <Marker key={`lt-${idx}`} coordinate={{ latitude: c.lat, longitude: c.lon }} title="Iluminação" pinColor="#F1C40F" />
        ))}
        {showAirQuality && aqLayer && aqLayer.map((c, idx) => (
          <Marker key={`aq-${idx}`} coordinate={{ latitude: c.lat, longitude: c.lon }} title={`AQI ${c.aqi}`} pinColor={aqColor(c.aqi)} />
        ))}
        {showWeather && weatherCells && weatherCells.map((c, idx) => (
          <Marker key={`wx-${idx}`} coordinate={{ latitude: c.lat, longitude: c.lon }} title={c.i > 6 ? 'Chuva' : 'Nublado'} pinColor={c.i > 6 ? '#3498DB' : '#95A5A6'} />
        ))}
        {polyCoords.length > 1 && (
          <Polyline
            coordinates={polyCoords}
            strokeColor={theme.colors.primary}
            strokeWidth={5}
          />
        )}
        {polyCoords[0] && (
          <Marker coordinate={polyCoords[0]} title="Início" pinColor="#2ECC71" />
        )}
        {polyCoords[polyCoords.length - 1] && (
          <Marker coordinate={polyCoords[polyCoords.length - 1]} title="Agora" pinColor="#E74C3C" />
        )}
        {pois.map((p) => (
          <Marker key={p.id} coordinate={{ latitude: p.latitude, longitude: p.longitude }} title={p.label || p.type}>
            <View style={[styles.poiDot, { backgroundColor: poiColor(p.type), borderColor: theme.colors.card }]} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

function poiColor(type: MapLiveProps['pois'][number]['type']): string {
  switch (type) {
    case 'water': return '#00BFFF';
    case 'toilet': return '#8E44AD';
    case 'park': return '#27AE60';
    case 'challenge': return '#F39C12';
    case 'collectible': return '#E91E63';
    default: return '#999999';
  }
}

function aqColor(aqi: number): string {
  if (aqi < 50) return '#2ECC71';
  if (aqi < 100) return '#F1C40F';
  if (aqi < 150) return '#E67E22';
  return '#E74C3C';
}

const styles = StyleSheet.create({
  poiDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2 },
});