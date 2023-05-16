import {AppState, Platform} from 'react-native';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  check,
  PERMISSIONS,
  PermissionStatus,
  request,
} from 'react-native-permissions';

export interface PermissionsState {
  locationStatus: PermissionStatus;
}

export const permissionsInitialState: PermissionsState = {
  locationStatus: 'unavailable', // indisponible
};

type PermissionsContextProps = {
  permissions: PermissionsState;
  askLocationPermission: () => Promise<void>;
  checkLocationPermission: () => Promise<void>;
};

export const PermissionContext = createContext({} as PermissionsContextProps);

export const PermissionsProvider: FC<PropsWithChildren> = ({children}: any) => {
  const [permissions, setPermissions] = useState(permissionsInitialState);

  // Preguntar permisos
  const askLocationPermission = async () => {
    let permissionStatus: PermissionStatus;

    if (Platform.OS === 'ios') {
      // Comprueba el estado del permiso de ubicación cuando la aplicación está en uso en iOS
      permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      // Comprueba el estado del permiso de ubicación precisa en Android
      permissionStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
    }

    setPermissions({
      ...permissions,
      locationStatus: permissionStatus,
    });
  };

  // Comprobar permisos (no pregunta solo revisa el estado del mismo)
  const checkLocationPermission = useCallback(async () => {
    let permissionStatus: PermissionStatus; // Variable para almacenar el estado del permiso

    if (Platform.OS === 'ios') {
      // Comprueba el estado actual del permiso de ubicación cuando la aplicación está en uso en iOS
      permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      // Comprueba el estado actual del permiso de ubicación precisa en Android
      permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }

    // Actualiza el estado de los permisos de ubicación en el componente utilizando el método setPermissions
    setPermissions({
      ...permissions,
      locationStatus: permissionStatus,
    });
  }, [permissions]);

  useEffect(() => {
    AppState.addEventListener('change', state => {
      // console.log(state); // 'active' | 'background' | 'inactive'
      if (state !== 'active') return;
      checkLocationPermission();
    });
  }, [checkLocationPermission]);

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        askLocationPermission,
        checkLocationPermission,
      }}>
      {children}
    </PermissionContext.Provider>
  );
};
