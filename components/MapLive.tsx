import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
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
  overlayMetrics?: { distanceKm: number; paceStr: string; calories: number } | null;
};

export default function MapLive({ points, height = 260, pois = [], showLighting, showAirQuality, showWeather, overlayMetrics }: MapLiveProps) {
  const { theme } = useTheme();
  const mapRef = useRef<any>(null);
  const [aqLayer, setAqLayer] = useState<any[] | null>(null);
  const [lightPins, setLightPins] = useState<{ lat: number; lon: number }[] | null>(null);
  const [weatherCells, setWeatherCells] = useState<{ lat: number; lon: number; i: number }[] | null>(null);
  const lastFitRef = useRef<number>(0);

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
      const now = Date.now();
      if (now - lastFitRef.current < 500) return; // throttle map camera updates
      lastFitRef.current = now;
      if (points.length >= 2 && typeof mapRef.current.fitToCoordinates === 'function') {
        const coords = points.map((p) => ({ latitude: p.latitude, longitude: p.longitude }));
        mapRef.current.fitToCoordinates(coords, { edgePadding: { top: 40, right: 40, bottom: 40, left: 40 }, animated: true });
      } else {
        mapRef.current.animateToRegion(region, 240);
      }
    } catch {}
  }, [region, points]);

  const polyCoords = useMemo(() => points.map((p) => ({ latitude: p.latitude, longitude: p.longitude })), [points]);
  const memoPois = useMemo(() => pois, [pois]);

  const customMapStyle = useMemo(() => (theme.mode === 'dark' ? darkStyle : lightStyle), [theme.mode]);

  // Mock data refresh for safety layers
  useEffect(() => {
    const center = polyCoords[polyCoords.length - 1] || { latitude: -23.55, longitude: -46.63 };
    let t: ReturnType<typeof setInterval> | null = null;
    const seed = () => Math.random() * 0.004 - 0.002;
    if (showLighting) {
      const pins = new Array(8).fill(0).map(() => ({ lat: center.latitude + seed(), lon: center.longitude + seed() }));
      setLightPins(pins);
    } else { setLightPins(null); }
    if (showAirQuality) {
      const aqs = new Array(10).fill(0).map(() => ({ lat: center.latitude + seed(), lon: center.longitude + seed(), aqi: Math.round(30 + Math.random() * 140) }));
      setAqLayer(aqs);
    } else { setAqLayer(null); }
    if (showWeather) {
      const wx = new Array(6).fill(0).map(() => ({ lat: center.latitude + seed(), lon: center.longitude + seed(), i: Math.round(Math.random() * 10) }));
      setWeatherCells(wx);
    } else { setWeatherCells(null); }
    // periodic refresh to simulate real-time updates
    t = setInterval(() => {
      if (showAirQuality) setAqLayer((prev) => (prev || []).map((c) => ({ ...c, aqi: Math.max(20, Math.min(180, c.aqi + Math.round(Math.random() * 10 - 5))) })));
      if (showWeather) setWeatherCells((prev) => (prev || []).map((c) => ({ ...c, i: Math.max(0, Math.min(10, c.i + Math.round(Math.random() * 4 - 2))) })));
    }, 8000);
    return () => { if (t) clearInterval(t); };
  }, [showLighting, showAirQuality, showWeather, polyCoords]);

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
        customMapStyle={customMapStyle}
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
        {memoPois.map((p) => (
          <Marker key={p.id} coordinate={{ latitude: p.latitude, longitude: p.longitude }} title={p.label || p.type}>
            <View style={[styles.poiDot, { backgroundColor: poiColor(p.type), borderColor: theme.colors.card }]} />
          </Marker>
        ))}
      </MapView>
      {overlayMetrics && (
        <View style={[styles.overlay, { backgroundColor: 'rgba(38,38,38,0.85)', borderColor: theme.colors.border }]}> 
          <Text style={[styles.ovTitle, { color: '#fff' }]}>{overlayMetrics.paceStr}</Text>
          <Text style={{ color: '#fff' }}>{overlayMetrics.distanceKm.toFixed(2)} km • {overlayMetrics.calories} kcal</Text>
        </View>
      )}
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
  overlay: { position: 'absolute', left: 12, right: 12, bottom: 12, borderRadius: 16, padding: 12, borderWidth: 1 },
  ovTitle: { fontSize: 20, fontWeight: '900' },
});

const lightStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
];

const darkStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1f2937' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#111827' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#374151' }] },
];