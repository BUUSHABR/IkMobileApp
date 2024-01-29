import React, {useEffect, useState} from 'react';
import {Linking, View} from 'react-native';
import {QueryClient, QueryClientProvider} from 'react-query';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {TailwindProvider} from 'tailwind-rn';
import utilities from './tailwind.json';
import {AppNavigator} from './src/navigators/AppNavigator';
import {navigationRef} from './src/navigators/navigation-utilities';
import {ActivityIndicator} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {ToastProvider} from 'react-native-toast-notifications';
import {persistor, store} from './store';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import SplashScreen from 'src/screens/SplashScreen';
import { AuthProvider } from 'src/providers';
import messaging from '@react-native-firebase/messaging';
// to prevent re fetching if change focus, we dont need to do that i think
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// run devtools
if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

const linking = {
  prefixes: ['intensivkontakt://'],
  config: {
    screens: {
      Home: 'home',
      Call: 'Call',
      EmailConfirmation: 'email-confirmed/:token',
      ProfileNavigator: {
        screens: {
          PatientSwitcher: 'patients',
          PatientInvitationInfo: 'invitations',
          PendingRequests: 'pending-requests'
        },
      },
      Registration: 'registration/:email',
      PatientInfo: {
        screens: {
          Doctor: 'doctor',
          Patient: 'patient-info'
        },
      },
      News: 'news'
    },
  },
};


const App = () => {
  const [activeUrl, setActiveUrl] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    Orientation.lockToPortrait();
    Linking.getInitialURL().then((url: any) => {
      if (!url) {
        return;
      }
      if (url && url === 'intensivkontakt://Call') {
        setActiveUrl(url);
      } else {
        Linking.openURL(url);
      }
    
       
    });
  }, []);


  return (
    <View style={{ flex: 1 }}>
      {isLoading ? <SplashScreen /> : (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
              <QueryClientProvider client={queryClient}>
                <TailwindProvider utilities={utilities}>
                  <ToastProvider>
                    <NavigationContainer
                      ref={navigationRef}
                      linking={linking}
                      fallback={<ActivityIndicator size={'large'} color={'#56A0BB'} 
                      />}>
                      <AppNavigator activeUrl={activeUrl} />
                    </NavigationContainer>
                  </ToastProvider>
                </TailwindProvider>
              </QueryClientProvider>
          </PersistGate>
        </Provider>
      )}
    </View>
  )
};
export default App;
