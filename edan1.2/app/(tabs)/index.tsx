import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { isRunningInExpoGo } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EvaluationCard from '@/components/ui/EvaluationCard';
import Button from '@/components/ui/Button';
import NetworkStatus from '@/components/ui/NetworkStatus';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useAuth } from '@/context/AuthContext';
import { EvaluationSummary, InformacionPreliminar } from '@/types/evaluation';
import colors from '@/constants/colors';
import { API_URL } from '@/confg/constants';
import { fetchEvaluations } from '@/services/evaluationService';
import { getSocket } from '@/services/socketService';
import * as Updates from 'expo-updates';

export default function EvaluationsScreen() {
  useEffect(() => {
    const checkForUpdates = async () => {
      if (isRunningInExpoGo()) {
        return;
      }
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    checkForUpdates();
  }, []);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isConnected } = useNetworkStatus();
  const { user, isAuthenticated, socket, eventoActivo, selectEvento, clearEvento } = useAuth();

  const [evaluations, setEvaluations] = useState<EvaluationSummary[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<
    EvaluationSummary[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Event code input state
  const [eventCode, setEventCode] = useState('');
  const [validatingCode, setValidatingCode] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);

  // Filter states
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Validate event code
  const handleValidateCode = async () => {
    if (!eventCode.trim()) {
      setCodeError('Ingrese un código de evento');
      return;
    }

    setValidatingCode(true);
    setCodeError(null);

    try {
      const response = await fetch(`${API_URL}/api/eventos/validar-codigo`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: eventCode.toUpperCase() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Código no válido');
      }

      const evento = await response.json();
      await selectEvento(evento);
      setEventCode('');
    } catch (err) {
      setCodeError(err instanceof Error ? err.message : 'Error al validar código');
    } finally {
      setValidatingCode(false);
    }
  };

  const handleClearEvento = async () => {
    await clearEvento();
  };

  // Load evaluations
  const loadEvaluations = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const data = await fetchEvaluations(eventoActivo?.id);
      setEvaluations(data);
    } catch (err) {
      console.error('Error loading evaluations:', err);
      setError(
        'No se pudieron cargar las evaluaciones. Por favor intente nuevamente.',
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [eventoActivo?.id]);

  // Initialize on component mount
  useEffect(() => {
    loadEvaluations();
  }, [loadEvaluations]);

  // --- Socket Listeners ---
  useEffect(() => {
    if (!socket) {
      console.log('Socket not available, skipping listener setup.');
      return;
    }

    console.log('Socket available, setting up listeners.');

    const handleNewEvaluation = (newEvaluation: EvaluationSummary) => {
      setEvaluations((prevEvaluations) => [newEvaluation, ...prevEvaluations]);
    };

    const handleEvaluationUpdated = (updatedEvaluation: EvaluationSummary) => {
      setEvaluations((prevEvaluations) =>
        prevEvaluations.map((e) =>
          e.id === updatedEvaluation.id ? updatedEvaluation : e,
        ),
      );
    };

    const handleEvaluationDeleted = (data: { id: string }) => {
      setEvaluations((prevEvaluations) =>
        prevEvaluations.filter((e) => e.id !== data.id),
      );
    };

    socket.on('server:new-evaluation', handleNewEvaluation);
    socket.on('server:evaluation-updated', handleEvaluationUpdated);
    socket.on('server:evaluation-deleted', handleEvaluationDeleted);

    return () => {
      socket.off('server:new-evaluation', handleNewEvaluation);
      socket.off('server:evaluation-updated', handleEvaluationUpdated);
      socket.off('server:evaluation-deleted', handleEvaluationDeleted);
    };
  }, [socket]);

  // Apply filters and search
  useEffect(() => {
    let result = [...evaluations];

    // Filtrar por ubicación para roles que no son superadmin
    if (user?.rol !== 'superadmin' && user?.ubicacion) {
      result = result.filter(
        (evaluation) => evaluation.estado === user.ubicacion,
      );
    }
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (evaluation) =>
          evaluation.jefeFamilia.toLowerCase().includes(query) ||
          evaluation.estado.toLowerCase().includes(query) ||
          evaluation.municipio.toLowerCase().includes(query) ||
          evaluation.parroquia.toLowerCase().includes(query),
      );
    }

    // Apply severity filter
    if (filterSeverity) {
      result = result.filter(
        (evaluation) => evaluation.informacionPreliminar === filterSeverity,
      );
    }

    // Apply sorting
    result = result.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const nameA = a.jefeFamilia.toLowerCase();
        const nameB = b.jefeFamilia.toLowerCase();
        return sortOrder === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
    });

    setFilteredEvaluations(result);
  }, [evaluations, searchQuery, filterSeverity, sortBy, sortOrder, user]);

  // Refresh control handler
  const handleRefresh = () => {
    loadEvaluations(true);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilterSeverity(null);
    setSortBy('date');
    setSortOrder('desc');
    setFilterVisible(false);
  };

  // Handle evaluation edit
  const handleEdit = (evaluation: EvaluationSummary) => {
    router.push({
      pathname: '/(tabs)/(evaluations)/[id]',
      params: { id: evaluation.id },
    });
  };

  // Handle evaluation delete
  const handleDelete = (evaluation: EvaluationSummary) => {
    getSocket().emit('app:delete-evaluation', { id: evaluation.id });
    // La actualización del estado se maneja con el evento de socket 'server:evaluation-deleted'
    // por lo que no es necesario redirigir manualmente.
    // Opcionalmente, puedes mostrar una alerta simple sin navegación.
    Alert.alert('Eliminación Solicitada', 'La evaluación se está eliminando.');
  };

  // Render filter section
  const renderFilterSection = () => {
    if (!filterVisible) return null;

    return (
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filtros</Text>

        <Text style={styles.filterLabel}>Grado de afectación:</Text>
        <View style={styles.severityButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.severityButton,
              filterSeverity === InformacionPreliminar.LEVE &&
                styles.severityButtonActive,
              {
                backgroundColor:
                  filterSeverity === InformacionPreliminar.LEVE
                    ? colors.leve
                    : colors.inputBackground,
              },
            ]}
            onPress={() =>
              setFilterSeverity(
                filterSeverity === InformacionPreliminar.LEVE
                  ? null
                  : InformacionPreliminar.LEVE,
              )
            }
          >
            <Text
              style={[
                styles.severityButtonText,
                filterSeverity === InformacionPreliminar.LEVE &&
                  styles.severityButtonTextActive,
              ]}
            >
              Leve
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.severityButton,
              filterSeverity === InformacionPreliminar.GRAVE &&
                styles.severityButtonActive,
              {
                backgroundColor:
                  filterSeverity === InformacionPreliminar.GRAVE
                    ? colors.grave
                    : colors.inputBackground,
              },
            ]}
            onPress={() =>
              setFilterSeverity(
                filterSeverity === InformacionPreliminar.GRAVE
                  ? null
                  : InformacionPreliminar.GRAVE,
              )
            }
          >
            <Text
              style={[
                styles.severityButtonText,
                filterSeverity === InformacionPreliminar.GRAVE &&
                  styles.severityButtonTextActive,
              ]}
            >
              Grave
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.severityButton,
              filterSeverity === InformacionPreliminar.TOTAL &&
                styles.severityButtonActive,
              {
                backgroundColor:
                  filterSeverity === InformacionPreliminar.TOTAL
                    ? colors.perdidaTotal
                    : colors.inputBackground,
              },
            ]}
            onPress={() =>
              setFilterSeverity(
                filterSeverity === InformacionPreliminar.TOTAL
                  ? null
                  : InformacionPreliminar.TOTAL,
              )
            }
          >
            <Text
              style={[
                styles.severityButtonText,
                filterSeverity === InformacionPreliminar.TOTAL &&
                  styles.severityButtonTextActive,
              ]}
            >
              Pérdida Total
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.severityButton,
              filterSeverity === InformacionPreliminar.RIESGO &&
                styles.severityButtonActive,
              {
                backgroundColor:
                  filterSeverity === InformacionPreliminar.RIESGO
                    ? colors.riesgo
                    : colors.inputBackground,
              },
            ]}
            onPress={() =>
              setFilterSeverity(
                filterSeverity === InformacionPreliminar.RIESGO
                  ? null
                  : InformacionPreliminar.RIESGO,
              )
            }
          >
            <Text
              style={[
                styles.severityButtonText,
                filterSeverity === InformacionPreliminar.RIESGO &&
                  styles.severityButtonTextActive,
              ]}
            >
              En Riesgo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.severityButton,
              filterSeverity === InformacionPreliminar.AISLADA &&
                styles.severityButtonActive,
              {
                backgroundColor:
                  filterSeverity === InformacionPreliminar.AISLADA
                    ? colors.aislada
                    : colors.inputBackground,
              },
            ]}
            onPress={() =>
              setFilterSeverity(
                filterSeverity === InformacionPreliminar.AISLADA
                  ? null
                  : InformacionPreliminar.AISLADA,
              )
            }
          >
            <Text
              style={[
                styles.severityButtonText,
                filterSeverity === InformacionPreliminar.AISLADA &&
                  styles.severityButtonTextActive,
              ]}
            >
              Aislada
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.filterLabel}>Ordenar por:</Text>
        <View style={styles.sortButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'date' && styles.sortButtonActive,
            ]}
            onPress={() => {
              if (sortBy === 'date') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('date');
                setSortOrder('desc');
              }
            }}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'date' && styles.sortButtonTextActive,
              ]}
            >
              Fecha
            </Text>
            {sortBy === 'date' && (
              <MaterialIcons
                name={sortOrder === 'asc' ? 'arrow-upward' : 'arrow-downward'}
                size={16}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'name' && styles.sortButtonActive,
            ]}
            onPress={() => {
              if (sortBy === 'name') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('name');
                setSortOrder('asc');
              }
            }}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'name' && styles.sortButtonTextActive,
              ]}
            >
              Nombre
            </Text>
            {sortBy === 'name' && (
              <MaterialIcons
                name={sortOrder === 'asc' ? 'arrow-upward' : 'arrow-downward'}
                size={16}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>
        </View>

        <Button
          title="Limpiar Filtros"
          onPress={clearFilters}
          type="secondary"
          style={styles.clearFiltersButton}
        />
      </View>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    if (isLoading || isRefreshing) return null;

    return (
      <View style={styles.emptyStateContainer}>
        <MaterialIcons name="assignment" size={64} color={colors.textLight} />
        <Text style={styles.emptyStateTitle}>No hay evaluaciones</Text>
        <Text style={styles.emptyStateText}>
          {searchQuery || filterSeverity
            ? 'No se encontraron evaluaciones que coincidan con los filtros aplicados.'
            : eventoActivo
              ? 'No hay evaluaciones registradas en este evento.'
              : 'Ingrese un código de evento para ver y crear evaluaciones.'}
        </Text>

        {!searchQuery && !filterSeverity && eventoActivo && (
          <Button
            title="Nueva Evaluación"
            onPress={() => router.push('/(tabs)/new-evaluation')}
            icon={<MaterialIcons name="add" size={20} color="#fff" />}
            style={styles.newEvaluationButton}
          />
        )}
        {!searchQuery && !filterSeverity && !eventoActivo && (
          <Text style={styles.emptyStateHint}>
            Ingrese un código de evento para comenzar
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Event Code Input or Active Event Banner */}
      {!eventoActivo ? (
        <View style={styles.codeInputContainer}>
          <View style={styles.codeInputIconCircle}>
            <MaterialIcons name="vpn-key" size={28} color={colors.primary} />
          </View>
          <Text style={styles.codeInputLabel}>Código de Evento</Text>
          <Text style={styles.codeInputHint}>
            Ingrese el código de 6 caracteres{'\n'}proporcionado por su coordinador
          </Text>
          <TextInput
            style={[
              styles.codeInput,
              inputFocused && styles.codeInputFocused,
            ]}
            placeholder="MER-001"
            placeholderTextColor={colors.disabled}
            value={eventCode}
            onChangeText={(text) => setEventCode(text.toUpperCase())}
            autoCapitalize="characters"
            maxLength={7}
            autoFocus
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
          {codeError ? (
            <View style={styles.codeErrorContainer}>
              <MaterialIcons name="error-outline" size={16} color={colors.error} />
              <Text style={styles.codeError}>{codeError}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={[
              styles.codeValidateButton,
              (!eventCode.trim() || validatingCode) && styles.codeValidateButtonDisabled,
            ]}
            onPress={handleValidateCode}
            disabled={!eventCode.trim() || validatingCode}
            activeOpacity={0.8}
          >
            {validatingCode ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.codeValidateButtonText}>Validar Código</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.activeEventBanner}>
          <View style={styles.activeEventInfo}>
            <MaterialIcons name="check-circle" size={20} color={colors.success} />
            <Text style={styles.activeEventName}>{eventoActivo.nombre}</Text>
            <View style={styles.activeEventCodeBadge}>
              <Text style={styles.activeEventCode}>{eventoActivo.codigo}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleClearEvento} style={styles.closeButton}>
            <MaterialIcons name="close" size={18} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={24}
            color={colors.textLight}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o ubicación"
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="clear" size={24} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(!filterVisible)}
        >
          <MaterialIcons
            name="filter-list"
            size={24}
            color={
              filterVisible || filterSeverity
                ? colors.primary
                : colors.textLight
            }
          />
        </TouchableOpacity>
      </View>

      {renderFilterSection()}

      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando evaluaciones...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Reintentar"
            onPress={() => loadEvaluations()}
            type="primary"
            style={styles.retryButton}
          />
        </View>
      ) : (
        <FlatList
          data={filteredEvaluations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EvaluationCard
              evaluation={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyState()}
          showsVerticalScrollIndicator={false}
        />
      )}

      {eventoActivo && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/(tabs)/new-evaluation')}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      <NetworkStatus />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.text,
  },
  filterButton: {
    padding: 10,
    marginLeft: 8,
  },
  filterContainer: {
    backgroundColor: colors.card,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.text,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  severityButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  severityButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  severityButtonActive: {
    borderColor: 'transparent',
  },
  severityButtonText: {
    color: colors.text,
    fontWeight: '500',
  },
  severityButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sortButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortButtonActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255, 127, 0, 0.1)',
  },
  sortButtonText: {
    color: colors.text,
    marginRight: 4,
  },
  sortButtonTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  clearFiltersButton: {
    marginTop: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for FAB
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    width: 200,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 30,
  },
  newEvaluationButton: {
    width: 200,
  },
  emptyStateHint: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    right: 20,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  codeInputContainer: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  codeInputIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 127, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  codeInputLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  codeInputHint: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 18,
  },
  codeInput: {
    width: '100%',
    height: 56,
    backgroundColor: colors.inputBackground,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 24,
    fontFamily: 'monospace',
    color: colors.text,
    letterSpacing: 4,
    textAlign: 'center',
  },
  codeInputFocused: {
    borderColor: colors.primary,
  },
  codeValidateButton: {
    width: '100%',
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  codeValidateButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  codeValidateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  codeErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    backgroundColor: 'rgba(211, 47, 47, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    width: '100%',
  },
  codeError: {
    color: colors.error,
    fontSize: 13,
    flex: 1,
  },
  activeEventBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(56, 142, 60, 0.08)',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 142, 60, 0.2)',
  },
  activeEventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  activeEventName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  activeEventCodeBadge: {
    backgroundColor: 'rgba(255, 127, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeEventCode: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: colors.primary,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
