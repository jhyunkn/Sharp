import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, Text, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';

const SHARP_URL = 'https://sharp-jsljmfjqv-jhyunkns-projects.vercel.app';

export default function App() {
  const [failed, setFailed] = React.useState(false);

  if (failed) {
    return (
      <SafeAreaView style={styles.fallback}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.mark}>✦</Text>
        <Text style={styles.title}>Sharp</Text>
        <Text style={styles.copy}>The live prototype could not load. Check your connection, then try again.</Text>
        <Pressable style={styles.button} onPress={() => setFailed(false)}>
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <WebView
        source={{ uri: SHARP_URL }}
        style={styles.webview}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
        onError={() => setFailed(true)}
        onHttpError={(event) => {
          if (event.nativeEvent.statusCode >= 500) setFailed(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0c',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0d0d0c',
  },
  fallback: {
    flex: 1,
    backgroundColor: '#12100E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  mark: {
    color: '#A4502F',
    fontSize: 28,
    marginBottom: 28,
  },
  title: {
    color: '#EFEAE0',
    fontSize: 56,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    marginBottom: 18,
  },
  copy: {
    color: 'rgba(239,234,224,.7)',
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 28,
  },
  button: {
    borderWidth: 1,
    borderColor: 'rgba(164,80,47,.5)',
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#A4502F',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
