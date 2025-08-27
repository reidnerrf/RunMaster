import React, { useState, useCallback, useMemo } from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface OptimizedFlatListProps<T> {
  data: T[];
  renderItem: (item: { item: T; index: number }) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  onEndReached?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  loading?: boolean;
  hasMore?: boolean;
  emptyMessage?: string;
  estimatedItemHeight?: number;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: any;
  ListHeaderComponent?: React.ReactElement;
  ListFooterComponent?: React.ReactElement;
  onItemPress?: (item: T, index: number) => void;
  enablePullToRefresh?: boolean;
  enableInfiniteScroll?: boolean;
  threshold?: number;
  maxToRenderPerBatch?: number;
  windowSize?: number;
  removeClippedSubviews?: boolean;
  getItemLayout?: (data: T[] | null, index: number) => {
    length: number;
    offset: number;
    index: number;
  };
}

export default function OptimizedFlatList<T>({
  data,
  renderItem,
  keyExtractor,
  onEndReached,
  onRefresh,
  refreshing = false,
  loading = false,
  hasMore = true,
  emptyMessage = 'Nenhum item encontrado',
  estimatedItemHeight = 100,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  ListHeaderComponent,
  ListFooterComponent,
  onItemPress,
  enablePullToRefresh = true,
  enableInfiniteScroll = true,
  threshold = 0.5,
  maxToRenderPerBatch = 10,
  windowSize = 21,
  removeClippedSubviews = true,
  getItemLayout,
}: OptimizedFlatListProps<T>) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Memoize renderItem para evitar re-renders desnecessários
  const memoizedRenderItem = useCallback(
    ({ item, index }: { item: T; index: number }) => {
      const element = renderItem({ item, index });
      
      if (onItemPress) {
        return React.cloneElement(element, {
          onPress: () => onItemPress(item, index),
        });
      }
      
      return element;
    },
    [renderItem, onItemPress]
  );

  // Memoize keyExtractor
  const memoizedKeyExtractor = useCallback(
    (item: T, index: number) => keyExtractor(item, index),
    [keyExtractor]
  );

  // Memoize onEndReached callback
  const handleEndReached = useCallback(() => {
    if (!enableInfiniteScroll || !hasMore || isLoadingMore || loading) return;
    
    setIsLoadingMore(true);
    onEndReached?.();
    
    // Reset loading state after a delay
    setTimeout(() => setIsLoadingMore(false), 1000);
  }, [enableInfiniteScroll, hasMore, isLoadingMore, loading, onEndReached]);

  // Memoize refresh control
  const refreshControl = useMemo(() => {
    if (!enablePullToRefresh || !onRefresh) return undefined;
    
    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor="#667eea"
        colors={['#667eea', '#764ba2']}
        progressBackgroundColor="#ffffff"
        size="large"
      />
    );
  }, [enablePullToRefresh, onRefresh, refreshing]);

  // Memoize footer component
  const footerComponent = useMemo(() => {
    if (!enableInfiniteScroll || !hasMore) return ListFooterComponent;
    
    if (isLoadingMore) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color="#667eea" />
          <Text style={styles.loadingText}>Carregando mais itens...</Text>
        </View>
      );
    }
    
    return ListFooterComponent;
  }, [enableInfiniteScroll, hasMore, isLoadingMore, ListFooterComponent]);

  // Memoize empty component
  const emptyComponent = useMemo(() => {
    if (data.length > 0) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <LinearGradient
          colors={['#f8f9fa', '#e9ecef']}
          style={styles.emptyGradient}
        >
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>Nada por aqui</Text>
          <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        </LinearGradient>
      </View>
    );
  }, [data.length, emptyMessage]);

  // Memoize getItemLayout for better performance
  const memoizedGetItemLayout = useMemo(() => {
    if (getItemLayout) return getItemLayout;
    
    return (data: T[] | null, index: number) => ({
      length: estimatedItemHeight,
      offset: estimatedItemHeight * index,
      index,
    });
  }, [getItemLayout, estimatedItemHeight]);

  return (
    <FlatList
      data={data}
      renderItem={memoizedRenderItem}
      keyExtractor={memoizedKeyExtractor}
      onEndReached={handleEndReached}
      onEndReachedThreshold={threshold}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={[
        styles.contentContainer,
        contentContainerStyle,
        data.length === 0 && styles.emptyContentContainer,
      ]}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={footerComponent}
      ListEmptyComponent={emptyComponent}
      maxToRenderPerBatch={maxToRenderPerBatch}
      windowSize={windowSize}
      removeClippedSubviews={removeClippedSubviews}
      getItemLayout={memoizedGetItemLayout}
      initialNumToRender={Math.ceil(height / estimatedItemHeight)}
      updateCellsBatchingPeriod={50}
      disableVirtualization={false}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 10,
      }}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={21}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      onEndReachedThreshold={0.5}
      // Memory optimizations
      keyExtractor={memoizedKeyExtractor}
      getItemLayout={memoizedGetItemLayout}
      // Smooth scrolling
      scrollEventThrottle={16}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  emptyContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyGradient: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
});