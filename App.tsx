import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Navigator} from './src/navigator/Navigator';
import {PermissionsProvider} from './src/context/PermissionsContext';

function App() {
  return (
    <NavigationContainer>
      <PermissionsProvider>
        <Navigator />
      </PermissionsProvider>
    </NavigationContainer>
  );
}
export default App;
