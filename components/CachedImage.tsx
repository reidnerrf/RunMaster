import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface CachedImageProps {
  uri: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  placeholder?: string;
  fallback?: string;
  onPress?: () => void;
  onError?: () => void;
  onLoad?: () => void;
  priority?: 'low' | 'normal' | 'high';
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  transition?: number;
  cachePolicy?: 'memory' | 'disk' | 'memory-disk';
  showLoadingIndicator?: boolean;
  showErrorFallback?: boolean;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  blurhash?: string;
  tintColor?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export default function CachedImage({
  uri,
  width: imageWidth = '100%',
  height: imageHeight = 200,
  borderRadius = 0,
  placeholder = '🖼️',
  fallback = '❌',
  onPress,
  onError,
  onLoad,
  priority = 'normal',
  contentFit = 'cover',
  transition = 300,
  cachePolicy = 'memory-disk',
  showLoadingIndicator = true,
  showErrorFallback = true,
  resizeMode = 'cover',
  blurhash,
  tintColor,
  accessibilityLabel,
  accessibilityHint,
}: CachedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Memoize image dimensions
  const imageDimensions = {
    width: typeof imageWidth === 'string' ? '100%' : imageWidth,
    height: typeof imageHeight === 'string' ? 200 : imageHeight,
  };

  // Handle image load start
  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
  }, []);

  // Handle image load success
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  // Handle image load error
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  // Reset state when URI changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setIsLoaded(false);
  }, [uri]);

  // Render loading state
  const renderLoadingState = () => {
    if (!showLoadingIndicator || !isLoading) return null;

    return (
      <View style={[styles.overlay, styles.loadingOverlay]}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  };

  // Render error state
  const renderErrorState = () => {
    if (!showErrorFallback || !hasError) return null;

    return (
      <View style={[styles.overlay, styles.errorOverlay]}>
        <LinearGradient
          colors={['#ffebee', '#ffcdd2']}
          style={styles.errorGradient}
        >
          <Text style={styles.errorIcon}>{fallback}</Text>
          <Text style={styles.errorText}>Erro ao carregar</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setHasError(false);
              setIsLoading(true);
            }}
          >
            <Ionicons name="refresh" size={16} color="#d32f2f" />
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  // Render placeholder state
  const renderPlaceholder = () => {
    if (isLoaded || isLoading) return null;

    return (
      <View style={[styles.overlay, styles.placeholderOverlay]}>
        <LinearGradient
          colors={['#f5f5f5', '#e0e0e0']}
          style={styles.placeholderGradient}
        >
          <Text style={styles.placeholderIcon}>{placeholder}</Text>
          <Text style={styles.placeholderText}>Carregando imagem...</Text>
        </LinearGradient>
      </View>
    );
  };

  // Render main image
  const renderImage = () => {
    if (hasError) return null;

    return (
      <Image
        source={{ uri }}
        style={[
          styles.image,
          {
            width: imageDimensions.width,
            height: imageDimensions.height,
            borderRadius,
          },
        ]}
        contentFit={contentFit}
        transition={transition}
        cachePolicy={cachePolicy}
        priority={priority}
        placeholder={blurhash}
        placeholderContentFit="cover"
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="image"
      />
    );
  };

  const containerStyle = [
    styles.container,
    {
      width: imageDimensions.width,
      height: imageDimensions.height,
      borderRadius,
    },
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        {renderImage()}
        {renderPlaceholder()}
        {renderLoadingState()}
        {renderErrorState()}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle}>
      {renderImage()}
      {renderPlaceholder()}
      {renderLoadingState()}
      {renderErrorState()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  errorOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  placeholderOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  errorGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(211, 47, 47, 0.3)',
  },
  retryText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '500',
  },
  placeholderGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: 12,
    opacity: 0.6,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    opacity: 0.8,
  },
});