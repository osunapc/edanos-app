import React, { memo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Signature from 'react-native-signature-canvas';
import colors from '../../constants/colors';
import Button from './Button';
import { SignatureComponentProps } from '../../types/evaluation';

const SignatureCapture = memo(({ title, onSave }: SignatureComponentProps) => {
  const [signature, setSignature] = useState<string | null>(null);
  const [signatureRef, setSignatureRef] = useState<any>(null);

  const handleSignature = (sig: string) => {
    setSignature(sig);
    onSave(sig);
  };

  const handleClear = () => {
    if (signatureRef) {
      signatureRef.clearSignature();
    }
    setSignature(null);
    onSave(null);
  };

  const style = `.m-signature-pad--footer {
    display: none;
  }
  .m-signature-pad {
    border: 1px solid #e8e8e8;
    height: 150px;
  }
  .m-signature-pad--body {
    border-bottom: 1px solid #e8e8e8;
  }`;

  return (
    <View style={styles.signatureContainer}>
      <Text style={styles.fieldLabel}>{title}</Text>
      <View style={styles.signaturePad}>
        <Signature
          onOK={handleSignature}
          onEmpty={() => console.log('Signature empty')}
          descriptionText="Firme aquí"
          clearText="Limpiar"
          confirmText="Guardar"
          webStyle={style}
          ref={(ref) => setSignatureRef(ref)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="Limpiar Firma" 
          onPress={handleClear} 
          type="secondary" 
          disabled={!signature}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  signatureContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  signaturePad: {
    borderWidth: 1,
    borderColor: colors.border,
    height: 150,
    backgroundColor: colors.card,
    borderRadius: 5,
    overflow: 'hidden',
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default SignatureCapture;