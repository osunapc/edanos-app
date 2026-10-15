import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

const NetworkStatus: React.FC = () => {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  
  // If still determining connection status
  if (isConnected === null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.warning }]}>
        <MaterialIcons name="wifi-off" size={16} color="#fff" />
        <Text style={styles.text}>Verificando conexión...</Text>
      </View>
    );
  }
  
  // Fully offline
  if (!isConnected) {
    return (
      <View style={[styles.container, { backgroundColor: colors.error }]}>
        <MaterialIcons name="wifi-off" size={16} color="#fff" />
        <Text style={styles.text}>Sin conexión - Modo offline</Text>
      </View>
    );
  }
  
  // Connected but no internet
  if (isConnected && !isInternetReachable) {
    return (
      <View style={[styles.container, { backgroundColor: colors.warning }]}>
        <MaterialIcons name="signal-wifi-connected-no-internet-4" size={16} color="#fff" />
        <Text style={styles.text}>Conectado a red, sin acceso a internet</Text>
      </View>
    );
  }
  
  // Fully online - can be hidden or shown depending on preference
  return (
    <View style={[styles.container, { backgroundColor: colors.success }]}>
      <MaterialIcons name="wifi" size={16} color="#fff" />
      <Text style={styles.text}>Conectado</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
    fontWeight: '500',
  },
});

export default NetworkStatus;