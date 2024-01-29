import {AppRegistry, Linking} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Incomingvideocall from './src/utils/incoming-call';
import {setAutoStartMeeting} from './src/reducers/volatile';
import {store} from './store';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import CallView from './src/widgets/CallView';
import {Platform} from 'react-native';
import uuid from "react-native-uuid";

if (Platform.OS === 'ios') {
  Incomingvideocall.setupCallKeep();
}

async function showNotification(message, type) {
  await notifee.requestPermission();
  console.log(store.getState());

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: message.notification.title,
    body: message.notification.body,
    android: {
      channelId,
      smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}

const showCallNotification = (trigger, patient) => {
  if (Platform.OS !== 'ios') {
    RNNotificationCall.displayNotification(
      uuid.v4(),
      null,
      30000,
      {
        channelId: 'com.abc.incomingcall',
        channelName: 'Incoming video call',
        notificationIcon: 'ic_launcher', //mipmap
        notificationTitle: 'IntensiveKontakt',
        notificationBody: `${patient} is calling...`,
        answerText: 'Answer',
        declineText: 'Decline',
        notificationColor: 'colorAccent',
        notificationSound: 'skype_ring', //raw
        mainComponent:'CallView',//AppRegistry.registerComponent('MyReactNativeApp', () => CustomIncomingCall);
        payload:{ patient }
      }
    );
    RNNotificationCall.addEventListener('answer', async (data) => {
      console.log('answer normal mode');
      Linking.openURL(trigger);
      store.dispatch(setAutoStartMeeting(true));
    });
  } else {
    // console.log('active call started');
    Incomingvideocall.configure(
      async () => {
        store.dispatch(setAutoStartMeeting(true));
        await Linking.openURL(trigger);
        Incomingvideocall.endAllCalls();
      },
      () => Incomingvideocall.endAllCalls()
    );
    Incomingvideocall.displayIncomingCall('IntensiveKontakt', 'Fayez Qandeel');
  }
};

// Note that an async function or a function that returns a Promise
// is required for both subscribers.
async function onMessageReceived(message, type) {
    //Request permissions (required for iOS)
    showNotification(message, type);
    if (message && message.notification?.body?.indexOf('virtuellen Besuch gestartet') !== -1) {
      showCallNotification("intensivkontakt://home", message.data.patient_full_name);
    }
}

messaging().onMessage(async (message) => onMessageReceived(message, 'active'));
messaging().setBackgroundMessageHandler(async (message) => {
  console.log(message, 'messagemessagemessagemessagemessagemessage');
  if (message && message.notification?.body?.indexOf('virtuellen Besuch gestartet') !== -1) {
    console.log('background call started');
    showCallNotification("intensivkontakt://Call", message.data.patient_full_name);
  }
});




AppRegistry.registerComponent('CallView', () => CallView);
AppRegistry.registerComponent(appName, () => App);
