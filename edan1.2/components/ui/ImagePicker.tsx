import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import colors from '../../constants/colors';
import Button from './Button';

interface ImagePickerProps {
  title: string;
  onImageSelected: (uri: string | null) => void;
  initialImage?: string | null;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  title,
  onImageSelected,
  initialImage,
}) => {
  const [image, setImage] = useState<string | null>(initialImage || null);

  useEffect(() => {
    setImage(initialImage || null);
  }, [initialImage]);

  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } =
        await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Se requieren permisos para acceder a la galería');
        return false;
      }
      return true;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      onImageSelected(uri);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ExpoImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Se requieren permisos para acceder a la cámara');
        return;
      }
    }

    let result = await ExpoImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Reduced quality for smaller file size
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      onImageSelected(result.assets[0].uri);
    }
  };

  const clearImage = () => {
    setImage(null);
    onImageSelected(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.fieldLabel}>{title}</Text>
      {image ? (
        <View style={[styles.imageContainer, { overflow: 'visible' }]}>
          <Image
            source={{ uri: image }}
            style={[styles.image]}
            onError={(e) =>
              console.log('Image loading error:', e.nativeEvent.error)
            }
            onLoad={() => console.log('Image loaded successfully!', image)}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.removeButton} onPress={clearImage}>
            <MaterialIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <FontAwesome5 name="home" size={48} color={colors.textLight} />
          <Text style={styles.placeholderText}>No hay imagen seleccionada</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Tomar Foto"
          onPress={takePhoto}
          type="primary"
          icon={<MaterialIcons name="camera-alt" size={20} color="#fff" />}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title="Galería"
          onPress={pickImage}
          type="secondary"
          icon={<MaterialIcons name="photo-library" size={20} color="#fff" />}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    height: 100,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    color: colors.textLight,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ImagePicker;
