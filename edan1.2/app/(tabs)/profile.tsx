 import React, { useEffect } from 'react';
 import { View, Text, Button, StyleSheet } from 'react-native';
 import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

 export default function ProfileScreen() {
   const { user, logout, isLoading, isAuthenticated } = useAuth();
     const router = useRouter();
   useEffect(() => {
       if (!isAuthenticated) {
         router.replace('/login');
       }
     }, [isAuthenticated, router]);

   return (
     <View style={styles.container}>
       <Text style={styles.title}>Perfil</Text>
       {user && (
         <>
           <Text>
             Nombre: {user.nombre} {user.apellido}
           </Text>
           <Text>Cédula: {user.cedula}</Text>
         </>
       )}
       <Button title="Cerrar sesión" onPress={logout} disabled={isLoading} />
     </View>
   );
 }

 const styles = StyleSheet.create({
   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
   title: { fontSize: 24, marginBottom: 20 },
 });