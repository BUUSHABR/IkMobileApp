import {Linking, Platform} from "react-native"
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import {store} from './store';
import {setPushNotificationToken} from "./src/reducers";
import Incomingvideocall from './src/utils/incoming-call';
import {setAutoStartMeeting} from './src/reducers';

const NotificationsSetup = () => {

  const checkPermission =  async () => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      return getToken();
    } else {
      return requestPermission();
    }
  };

  const requestPermission =  async () => {
    try {
      await messaging().requestPermission();
      return getToken();
    }
    catch (err) {
      throw err
    }
  };

  const getToken = async () => {
    let fcmToken = await messaging().getToken();
    if (fcmToken) {
      return fcmToken
    }
  };

  const savetoken = async () => {
    try {
      let token = await checkPermission();
      // save token to store;
      console.log(token);
      store.dispatch(setPushNotificationToken(token));
    }
    catch (err) {
      console.log("token error", err)
    }
  };

  savetoken();

  const NOTIFICATION_CHANNEL_ID = 'android_notification_channel_id';
  const NOTIFICATION_CHANNEL_NAME = 'android_notification_channel_name';

  const registrationHandler = () => {
    if (Platform.OS === 'android') {
      PushNotification.createChannel({
        channelId: NOTIFICATION_CHANNEL_ID,
        channelName: NOTIFICATION_CHANNEL_NAME,
      });
    }
  };

  if (Platform.OS == 'ios') {
    PushNotificationIOS.addEventListener("notification", (notification) => {
      console.log("IOS____________notification", notification)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    })
  }

  // messaging().setBackgroundMessageHandler(async (message) => {
  //   console.log('remote message', message);
  //   if (message && message.notification?.body?.indexOf('virtuellen Besuch gestartet') !== -1) {
  //     Incomingvideocall.configure(
  //       async () => {
  //         Linking.openURL("intensivkontakt://Call");
  //         store.dispatch(setAutoStartMeeting(true));
  //         Incomingvideocall.endAllCalls();
  //       },
  //       () => Incomingvideocall.endAllCalls()
  //     );
  //     Incomingvideocall.displayIncomingCall('IntensiveKontakt', 'Fayez Qandeel');
  //   }
  // });

  messaging().onMessage((notification) => {
    console.log("Messaging+++++++IOS____________notification", notification);
    if (Platform.OS == 'ios') {
      PushNotificationIOS.addNotificationRequest({
        id: Date.now().toString(),
        title: notification?.notification?.title,
        body: notification?.notification?.body
      });
    }
    else {
      PushNotification.localNotification({
        title: notification?.notification?.title,
        body: notification?.notification?.body,
        channelId: NOTIFICATION_CHANNEL_ID,
      });
    }
  })

  PushNotification.configure({
    onRegister: registrationHandler,
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification: any) {
      // console.log("NOTIFICATION:", notification);
      // if(Platform.OS == "android" && !notification?.foreground ){
      //   PushNotification.cancelAllLocalNotifications()
      //   PushNotification.removeAllDeliveredNotifications()
      // }

      // if (notification?.userInteraction || notification?.data?.userInteraction) {
      //   if (Platform.OS == 'ios') {
      //     PushNotificationIOS.removeAllDeliveredNotifications()
      //   }
      //   else{
      //     PushNotification.cancelAllLocalNotifications()
      //     PushNotification.removeAllDeliveredNotifications()
      //   }
      // }
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification: any) {
      console.log("ACTION:", notification.action);
      console.log("NOTIFICATION:", notification);

      // process the action
    },
    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err: any) {
      console.error(err.message, err);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });
};

export default NotificationsSetup;