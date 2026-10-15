import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import {
  EvaluationSummary,
  InformacionPreliminar,
} from '../../types/evaluation';

interface EvaluationCardProps {
  evaluation: EvaluationSummary;
  onEdit?: () => void;
  onDelete?: () => void;
}

const EvaluationCard: React.FC<EvaluationCardProps> = ({
  evaluation,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper to determine severity icon and color
  const getSeverityInfo = (severity: string) => {
    switch (severity as InformacionPreliminar) {
      case InformacionPreliminar.LEVE:
        return {
          icon: 'exclamation-triangle',
          color: colors.leve,
          label: 'Afectación Leve',
        };
      case InformacionPreliminar.GRAVE:
        return {
          icon: 'exclamation-circle',
          color: colors.grave,
          label: 'Afectación Grave',
        };
      case InformacionPreliminar.TOTAL:
        return {
          icon: 'skull-crossbones',
          color: colors.perdidaTotal,
          label: 'Pérdida Total',
        };
      case InformacionPreliminar.RIESGO:
        return {
          icon: 'house-damage',
          color: colors.riesgo, // Asumiendo que tienes este color
          label: 'En Riesgo',
        };
      case InformacionPreliminar.AISLADA:
        return {
          icon: 'hiking',
          color: colors.aislada, // Asumiendo que tienes este color
          label: 'Aislada',
        };
      default:
        return {
          icon: 'question-circle',
          color: colors.textLight,
          label: 'Sin clasificar',
        };
    }
  };

  const severityInfo = getSeverityInfo(evaluation.informacionPreliminar);

  const handlePress = () => {
    router.push(`/evaluations/${evaluation.id}`);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.severityContainer}>
          <FontAwesome5
            name={severityInfo.icon}
            size={16}
            color={severityInfo.color}
          />
          <Text style={[styles.severityText, { color: severityInfo.color }]}>
            {severityInfo.label}
          </Text>
        </View>
        <View style={styles.syncContainer}>
          {evaluation.synced ? (
            <MaterialIcons name="cloud-done" size={16} color={colors.synced} />
          ) : (
            <MaterialIcons
              name="cloud-off"
              size={16}
              color={colors.notSynced}
            />
          )}
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{evaluation.jefeFamilia}</Text>
        <Text style={styles.location}>
          {evaluation.estado}, {evaluation.municipio}, {evaluation.parroquia}
        </Text>
        <Text style={styles.date}>{formatDate(evaluation.createdAt)}</Text>
      </View>

      <View style={styles.actionsContainer}>
        {onEdit && (
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={onEdit}
          >
            <MaterialIcons name="edit" size={18} color={colors.primary} />
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
        )}

        {onDelete && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDelete}
          >
            <MaterialIcons name="delete" size={18} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>
              Eliminar
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  syncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: 'rgba(255, 127, 0, 0.1)',
  },
  deleteButton: {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
    color: colors.primary,
  },
});

export default EvaluationCard;
