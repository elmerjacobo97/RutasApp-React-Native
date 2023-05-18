import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {MapScreen} from '../screens/MapScreen';
import {PermissionsScreen} from '../screens/PermissionsScreen';
import {useContext} from 'react';
import {PermissionContext} from '../context/PermissionsContext';
import {LoadingScreen} from '../screens/LoadingScreen';

const Stack = createStackNavigator();

export const Navigator = () => {
  const {permissions} = useContext(PermissionContext);

  console.log(permissions.locationStatus);
  if (permissions.locationStatus === 'unavailable') return <LoadingScreen />;

  return (
    <Stack.Navigator
      // initialRouteName="PermissionsScreen"
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: '#FFF',
        },
      }}>
      {permissions.locationStatus === 'granted' ? (
        <Stack.Screen name="MapScreen" component={MapScreen} />
      ) : (
        <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
      )}
    </Stack.Navigator>
  );
};
