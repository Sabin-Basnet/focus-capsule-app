import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function HomeScreen() {
  // const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((seconds => seconds - 1));
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);

      const logSessionToBackend = async () => {
        try {
          await fetch('http://192.168.1.81:8000/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              duration_minutes: 25,
              status: 'completed',
            }),
          });
        } catch (error) {
          console.error('Error logging session to backend:', error);
        }
      };

      logSessionToBackend();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    // setSecondsLeft(25 * 60);
    setSecondsLeft(10);

  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
      
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, isActive ? styles.pauseButton : styles.startButton]} onPress={toggleTimer}>
          <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start.'}</Text>
        </Pressable>
        
        <Pressable style={[styles.button, styles.resetButton]} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
    fontVariant: ['tabular-nums'],
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#38a169',
  },
  pauseButton: {
    backgroundColor: '#e53e3e',
  },
  resetButton: {
    backgroundColor: '#4a5568',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});