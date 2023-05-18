import {AppState, AppStateStatus, Platform} from 'react-native';
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
  openSettings,
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

  const askLocationPermission = async () => {
    let permissionStatus: PermissionStatus;

    if (Platform.OS === 'ios') {
      permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
    }

    // Si está bloqueado, mostrar settings
    if (permissionStatus === 'blocked') {
      await openSettings();
    }

    setPermissions({
      ...permissions,
      locationStatus: permissionStatus,
    });
  };

  const checkLocationPermission = useCallback(async () => {
    let permissionStatus: PermissionStatus;

    if (Platform.OS === 'ios') {
      permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }

    setPermissions({
      ...permissions,
      locationStatus: permissionStatus,
    });
  }, [permissions]);

  useEffect(() => {
    const handleAppStateChange = (state: AppStateStatus) => {
      if (state !== 'active') return;
      checkLocationPermission();
    };

    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appStateSubscription.remove();
    };
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
