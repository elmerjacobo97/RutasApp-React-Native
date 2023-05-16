import React, {useContext} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {PermissionContext} from '../context/PermissionsContext';

export const PermissionsScreen = () => {
  const {permissions, askLocationPermission} = useContext(PermissionContext);

  return (
    <View style={styles.container}>
      <Text>PermissionsScreen</Text>
      <Button title="Permiso" onPress={askLocationPermission} />
      <Text>{JSON.stringify(permissions, null, 3)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
