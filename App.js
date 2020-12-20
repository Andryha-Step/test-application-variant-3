import React from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';
import ScreenMap from './src/screens/ScreenMap'

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScreenMap />
      </SafeAreaView>
    </>
  );
};

export default App;