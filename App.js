import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';

import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

const DecibelMeterScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [decibelLevel, setDecibelLevel] = useState(0);
  let recording = null;

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setDecibelLevel(0);

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to record audio denied');
        setIsRecording(false);
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recordingOptions = {
        android: {
          extension: '.mp4',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 256000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 256000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        isMeteringEnabled: true
      };

      recording = new Audio.Recording();
      await recording.prepareToRecordAsync(recordingOptions);
      recording.setOnRecordingStatusUpdate(onRecordingStatusUpdate);
      await recording.startAsync();
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setDecibelLevel(0);

    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording URI:', uri);
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  };

  const onRecordingStatusUpdate = (status) => {
    if (status.isRecording) {
      console.log(status.metering);
      const decibels = calculateDecibelLevel(status.metering);
      setDecibelLevel(decibels);
    }
  };

  const calculateDecibelLevel = (status) => {
    // Implementa tu lógica para calcular el nivel de decibelios aquí.
    // Puedes utilizar la propiedad 'status' para obtener los datos de audio y calcular los decibelios.

    // Este es solo un ejemplo simple que asigna un valor aleatorio como nivel de decibelios.
    const decibels = status + 70; 

    return Math.round(decibels);
  };

  const getColor = () => {
    if (decibelLevel < 10) {
      return '#ffffcc'; // respiracion
    } else if (decibelLevel < 40) {
      return '#88ff44'; // conversacion
    } else if (decibelLevel < 60) {
      return '#44ff00'; // mucha gente
    } else if (decibelLevel < 70) {
      return '#44ff00'; // aspiradora
    } else if (decibelLevel < 80) {
      return '#ccff00'; // tren
    } else if (decibelLevel < 90) {
      return '#ffff00'; // trafico
    } else if (decibelLevel < 100) {
      return '#ffcc00'; // taladro
    } else if (decibelLevel < 110) {
      return '#ff8800'; // recital
    } else if (decibelLevel < 120) {
      return '#ff4400'; // bomba de estruendo
    } else {
      return 'red'; // avion
    }
  }

  const getQue = () => {
    if (decibelLevel < 10) {
      return 'Respiración'; // respiracion
    } else if (decibelLevel < 40) {
      return 'Conversación'; // conversacion
    } else if (decibelLevel < 60) {
      return 'Mucha gente'; // mucha gente
    } else if (decibelLevel < 70) {
      return 'Aspiradora'; // aspiradora
    } else if (decibelLevel < 80) {
      return 'Tren'; // tren
    } else if (decibelLevel < 90) {
      return 'Tráfico'; // trafico
    } else if (decibelLevel < 100) {
      return 'Taladro'; // taladro
    } else if (decibelLevel < 110) {
      return 'Recital'; // recital
    } else if (decibelLevel < 120) {
      return 'Bomba de estruendo'; // bomba de estruendo
    } else {
      return 'Avión'; // avion
    }
  }

  return (
    <View style={{ backgroundColor: getColor(), flex: 1, justifyContent: 'center', width: '100%', alignItems: 'center' }}>
      <Text style={{ fontSize: 100 }}>
        <Text>{decibelLevel}</Text>
        <Text style={{ fontSize: 60 }}> dBA</Text>
      </Text>
      <Text style={{ fontSize: 50 }}>
        { getQue() }
      </Text>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
      />
    </View>
  );
};




export default function App() {
  return (
    <View style={styles.container}>
      <DecibelMeterScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
