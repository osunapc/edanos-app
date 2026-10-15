import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Signature from 'react-native-signature-canvas';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useAuth } from '@/context/AuthContext';
import colors from '@/constants/colors';
import {
  FormData,
  MiembroFamiliar,
  CheckboxProps,
  MultipleCheckboxProps,
  TextFieldProps,
  TextAreaProps,
  SectionTitleProps,
  SubsectionTitleProps,
  SignatureComponentProps,
  InformacionPreliminar,
  UsoEstructura,
  CondicionVivienda,
  CondicionAcceso,
} from '@/types/evaluation';

// Import UI components
import TextField from '@/components/ui/TextField';
import TextArea from '@/components/ui/TextArea';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { SectionTitle, SubsectionTitle } from '@/components/ui/SectionTitle';
import ImagePicker from '@/components/ui/ImagePicker';
import SignatureCapture from '@/components/ui/SignatureCapture';
import NetworkStatus from '@/components/ui/NetworkStatus';
import { v4 as uuidv4 } from 'uuid';

interface EvaluationFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText?: string;
}

import { useEventos } from '@/hooks/useEventos';
import { Evento } from '@/types/evaluation';
import { Modal } from 'react-native';

// ... (imports existentes)

export default function EvaluationForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitButtonText = 'Crear',
}: EvaluationFormProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { eventos, isLoading: isLoadingEventos } = useEventos();
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEventName, setSelectedEventName] = useState<string>('');

  // Función para convertir coordenadas geográficas a UTM
  const convertLatLonToUtm = (lat: number, lon: number) => {
    const a = 6378137; // WGS 84 semi-major axis
    const eccSquared = 0.00669438; // WGS 84 eccentricity squared
    const k0 = 0.9996;

    const lonRad = (lon * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;

    const zoneNumber = Math.floor((lon + 180) / 6) + 1;

    const lonOrigin = (zoneNumber - 1) * 6 - 180 + 3; // +3 puts origin in middle of zone
    const lonOriginRad = (lonOrigin * Math.PI) / 180;

    const eccPrimeSquared = eccSquared / (1 - eccSquared);

    const N = a / Math.sqrt(1 - eccSquared * Math.sin(latRad) ** 2);
    const T = Math.tan(latRad) ** 2;
    const C = eccPrimeSquared * Math.cos(latRad) ** 2;
    const A = Math.cos(latRad) * (lonRad - lonOriginRad);

    const M =
      a *
      ((1 -
        eccSquared / 4 -
        (3 * eccSquared ** 2) / 64 -
        (5 * eccSquared ** 3) / 256) *
        latRad -
        ((3 * eccSquared) / 8 +
          (3 * eccSquared ** 2) / 32 +
          (45 * eccSquared ** 3) / 1024) *
          Math.sin(2 * latRad) +
        ((15 * eccSquared ** 2) / 256 + (45 * eccSquared ** 3) / 1024) *
          Math.sin(4 * latRad) -
        ((35 * eccSquared ** 3) / 3072) * Math.sin(6 * latRad));

    const easting =
      k0 *
        N *
        (A +
          ((1 - T + C) * A ** 3) / 6 +
          ((5 - 18 * T + T ** 2 + 72 * C - 58 * eccPrimeSquared) * A ** 5) /
            120) +
      500000.0;

    let northing =
      k0 *
      (M +
        N *
          Math.tan(latRad) *
          (A ** 2 / 2 +
            ((5 - T + 9 * C + 4 * C ** 2) * A ** 4) / 24 +
            ((61 - 58 * T + T ** 2 + 600 * C - 330 * eccPrimeSquared) *
              A ** 6) /
              720));

    if (lat < 0) {
      northing += 10000000.0; // 10000000 meter offset for southern hemisphere
    }

    return {
      easting: Math.round(easting),
      northing: Math.round(northing),
      zoneNumber,
    };
  };

  const { isConnected } = useNetworkStatus();
  const { coordinates } = useGeolocation();

  // Form state
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  // Form sections
  const sections = [
    { id: 'preliminary', title: 'Información Preliminar' },
    { id: 'location', title: 'Ubicación' },
    { id: 'coordenadas', title: 'COORDENADAS GEOGRÁFICAS' },
    { id: 'estructura', title: 'USO DE LA ESTRUCTURA' },
    { id: 'evento', title: 'INFORMACIÓN DEL EVENTO' },
    { id: 'jefecalle', title: 'JEFE DE CALLE' },
    { id: 'vivienda', title: 'CONDICIÓN DE VIVIENDA' },
    { id: 'familia', title: 'CARGA FAMILIAR' },
    { id: 'fdesalojada', title: 'FAMILIA DESALOJADA' },
    { id: 'evaluacion', title: 'EVALUACIÓN ESTRUCTURAL' },
    { id: 'afectaciones', title: 'Daños y Afectaciones' },
    { id: 'p_enseres', title: 'PÉRDIDAS DE ENSERES' },
    { id: 'vitales', title: 'Líneas Vitales' },
    { id: 'evaluado', title: 'DATOS DEL EVALUADO (AFECTADO)' },
    { id: 'fotos', title: 'Evidencia Fotográfica' },
    { id: 'evaluador', title: 'Firmas y Validación' },
  ];

  const formDefaultValues: Partial<FormData> = {
    eventoId: undefined, // ⭐ NUEVO
    informacionPreliminar: 'n/a',
    estado: user?.ubicacion || '',
    municipio: 'n/a',
    parroquia: 'n/a',
    cuadranteDePaz: 'n/a',
    urbanizacion: 'n/a',
    calle: 'n/a',
    casa: 'n/a',
    barrioSector: 'n/a',
    vereda: 'n/a',
    apto: 'n/a',
    avenida: 'n/a',
    usoEstructura: 'n/a',
    otrosUsoEstructura: 'n/a',
    latitud: coordinates?.latitude?.toString() || '',
    longitud: coordinates?.longitude?.toString() || '',
    cota: '',
    este: '',
    norte: '',
    huso: '',
    tipoEvento: 'n/a',
    horaEvento: 'n/a',
    apellidosJefe: 'n/a',
    nombresJefe: 'n/a',
    telefonoJefe: 'n/a',
    condicionVivienda: 'n/a',
    otrosCondicionVivienda: 'n/a',
    viasAcceso: [],
    otrosViasAcceso: 'n/a',
    condicionAcceso: 'n/a',
    otrosCondicionAcceso: 'n/a',
    jefeFamilia: 'n/a',
    edadJefe: 'n/a',
    sexoJefe: 'n/a',
    cedulaJefe: 'n/a',
    tallaC: 'n/a',
    tallaP: 'n/a',
    tallaZ: 'n/a',
    telefonoJefeFamilia: 'n/a',
    patologiasJefe: 'n/a',
    viviendaSolidaria: false,
    albergue: false,
    telefonoContactoAlbergue: 'n/a',
    direccionAlbergue: 'n/a',
    nombreResponsableAlbergue: 'n/a',
    cedulaResponsableAlbergue: 'n/a',
    materialesConstruccion: [],
    otrosMaterialesConstruccion: '',
    afectacionesNoEstructurales: [],
    otrosNoEstructurales: '',
    afectacionesEstructuralesColapso: [],
    otrosEstructuralesColapso: '',
    afectacionesParciales: [],
    otrosAfectacionesParciales: '',
    perdidasEnseres: [],
    otrosPerdidasEnseres: 'n/a',
    lineasVitalesAfectadas: [],
    otrosLineasVitalesAfectadas: 'n/a',
    observaciones: 'n/a',
    nombreEvaluado: 'n/a',
    cedulaEvaluado: 'n/a',
    telefonoEvaluado: 'n/a',
    nombreEvaluador: user?.nombre || 'n/a',
    cedulaEvaluador: user?.cedula || 'n/a',
    telefonoEvaluador: user?.telefono || 'n/a',
    firmaEvaluado: null,
    firmaEvaluador: null,
    grupoFamiliar: [],
    fotoFamiliar: null,
    fotosAdicionales: [],
    fotoFamiliarFile: undefined,
    fotosAdicionalesFiles: [],
  };

  // Form validation and state management
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    shouldUnregister: false,
    defaultValues: formDefaultValues,
  });

  // Usamos useEffect con reset para cargar los datos iniciales de forma asíncrona.
  useEffect(() => {
    if (initialData) {
      const defaultValues = getValues();
      const mergedData = { ...defaultValues, ...initialData };

      mergedData.grupoFamiliar = initialData.grupoFamiliar || [];
      mergedData.viasAcceso = initialData.viasAcceso || [];
      mergedData.materialesConstruccion =
        initialData.materialesConstruccion || [];
      mergedData.afectacionesNoEstructurales =
        initialData.afectacionesNoEstructurales || [];
      mergedData.afectacionesEstructuralesColapso =
        initialData.afectacionesEstructuralesColapso || [];
      mergedData.afectacionesParciales =
        initialData.afectacionesParciales || [];
      mergedData.perdidasEnseres = initialData.perdidasEnseres || [];
      mergedData.lineasVitalesAfectadas =
        initialData.lineasVitalesAfectadas || [];

      for (const key in mergedData) {
        if (
          Object.prototype.hasOwnProperty.call(formDefaultValues, key) &&
          typeof formDefaultValues[key as keyof FormData] === 'string' &&
          (mergedData as any)[key] === null
        ) {
          (mergedData as any)[key] = '';
        }
      }
      reset(mergedData);
    }
  }, [initialData, reset]);

  // Efecto para autocompletar el estado con la ubicación del usuario
  useEffect(() => {
    if (!initialData && user?.ubicacion && getValues('estado') === '') {
      setValue('estado', user.ubicacion, { shouldDirty: true });
    }
  }, [initialData, user, setValue, getValues]);

  // Efecto para autocompletar las coordenadas al llegar a la sección
  useEffect(() => {
    const currentSectionId = sections[currentSection]?.id;
    if (currentSectionId === 'coordenadas' && coordinates) {
      if (!getValues('latitud') && coordinates.latitude) {
        setValue('latitud', coordinates.latitude.toString(), {
          shouldDirty: true,
        });
      }
      if (!getValues('longitud') && coordinates.longitude) {
        setValue('longitud', coordinates.longitude.toString(), {
          shouldDirty: true,
        });
      }
      if (typeof coordinates.altitude === 'number') {
        setValue('cota', Math.round(coordinates.altitude).toString(), {
          shouldDirty: true,
        });
      }

      const utm = convertLatLonToUtm(
        coordinates.latitude,
        coordinates.longitude
      );
      if (!getValues('este') && utm.easting) {
        setValue('este', utm.easting.toString(), { shouldDirty: true });
      }
      if (!getValues('norte') && utm.northing) {
        setValue('norte', utm.northing.toString(), { shouldDirty: true });
      }
      if (!getValues('huso') && utm.zoneNumber) {
        setValue('huso', utm.zoneNumber.toString(), { shouldDirty: true });
      }
    }
  }, [currentSection, coordinates, setValue, getValues]);

  // Efecto para establecer el nombre del evento seleccionado si estamos editando
  useEffect(() => {
    if (initialData?.eventoId && eventos.length > 0) {
      const evento = eventos.find((e) => e.id === initialData.eventoId);
      if (evento) {
        setSelectedEventName(evento.nombre);
      }
    }
  }, [initialData, eventos]);

  // Watch form values for conditional rendering
  const formValues = watch();

  // Componente de checkbox múltiple
  const MultipleCheckbox = memo(
    ({ label, checked, onPress }: MultipleCheckboxProps) => (
      <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <MaterialIcons name="check" size={16} color="#fff" />}
        </View>
        <Text style={styles.checkboxLabel}>{label}</Text>
      </TouchableOpacity>
    )
  );

  // Array de campos para grupo familiar
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'grupoFamiliar',
  });

  // Función para agregar un miembro familiar
  const addFamilyMember = useCallback(() => {
    append({
      apellidosNombres: '',
      cedula: '',
      edad: '',
      sexo: '',
      parentesco: '',
      tallaC: '',
      tallaP: '',
      tallaZ: '',
      patologias: '',
    });
  }, [append]);

  // Función para eliminar un miembro familiar
  const removeFamilyMember = useCallback(
    (index: number) => {
      if (fields.length <= 1) {
        Alert.alert(
          'No se puede eliminar',
          'Debe haber al menos un miembro del grupo familiar'
        );
        return;
      }
      remove(index);
    },
    [fields.length, remove]
  );

  // Función auxiliar para manejar checkboxes de array
  const handleArrayCheckbox = useCallback(
    (field: keyof FormData, value: string) => {
      const currentValues = (getValues(field) as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      setValue(field, newValues as any, { shouldValidate: true });
    },
    [getValues, setValue]
  );

  // Wrapper para el submit que asegura que los campos vacíos se envíen como "n/a"
  const handleSubmitWrapper = (data: FormData) => {
    const allFormValues = getValues();
    const finalData: Partial<FormData> = {};

    for (const key of Object.keys(formDefaultValues) as Array<keyof FormData>) {
      const formValue = allFormValues[key];

      if (typeof formValue === 'string' && formValue === '') {
        finalData[key] = 'n/a' as any;
      } else if (formValue !== undefined && formValue !== null) {
        finalData[key] = formValue as any;
      } else {
        finalData[key] = formDefaultValues[key] as any;
      }
    }

    finalData.codigo = user?.codigo;

    if (initialData && initialData.id) {
      finalData.id = initialData.id;
    }

    onSubmit(finalData as FormData);
  };

  // Componente de firma
  const SignatureComponent = memo(
    ({
      title,
      onSave,
      signatureValue,
    }: SignatureComponentProps & { signatureValue: string | null }) => {
      const handleSignature = (signature: string) => {
        onSave(signature);
      };

      const handleBegin = () => {
        setIsScrollEnabled(false);
      };

      const handleEnd = () => {
        setIsScrollEnabled(true);
      };

      const handleClear = () => {
        onSave(null);
      };

      return (
        <View style={styles.signatureContainer}>
          <Text style={styles.fieldLabel}>{title}</Text>
          {signatureValue ? (
            <View style={styles.signaturePreviewContainer}>
              <Image
                source={{ uri: signatureValue }}
                style={styles.signatureImage}
              />
              <TouchableOpacity
                style={styles.clearSignatureButton}
                onPress={handleClear}
              >
                <MaterialIcons name="clear" size={24} color={colors.text} />
                <Text style={styles.clearSignatureText}>Borrar Firma</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.signaturePad}>
              <Signature
                onOK={handleSignature}
                onBegin={handleBegin}
                onEnd={handleEnd}
                onClear={handleClear}
                descriptionText="Firme aquí"
                clearText="Limpiar"
                confirmText="Guardar"
                webStyle={`.m-signature-pad--footer { display: none; } .m-signature-pad { border: 1px solid #e8e8e8; height: 150px; } .m-signature-pad--body { border-bottom: 1px solid #e8e8e8; }`}
              />
            </View>
          )}
        </View>
      );
    }
  );

  // Navigation between sections
  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // botones de navegacion
  const renderSectionNavigation = () => (
    <View style={styles.navigationContainer}>
      <Button
        title="Anterior"
        onPress={goToPreviousSection}
        type="secondary"
        disabled={currentSection === 0}
        style={styles.navigationButton}
      />

      {currentSection === sections.length - 1 ? (
        <Button
          title={submitButtonText}
          onPress={handleSubmit(handleSubmitWrapper)}
          isLoading={isSubmitting}
          style={styles.navigationButton}
        />
      ) : (
        <Button
          title="Siguiente"
          onPress={goToNextSection}
          style={styles.navigationButton}
        />
      )}
    </View>
  );

  // Render progress indicator
  const renderProgress = () => (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>
        {currentSection + 1} de {sections.length}
      </Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentSection + 1) / sections.length) * 100}%` },
          ]}
        />
      </View>
    </View>
  );

  const renderFormSection = () => {
    return (
      <>
        {sections.map((section, index) => (
          <View
            key={section.id}
            style={[
              styles.sectionContainer,
              { display: currentSection === index ? 'flex' : 'none' },
            ]}
          >
            {(() => {
              switch (section.id) {
                case 'preliminary':
                  return (
                    <View>
                      {/* INFORMACIÓN PRELIMINAR */}
                      <SectionTitle title="INFORMACIÓN PRELIMINAR" />

                      {/* ⭐ NUEVO: Selector de Evento */}
                      <View style={{ marginBottom: 20 }}>
                        <Text style={styles.fieldLabel}>Evento Asociado *</Text>
                        <Controller
                          control={control}
                          name="eventoId"
                          rules={{ required: 'Debe seleccionar un evento' }}
                          render={({ field: { onChange, value } }) => (
                            <>
                              <TouchableOpacity
                                style={{
                                  borderWidth: 1,
                                  borderColor: colors.border,
                                  borderRadius: 8,
                                  padding: 12,
                                  backgroundColor: colors.card,
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                                onPress={() => setShowEventModal(true)}
                              >
                                <Text
                                  style={{
                                    color: value
                                      ? colors.text
                                      : colors.textLight,
                                  }}
                                >
                                  {selectedEventName ||
                                    'Seleccione un evento...'}
                                </Text>
                                <MaterialIcons
                                  name="arrow-drop-down"
                                  size={24}
                                  color={colors.textLight}
                                />
                              </TouchableOpacity>
                              {errors.eventoId && (
                                <Text
                                  style={{
                                    color: 'red',
                                    fontSize: 12,
                                    marginTop: 4,
                                  }}
                                >
                                  {errors.eventoId.message}
                                </Text>
                              )}

                              <Modal
                                visible={showEventModal}
                                transparent={true}
                                animationType="slide"
                                onRequestClose={() => setShowEventModal(false)}
                              >
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    padding: 20,
                                  }}
                                >
                                  <View
                                    style={{
                                      backgroundColor: colors.background,
                                      borderRadius: 12,
                                      maxHeight: '80%',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <View
                                      style={{
                                        padding: 16,
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.border,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontSize: 18,
                                          fontWeight: 'bold',
                                          color: colors.text,
                                        }}
                                      >
                                        Seleccionar Evento
                                      </Text>
                                      <TouchableOpacity
                                        onPress={() => setShowEventModal(false)}
                                      >
                                        <MaterialIcons
                                          name="close"
                                          size={24}
                                          color={colors.text}
                                        />
                                      </TouchableOpacity>
                                    </View>

                                    <ScrollView style={{ padding: 16 }}>
                                      {isLoadingEventos ? (
                                        <Text
                                          style={{
                                            textAlign: 'center',
                                            padding: 20,
                                          }}
                                        >
                                          Cargando eventos...
                                        </Text>
                                      ) : eventos.length === 0 ? (
                                        <Text
                                          style={{
                                            textAlign: 'center',
                                            padding: 20,
                                            color: colors.textLight,
                                          }}
                                        >
                                          No hay eventos activos disponibles
                                        </Text>
                                      ) : (
                                        eventos.map((evento) => (
                                          <TouchableOpacity
                                            key={evento.id}
                                            style={{
                                              padding: 16,
                                              borderBottomWidth: 1,
                                              borderBottomColor: colors.border,
                                              backgroundColor:
                                                value === evento.id
                                                  ? colors.primary + '20'
                                                  : 'transparent',
                                            }}
                                            onPress={() => {
                                              onChange(evento.id);
                                              setSelectedEventName(
                                                evento.nombre
                                              );
                                              setShowEventModal(false);
                                            }}
                                          >
                                            <Text
                                              style={{
                                                fontSize: 16,
                                                fontWeight: 'bold',
                                                color:
                                                  value === evento.id
                                                    ? colors.primary
                                                    : colors.text,
                                              }}
                                            >
                                              {evento.nombre}
                                            </Text>
                                            <Text
                                              style={{
                                                fontSize: 12,
                                                color: colors.textLight,
                                                marginTop: 4,
                                              }}
                                            >
                                              {evento.tipoEvento} -{' '}
                                              {evento.estado}
                                            </Text>
                                          </TouchableOpacity>
                                        ))
                                      )}
                                    </ScrollView>
                                  </View>
                                </View>
                              </Modal>
                            </>
                          )}
                        />
                      </View>

                      <View style={styles.checkboxGroup}>
                        <Controller
                          control={control}
                          name="informacionPreliminar"
                          render={({ field: { onChange, value } }) => (
                            <>
                              <Checkbox
                                label="A-Afectación Leve"
                                checked={value === InformacionPreliminar.LEVE}
                                onPress={() =>
                                  onChange(InformacionPreliminar.LEVE)
                                }
                              />
                              <Checkbox
                                label="B-Afectación Grave"
                                checked={value === InformacionPreliminar.GRAVE}
                                onPress={() =>
                                  onChange(InformacionPreliminar.GRAVE)
                                }
                              />
                              <Checkbox
                                label="C-Pérdida Total"
                                checked={value === InformacionPreliminar.TOTAL}
                                onPress={() =>
                                  onChange(InformacionPreliminar.TOTAL)
                                }
                              />
                              <Checkbox
                                label="D-En Riesgo"
                                checked={value === InformacionPreliminar.RIESGO}
                                onPress={() =>
                                  onChange(InformacionPreliminar.RIESGO)
                                }
                              />
                              <Checkbox
                                label="E-Aislada"
                                checked={
                                  value === InformacionPreliminar.AISLADA
                                }
                                onPress={() =>
                                  onChange(InformacionPreliminar.AISLADA)
                                }
                              />
                            </>
                          )}
                        />
                      </View>
                    </View>
                  );

                case 'location':
                  return (
                    <View>
                      {/* INFORMACIÓN DE UBICACIÓN */}
                      <SectionTitle title="UBICACIÓN" />
                      <Controller
                        control={control}
                        name="estado"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Estado"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="municipio"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Municipio"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="parroquia"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Parroquia"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="cuadranteDePaz"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Cuadrante de Paz"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="urbanizacion"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Urbanización"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="calle"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Calle"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="casa"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Casa"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="barrioSector"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Barrio/Sector"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="vereda"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Vereda"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="apto"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Apto"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="avenida"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Avenida"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                    </View>
                  );

                case 'coordenadas':
                  return (
                    <View>
                      {/* COORDENADAS GEOGRÁFICAS */}
                      <SectionTitle title="COORDENADAS GEOGRÁFICAS" />
                      <Controller
                        control={control}
                        name="latitud"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Latitud"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="numeric"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="longitud"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Longitud"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="numeric"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="cota"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Cota"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="numeric"
                          />
                        )}
                      />

                      {/* COORDENADAS UTM */}
                      <SectionTitle title="COORDENADAS UTM" />
                      <Controller
                        control={control}
                        name="este"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Este"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="numeric"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="norte"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Norte"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="numeric"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="huso"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Huso"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="numeric"
                          />
                        )}
                      />
                    </View>
                  );

                case 'estructura':
                  return (
                    <View>
                      {/* USO DE LA ESTRUCTURA */}
                      <SectionTitle title="USO DE LA ESTRUCTURA" />
                      <View style={styles.checkboxGroup}>
                        <Controller
                          control={control}
                          name="usoEstructura"
                          render={({ field: { onChange, value } }) => (
                            <>
                              <Checkbox
                                label="Unifamiliar"
                                checked={value === UsoEstructura.UNIFAMILIAR}
                                onPress={() =>
                                  onChange(UsoEstructura.UNIFAMILIAR)
                                }
                              />
                              <Checkbox
                                label="Multifamiliar"
                                checked={value === UsoEstructura.MULTIFAMILIAR}
                                onPress={() =>
                                  onChange(UsoEstructura.MULTIFAMILIAR)
                                }
                              />
                              <Checkbox
                                label="Mixta"
                                checked={value === UsoEstructura.MIXTA}
                                onPress={() => onChange(UsoEstructura.MIXTA)}
                              />
                              <Checkbox
                                label="Otros"
                                checked={value === UsoEstructura.OTROS}
                                onPress={() => onChange(UsoEstructura.OTROS)}
                              />
                            </>
                          )}
                        />
                      </View>
                      {formValues.usoEstructura === UsoEstructura.OTROS && (
                        <Controller
                          control={control}
                          name="otrosUsoEstructura"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                              label="Especifique"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              placeholder="Especifique el uso de la estructura"
                            />
                          )}
                        />
                      )}
                    </View>
                  );

                case 'evento':
                  return (
                    <View>
                      <SectionTitle title="INFORMACIÓN DEL EVENTO" />
                      <Controller
                        control={control}
                        name="tipoEvento"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Tipo de Evento"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="horaEvento"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Hora de Ocurrencia del Evento"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="HH:MM"
                          />
                        )}
                      />
                    </View>
                  );

                case 'jefecalle':
                  return (
                    <View>
                      <SectionTitle title="JEFE DE CALLE" />
                      <Controller
                        control={control}
                        name="apellidosJefe"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Apellidos"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="nombresJefe"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Nombres"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="telefonoJefe"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Número de Teléfono"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="+58 XXX XXXXXXX"
                            keyboardType="phone-pad"
                          />
                        )}
                      />
                    </View>
                  );

                case 'vivienda':
                  return (
                    <View>
                      <SectionTitle title="CONDICIÓN DE VIVIENDA" />
                      <View style={styles.checkboxGroup}>
                        <Controller
                          control={control}
                          name="condicionVivienda"
                          render={({ field: { onChange, value } }) => (
                            <>
                              <Checkbox
                                label="Propia"
                                checked={value === CondicionVivienda.PROPIA}
                                onPress={() =>
                                  onChange(CondicionVivienda.PROPIA)
                                }
                              />
                              <Checkbox
                                label="Alquilada"
                                checked={value === CondicionVivienda.ALQUILADA}
                                onPress={() =>
                                  onChange(CondicionVivienda.ALQUILADA)
                                }
                              />
                              <Checkbox
                                label="Otros"
                                checked={value === CondicionVivienda.OTROS}
                                onPress={() =>
                                  onChange(CondicionVivienda.OTROS)
                                }
                              />
                            </>
                          )}
                        />
                      </View>

                      {formValues.condicionVivienda ===
                        CondicionVivienda.OTROS && (
                        <Controller
                          control={control}
                          name="otrosCondicionVivienda"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                              label="Especifique"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              placeholder="Especifique la condición de vivienda"
                            />
                          )}
                        />
                      )}
                      {/* VÍAS DE ACCESO */}
                      <SectionTitle title="VÍAS DE ACCESO" />
                      <SubsectionTitle title="Tipo de Vía" />
                      <View style={styles.checkboxGroup}>
                        <Controller
                          control={control}
                          name="viasAcceso"
                          render={({ field: { value } }) => (
                            <>
                              <MultipleCheckbox
                                label="Terrestre"
                                checked={(value || []).includes('terrestre')}
                                onPress={() =>
                                  handleArrayCheckbox('viasAcceso', 'terrestre')
                                }
                              />
                              <MultipleCheckbox
                                label="Aérea"
                                checked={(value || []).includes('aerea')}
                                onPress={() =>
                                  handleArrayCheckbox('viasAcceso', 'aerea')
                                }
                              />
                              <MultipleCheckbox
                                label="Fluvial"
                                checked={(value || []).includes('fluvial')}
                                onPress={() =>
                                  handleArrayCheckbox('viasAcceso', 'fluvial')
                                }
                              />
                              <MultipleCheckbox
                                label="Otros"
                                checked={(value || []).includes('otros')}
                                onPress={() =>
                                  handleArrayCheckbox('viasAcceso', 'otros')
                                }
                              />
                            </>
                          )}
                        />
                      </View>

                      {(formValues.viasAcceso || []).includes('otros') && (
                        <Controller
                          control={control}
                          name="otrosViasAcceso"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                              label="Especifique"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              placeholder="Especifique las vías de acceso"
                            />
                          )}
                        />
                      )}

                      <SubsectionTitle title="Condición" />
                      <View style={styles.checkboxGroup}>
                        <Controller
                          control={control}
                          name="condicionAcceso"
                          render={({ field: { onChange, value } }) => (
                            <>
                              <Checkbox
                                label="Transitable"
                                checked={value === CondicionAcceso.TRANSITABLE}
                                onPress={() =>
                                  onChange(CondicionAcceso.TRANSITABLE)
                                }
                              />
                              <Checkbox
                                label="Intransitable"
                                checked={
                                  value === CondicionAcceso.INTRANSITABLE
                                }
                                onPress={() =>
                                  onChange(CondicionAcceso.INTRANSITABLE)
                                }
                              />
                              <Checkbox
                                label="Paso regulado"
                                checked={value === CondicionAcceso.REGULADO}
                                onPress={() =>
                                  onChange(CondicionAcceso.REGULADO)
                                }
                              />
                              <Checkbox
                                label="Otros"
                                checked={value === CondicionAcceso.OTROS}
                                onPress={() => onChange(CondicionAcceso.OTROS)}
                              />
                            </>
                          )}
                        />
                      </View>

                      {formValues.condicionAcceso === CondicionAcceso.OTROS && (
                        <Controller
                          control={control}
                          name="otrosCondicionAcceso"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                              label="Especifique"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              placeholder="Especifique la condición de acceso"
                            />
                          )}
                        />
                      )}
                    </View>
                  );

                case 'familia':
                  return (
                    <View>
                      {/* CARGA FAMILIAR */}
                      <SectionTitle title="CARGA FAMILIAR" />
                      <Controller
                        control={control}
                        name="jefeFamilia"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Jefe de Familia"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="edadJefe"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Edad"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="numeric"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="sexoJefe"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Sexo"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="cedulaJefe"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Cédula de Identidad"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />

                      <SubsectionTitle title="TALLAS" />
                      <View style={styles.tallaContainer}>
                        <View style={styles.tallaField}>
                          <Text style={styles.fieldLabel}>C</Text>
                          <Controller
                            control={control}
                            name="tallaC"
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <TextField
                                label=""
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                              />
                            )}
                          />
                        </View>
                        <View style={styles.tallaField}>
                          <Text style={styles.fieldLabel}>P</Text>
                          <Controller
                            control={control}
                            name="tallaP"
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <TextField
                                label=""
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                              />
                            )}
                          />
                        </View>
                        <View style={styles.tallaField}>
                          <Text style={styles.fieldLabel}>Z</Text>
                          <Controller
                            control={control}
                            name="tallaZ"
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <TextField
                                label=""
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                              />
                            )}
                          />
                        </View>
                      </View>

                      <Controller
                        control={control}
                        name="telefonoJefe"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Nº de Teléfono"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="phone-pad"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="patologiasJefe"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextArea
                            label="Patologías Médicas y Medicamento Primordiales"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />

                      {/* COMPOSICIÓN DEL GRUPO FAMILIAR */}
                      <SectionTitle title="COMPOSICIÓN DEL GRUPO FAMILIAR" />

                      {fields.map((field, index) => (
                        <View
                          key={field.id}
                          style={styles.familyMemberContainer}
                        >
                          <View style={styles.familyMemberHeader}>
                            <Text style={styles.familyMemberTitle}>
                              Miembro {index + 1}
                            </Text>
                            <TouchableOpacity
                              style={styles.deleteButton}
                              onPress={() => removeFamilyMember(index)}
                            >
                              <Feather
                                name="trash-2"
                                size={20}
                                color="#d32f2f"
                              />
                            </TouchableOpacity>
                          </View>

                          <Controller
                            control={control}
                            name={`grupoFamiliar.${index}.apellidosNombres`}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <TextField
                                label="Apellidos y Nombres"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                              />
                            )}
                          />
                          <Controller
                            control={control}
                            name={`grupoFamiliar.${index}.cedula`}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <TextField
                                label="Cédula de Identidad"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                              />
                            )}
                          />
                          <Controller
                            control={control}
                            name={`grupoFamiliar.${index}.edad`}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <TextField
                                label="Edad"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                keyboardType="numeric"
                              />
                            )}
                          />
                          <Controller
                            control={control}
                            name={`grupoFamiliar.${index}.sexo`}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <TextField
                                label="Sexo"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                              />
                            )}
                          />
                          <Controller
                            control={control}
                            name={`grupoFamiliar.${index}.parentesco`}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <TextField
                                label="Parentesco"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                              />
                            )}
                          />

                          <SubsectionTitle title="TALLAS" />
                          <View style={styles.tallaContainer}>
                            <View style={styles.tallaField}>
                              <Text style={styles.fieldLabel}>C</Text>
                              <Controller
                                control={control}
                                name={`grupoFamiliar.${index}.tallaC`}
                                render={({
                                  field: { onChange, onBlur, value },
                                }) => (
                                  <TextField
                                    label=""
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                  />
                                )}
                              />
                            </View>
                            <View style={styles.tallaField}>
                              <Text style={styles.fieldLabel}>P</Text>
                              <Controller
                                control={control}
                                name={`grupoFamiliar.${index}.tallaP`}
                                render={({
                                  field: { onChange, onBlur, value },
                                }) => (
                                  <TextField
                                    label=""
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                  />
                                )}
                              />
                            </View>
                            <View style={styles.tallaField}>
                              <Text style={styles.fieldLabel}>Z</Text>
                              <Controller
                                control={control}
                                name={`grupoFamiliar.${index}.tallaZ`}
                                render={({
                                  field: { onChange, onBlur, value },
                                }) => (
                                  <TextField
                                    label=""
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                  />
                                )}
                              />
                            </View>
                          </View>

                          <Controller
                            control={control}
                            name={`grupoFamiliar.${index}.patologias`}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <TextArea
                                label="Patologías Médicas y Medicamento Primordiales"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                              />
                            )}
                          />
                        </View>
                      ))}
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={addFamilyMember}
                      >
                        <FontAwesome5 name="user-plus" size={16} color="#fff" />
                        <Text style={styles.addButtonText}>
                          Agregar Miembro Familiar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );

                case 'fdesalojada':
                  return (
                    <View>
                      {/* FAMILIA DESALOJADA */}
                      <SectionTitle title="FAMILIA DESALOJADA" />
                      <View style={styles.checkboxGroup}>
                        <Controller
                          control={control}
                          name="viviendaSolidaria"
                          render={({ field: { onChange, value } }) => (
                            <MultipleCheckbox
                              label="Vivienda Solidaria"
                              checked={value}
                              onPress={() => onChange(!value)}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="albergue"
                          render={({ field: { onChange, value } }) => (
                            <MultipleCheckbox
                              label="Albergue"
                              checked={value}
                              onPress={() => onChange(!value)}
                            />
                          )}
                        />
                      </View>

                      <Controller
                        control={control}
                        name="telefonoContactoAlbergue"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Nº Tlf Contacto"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="phone-pad"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="direccionAlbergue"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Dirección"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="nombreResponsableAlbergue"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Nombre del Responsable"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="cedulaResponsableAlbergue"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Cédula de Identidad"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                    </View>
                  );

                case 'evaluacion':
                  return (
                    <View>
                      {/* EVALUACIÓN ESTRUCTURAL */}
                      <SectionTitle title="EVALUACIÓN ESTRUCTURAL" />
                      <SubsectionTitle title="TIPOS DE MATERIALES DE CONSTRUCCIÓN" />
                      <Controller
                        control={control}
                        name="materialesConstruccion"
                        render={({ field: { value } }) => (
                          <View style={styles.multiSelectContainer}>
                            <View style={styles.multiSelectColumn}>
                              <MultipleCheckbox
                                label="Cemento"
                                checked={(value || []).includes('cemento')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'cemento'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Bloque"
                                checked={(value || []).includes('bloque')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'bloque'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Ladrillo"
                                checked={(value || []).includes('ladrillo')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'ladrillo'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Concreto"
                                checked={(value || []).includes('concreto')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'concreto'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Adobe"
                                checked={(value || []).includes('adobe')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'adobe'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Tapia"
                                checked={(value || []).includes('tapia')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'tapia'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Armado"
                                checked={(value || []).includes('armado')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'armado'
                                  )
                                }
                              />
                            </View>
                            <View style={styles.multiSelectColumn}>
                              <MultipleCheckbox
                                label="Bareque"
                                checked={(value || []).includes('bareque')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'bareque'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Polietileno"
                                checked={(value || []).includes('polietileno')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'polietileno'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Plástico"
                                checked={(value || []).includes('plastico')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'plastico'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Cartón"
                                checked={(value || []).includes('carton')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'carton'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Madera"
                                checked={(value || []).includes('madera')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'madera'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Lata"
                                checked={(value || []).includes('lata')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'lata'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Machimbrado"
                                checked={(value || []).includes('machimbrado')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'machimbrado'
                                  )
                                }
                              />
                            </View>
                            <View style={styles.multiSelectColumn}>
                              <MultipleCheckbox
                                label="Columnas"
                                checked={(value || []).includes('columnas')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'columnas'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Zinc"
                                checked={(value || []).includes('zinc')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'zinc'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Vigas"
                                checked={(value || []).includes('vigas')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'vigas'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Tejas"
                                checked={(value || []).includes('tejas')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'tejas'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Acerolit"
                                checked={(value || []).includes('acerolit')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'acerolit'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Mixtas"
                                checked={(value || []).includes('mixtas')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'materialesConstruccion',
                                    'mixtas'
                                  )
                                }
                              />
                            </View>
                          </View>
                        )}
                      />

                      {(formValues.materialesConstruccion || []).includes(
                        'mixtas'
                      ) && (
                        <Controller
                          control={control}
                          name="otrosMaterialesConstruccion"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                              label="Especifique"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              placeholder="Especifique los materiales de construcción"
                            />
                          )}
                        />
                      )}
                    </View>
                  );

                case 'afectaciones':
                  return (
                    <View>
                      {/* AFECTACIONES */}
                      <SectionTitle title="AFECTACIONES" />
                      <SubsectionTitle title="NO ESTRUCTURAL" />
                      <Controller
                        control={control}
                        name="afectacionesNoEstructurales"
                        render={({ field: { value } }) => (
                          <View style={styles.multiSelectContainer}>
                            <View style={styles.multiSelectColumn}>
                              <MultipleCheckbox
                                label="Puertas"
                                checked={(value || []).includes('puertas')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesNoEstructurales',
                                    'puertas'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Ventanas"
                                checked={(value || []).includes('ventanas')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesNoEstructurales',
                                    'ventanas'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Rejas"
                                checked={(value || []).includes('rejas')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesNoEstructurales',
                                    'rejas'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Cielos rasos"
                                checked={(value || []).includes('cielosRasos')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesNoEstructurales',
                                    'cielosRasos'
                                  )
                                }
                              />
                            </View>
                            <View style={styles.multiSelectColumn}>
                              <MultipleCheckbox
                                label="Divisiones"
                                checked={(value || []).includes('divisiones')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesNoEstructurales',
                                    'divisiones'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Pocetas"
                                checked={(value || []).includes('pocetas')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesNoEstructurales',
                                    'pocetas'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Lavamanos"
                                checked={(value || []).includes('lavamanos')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesNoEstructurales',
                                    'lavamanos'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Lavaplatos"
                                checked={(value || []).includes('lavaplatos')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesNoEstructurales',
                                    'lavaplatos'
                                  )
                                }
                              />
                            </View>
                            <View style={styles.multiSelectColumn}>
                              <MultipleCheckbox
                                label="Griferías"
                                checked={(value || []).includes('griferias')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesNoEstructurales',
                                    'griferias'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Ductos"
                                checked={(value || []).includes('ductos')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesNoEstructurales',
                                    'ductos'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Escaleras"
                                checked={(value || []).includes('escaleras')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesNoEstructurales',
                                    'escaleras'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Pasamanos"
                                checked={(value || []).includes('pasamanos')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesNoEstructurales',
                                    'pasamanos'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Otros"
                                checked={(value || []).includes('otros')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesNoEstructurales',
                                    'otros'
                                  )
                                }
                              />
                            </View>
                          </View>
                        )}
                      />

                      {(formValues.afectacionesNoEstructurales || []).includes(
                        'otros'
                      ) && (
                        <Controller
                          control={control}
                          name="otrosNoEstructurales"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                              label="Especifique"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              placeholder="Especifique otras afectaciones no estructurales"
                            />
                          )}
                        />
                      )}

                      <SubsectionTitle title="ESTRUCTURALES" />
                      <SubsectionTitle title="Colapso" />
                      <Controller
                        control={control}
                        name="afectacionesEstructuralesColapso"
                        render={({ field: { value } }) => (
                          <View style={styles.multiSelectContainer}>
                            <View style={styles.multiSelectColumn}>
                              <MultipleCheckbox
                                label="Techo"
                                checked={(value || []).includes('techo')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesEstructuralesColapso',
                                    'techo'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Pared"
                                checked={(value || []).includes('pared')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesEstructuralesColapso',
                                    'pared'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Piso"
                                checked={(value || []).includes('piso')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesEstructuralesColapso',
                                    'piso'
                                  )
                                }
                              />
                            </View>
                            <View style={styles.multiSelectColumn}>
                              <MultipleCheckbox
                                label="Fisuras"
                                checked={(value || []).includes('fisuras')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesEstructuralesColapso',
                                    'fisuras'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Grietas"
                                checked={(value || []).includes('grietas')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesEstructuralesColapso',
                                    'grietas'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Otros"
                                checked={(value || []).includes('otros')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesEstructuralesColapso',
                                    'otros'
                                  )
                                }
                              />
                            </View>
                          </View>
                        )}
                      />

                      {(
                        formValues.afectacionesEstructuralesColapso || []
                      ).includes('otros') && (
                        <Controller
                          control={control}
                          name="otrosEstructuralesColapso"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                              label="Especifique"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              placeholder="Especifique otras afectaciones estructurales"
                            />
                          )}
                        />
                      )}

                      <SubsectionTitle title="Afectación Parcial" />
                      <Controller
                        control={control}
                        name="afectacionesParciales"
                        render={({ field: { value } }) => (
                          <View style={styles.multiSelectContainer}>
                            <View style={styles.multiSelectColumn}>
                              <MultipleCheckbox
                                label="Techo"
                                checked={(value || []).includes('techo')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesParciales',
                                    'techo'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Pared"
                                checked={(value || []).includes('pared')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesParciales',
                                    'pared'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Piso"
                                checked={(value || []).includes('piso')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesParciales',
                                    'piso'
                                  )
                                }
                              />
                            </View>
                            <View style={styles.multiSelectColumn}>
                              <MultipleCheckbox
                                label="Filtraciones"
                                checked={(value || []).includes('filtraciones')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesParciales',
                                    'filtraciones'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Humedad"
                                checked={(value || []).includes('humedad')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesParciales',
                                    'humedad'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Otros"
                                checked={(value || []).includes('otros')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'afectacionesParciales',
                                    'otros'
                                  )
                                }
                              />
                            </View>
                          </View>
                        )}
                      />

                      {(formValues.afectacionesParciales || []).includes(
                        'otros'
                      ) && (
                        <Controller
                          control={control}
                          name="otrosAfectacionesParciales"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                              label="Especifique"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              placeholder="Especifique otras afectaciones parciales"
                            />
                          )}
                        />
                      )}
                    </View>
                  );

                case 'p_enseres':
                  return (
                    <View>
                      {/* PÉRDIDAS DE ENSERES */}
                      <SectionTitle title="PÉRDIDAS DE ENSERES" />
                      <Controller
                        control={control}
                        name="perdidasEnseres"
                        render={({ field: { value } }) => (
                          <View style={styles.multiSelectContainer}>
                            <View style={styles.multiSelectColumn}>
                              <MultipleCheckbox
                                label="Cocina"
                                checked={(value || []).includes('cocina')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'perdidasEnseres',
                                    'cocina'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Licuadora"
                                checked={(value || []).includes('licuadora')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'perdidasEnseres',
                                    'licuadora'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Lavadora"
                                checked={(value || []).includes('lavadora')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'perdidasEnseres',
                                    'lavadora'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Nevera"
                                checked={(value || []).includes('nevera')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'perdidasEnseres',
                                    'nevera'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Utensilios de cocina"
                                checked={(value || []).includes(
                                  'utensiliosCocina'
                                )}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'perdidasEnseres',
                                    'utensiliosCocina'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Televisor"
                                checked={(value || []).includes('televisor')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'perdidasEnseres',
                                    'televisor'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Colchón"
                                checked={(value || []).includes('colchon')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'perdidasEnseres',
                                    'colchon'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Cama"
                                checked={(value || []).includes('cama')}
                                onPress={() =>
                                  handleArrayCheckbox('perdidasEnseres', 'cama')
                                }
                              />
                            </View>
                            <View style={styles.multiSelectColumn}>
                              <MultipleCheckbox
                                label="Aire Acondicionado"
                                checked={(value || []).includes(
                                  'aireAcondicionado'
                                )}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'perdidasEnseres',
                                    'aireAcondicionado'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Ventilador"
                                checked={(value || []).includes('ventilador')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'perdidasEnseres',
                                    'ventilador'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Guarda ropa"
                                checked={(value || []).includes('guardaropa')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'perdidasEnseres',
                                    'guardaropa'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Muebles"
                                checked={(value || []).includes('muebles')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'perdidasEnseres',
                                    'muebles'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Escaparate"
                                checked={(value || []).includes('escaparate')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'perdidasEnseres',
                                    'escaparate'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Comedor"
                                checked={(value || []).includes('comedor')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'perdidasEnseres',
                                    'comedor'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Sillas"
                                checked={(value || []).includes('sillas')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'perdidasEnseres',
                                    'sillas'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Otros"
                                checked={(value || []).includes('otros')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'perdidasEnseres',
                                    'otros'
                                  )
                                }
                              />
                            </View>
                          </View>
                        )}
                      />

                      {(formValues.perdidasEnseres || []).includes('otros') && (
                        <Controller
                          control={control}
                          name="otrosPerdidasEnseres"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                              label="Especifique"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              placeholder="Especifique otras pérdidas de enseres"
                            />
                          )}
                        />
                      )}
                    </View>
                  );

                case 'vitales':
                  return (
                    <View>
                      {/* LÍNEAS VITALES AFECTADAS */}
                      <SectionTitle title="LÍNEAS VITALES AFECTADAS" />
                      <Controller
                        control={control}
                        name="lineasVitalesAfectadas"
                        render={({ field: { value } }) => (
                          <View style={styles.multiSelectContainer}>
                            <View style={styles.multiSelectColumn}>
                              <MultipleCheckbox
                                label="Electricidad"
                                checked={(value || []).includes('electricidad')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'lineasVitalesAfectadas',
                                    'electricidad'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Vialidad"
                                checked={(value || []).includes('vialidad')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'lineasVitalesAfectadas',
                                    'vialidad'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Aguas Servidas"
                                checked={(value || []).includes(
                                  'aguasServidas'
                                )}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'lineasVitalesAfectadas',
                                    'aguasServidas'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Aguas Potable"
                                checked={(value || []).includes('aguasPotable')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'lineasVitalesAfectadas',
                                    'aguasPotable'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Aguas Pluviales"
                                checked={(value || []).includes(
                                  'aguasPluviales'
                                )}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'lineasVitalesAfectadas',
                                    'aguasPluviales'
                                  )
                                }
                              />
                            </View>
                            <View style={styles.multiSelectColumn}>
                              <MultipleCheckbox
                                label="Internet"
                                checked={(value || []).includes('internet')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'lineasVitalesAfectadas',
                                    'internet'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="CANTV"
                                checked={(value || []).includes('cantv')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'lineasVitalesAfectadas',
                                    'cantv'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Movilnet"
                                checked={(value || []).includes('movilnet')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'lineasVitalesAfectadas',
                                    'movilnet'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Movistar"
                                checked={(value || []).includes('movistar')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'lineasVitalesAfectadas',
                                    'movistar'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Digitel"
                                checked={(value || []).includes('digitel')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'lineasVitalesAfectadas',
                                    'digitel'
                                  )
                                }
                              />
                              <MultipleCheckbox
                                label="Otros"
                                checked={(value || []).includes('otros')}
                                onPress={() =>
                                  handleArrayCheckbox(
                                    'lineasVitalesAfectadas',
                                    'otros'
                                  )
                                }
                              />
                            </View>
                          </View>
                        )}
                      />

                      {(formValues.lineasVitalesAfectadas || []).includes(
                        'otros'
                      ) && (
                        <Controller
                          control={control}
                          name="otrosLineasVitalesAfectadas"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                              label="Especifique"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              placeholder="Especifique otras líneas vitales afectadas"
                            />
                          )}
                        />
                      )}

                      {/* TIPO DE AFECTACIÓN DE LA VIVIENDA */}
                      <SectionTitle title="TIPO DE AFECTACIÓN DE LA VIVIENDA" />
                      <Controller
                        control={control}
                        name="observaciones"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextArea
                            label="OBSERVACIONES"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="Ingrese observaciones sobre la afectación de la vivienda"
                          />
                        )}
                      />
                    </View>
                  );

                case 'evaluado':
                  return (
                    <View>
                      {/* DATOS DEL EVALUADO (AFECTADO) */}
                      <SectionTitle title="DATOS DEL EVALUADO (AFECTADO)" />
                      <Controller
                        control={control}
                        name="nombreEvaluado"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Nombre"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="cedulaEvaluado"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="C.I. V-"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="telefonoEvaluado"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            label="Tlf"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="phone-pad"
                          />
                        )}
                      />
                    </View>
                  );

                case 'fotos':
                  return (
                    <View>
                      <SectionTitle title="EVIDENCIA FOTOGRÁFICA" />
                      <Controller
                        control={control}
                        name="fotoFamiliarFile"
                        render={({ field: { onChange, value } }) => (
                          <ImagePicker
                            title="Foto del Grupo Familiar (Fachada de la Vivienda)"
                            onImageSelected={onChange}
                            initialImage={value}
                          />
                        )}
                      />

                      <SectionTitle title="Fotos Adicionales" />
                      <Controller
                        control={control}
                        name="fotosAdicionalesFiles"
                        render={({
                          field: { onChange, value: files = [] },
                        }) => (
                          <View>
                            {files.map((fileUri, index) => (
                              <View key={index} style={styles.imageContainer}>
                                <Image
                                  source={{ uri: fileUri }}
                                  style={styles.additionalImage}
                                />
                                <TouchableOpacity
                                  style={styles.removeImageButton}
                                  onPress={() => {
                                    const newFiles = files.filter(
                                      (_, i) => i !== index
                                    );
                                    onChange(newFiles);
                                  }}
                                >
                                  <MaterialIcons
                                    name="close"
                                    size={24}
                                    color="#fff"
                                  />
                                </TouchableOpacity>
                              </View>
                            ))}
                            <ImagePicker
                              title="Añadir Foto Adicional"
                              onImageSelected={(newImageUri) => {
                                if (newImageUri) {
                                  onChange([...files, newImageUri]);
                                }
                              }}
                            />
                          </View>
                        )}
                      />
                    </View>
                  );

                case 'evaluador':
                  return (
                    <View>
                      {/* FIRMAS */}
                      <SectionTitle title="FIRMAS" />
                      <Controller
                        control={control}
                        name="firmaEvaluado"
                        render={({ field: { onChange, value } }) => (
                          <SignatureComponent
                            title="Firma del Evaluado"
                            onSave={(signature) => onChange(signature)}
                            signatureValue={value}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="firmaEvaluador"
                        render={({ field: { onChange, value } }) => (
                          <SignatureComponent
                            title="Firma del Evaluador"
                            onSave={(signature) => onChange(signature)}
                            signatureValue={value}
                          />
                        )}
                      />
                    </View>
                  );

                default:
                  return null;
              }
            })()}
          </View>
        ))}
      </>
    );
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {renderProgress()}

      <ScrollView
        scrollEnabled={isScrollEnabled}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        // Estas propiedades son cruciales para la estabilidad en formularios largos.
        // removeClippedSubviews={false} evita que los campos pierdan su estado al salir de la pantalla.
        removeClippedSubviews={false}
        keyboardDismissMode="on-drag"
      >
        {renderFormSection()}
      </ScrollView>

      {renderSectionNavigation()}

      <NetworkStatus />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navigationButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  sectionContainer: {},
  checkboxGroup: {
    marginBottom: 15,
  },
  checkboxChecked: {
    backgroundColor: '#3498db',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
  },
  tallaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  tallaField: {
    flex: 1,
    marginRight: 10,
  },
  familyMemberContainer: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  familyMemberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  familyMemberTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  deleteButton: {
    padding: 5,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signatureContainer: {
    marginBottom: 20,
  },
  signaturePad: {
    borderWidth: 1,
    borderColor: '#ddd',
    height: 150,
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
  },
  signaturePreviewContainer: {
    height: 150,
    backgroundColor: colors.inputBackground,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
  clearSignatureButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 5,
  },
  clearSignatureText: {
    color: colors.text,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  multiSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  multiSelectColumn: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  additionalImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    backgroundColor: colors.inputBackground,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    padding: 5,
  },
});
