import Constants from 'expo-constants';
import React from 'react';
import { Linking, Alert, SafeAreaView, Dimensions } from 'react-native';
import { View, Text } from '@ui-kitten/components'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SignIn } from '../scenes/auth/sign-in.component';
import { ForgotPassword } from '../scenes/auth/forgot-password.component';
import { SignUp } from '../scenes/auth/sign-up.component';
import { HomeNavigator } from './home.navigator';
import { AuthContext } from '../context/context';
import AsyncStorage from '@react-native-community/async-storage';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import GLOBAL from '../GLOBAL';

const windowWidthh = Dimensions.get('window').width;
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();



const onConfirmPress = () => {
  Alert.alert(
      "Thông báo chưa mở",
      "Bạn có muốn mở thông báo ?",
      [
        {
          text: "Huỷ bỏ",
          style: "cancel"
        },
        { text: "Xác nhận", 
           onPress: () => Linking.openSettings(),
      }
      ],
      { cancelable: false }
    );
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});



async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      onConfirmPress();
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  await AsyncStorage.setItem('expoToken',token);
  return token;
}

let getUserToken = async () => {
  await AsyncStorage.getItem('token');
} 


export default function MainNavigator(){
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const [ userToken, setUserToken ] = React.useState(getUserToken);

  const authContext = React.useMemo(()=>{

    return{
      signIn: async (emailUser, passwordUser) => {
        try {
          
          let response = await fetch(
            GLOBAL.localhost+'auth/user/signin',{
              method:'POST',
              headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email : emailUser,
                password : passwordUser

              })
            }
          );
          let res = await response.json();
          try{
            await AsyncStorage.setItem('token',res.token);
            } catch(error) {
                console.log('Không có token');
            }
          if(res.statusCode===1){
            Alert.alert(
                "Thông báo",
                "Đăng nhập thành công",
                [
                  { text: "OK", onPress: () => setUserToken(res.token) }
                ],
                { cancelable: false }
              );
              
        }
        else{
          Alert.alert('Thông báo','Đăng nhập thất bại');
        }
      
        } catch (error) {
          console.error(error);
        }
      },
      signUp: async (nameUser, emailUser, phoneNumber, passwordUser) => {
        try {
          let response = await fetch(
            GLOBAL.localhost+'auth/user/signup',{
              method:'POST',
              headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                hoTen: nameUser,
                email: emailUser,
                soDienThoai: phoneNumber,
                password : passwordUser
    
              })
            }
          );
          let res = await response.json();
          if(res.statusCode===1){
            Alert.alert(
              "Thông báo",
              "Đăng ký thành công",
              [
                { text: "OK", onPress: () => console.log('ok')}
              ],
              { cancelable: false }
            );            
          }else{
            Alert.alert('Thông báo','Email đã tồn tại');
          }

        } catch (error) {
          console.error(error);
        }
      },
      signOut: async () => {
        setUserToken(null);
      }
    }
  },[])


  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  const DefaultDrawer = ({navigation}) => {
    return(
      <View>
        <Text>
          Hello
        </Text>
      </View>
    )
  }
  React.useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []); 
  const navigatorTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      // prevent layout blinking when performing navigation
      background: 'transparent',
    },
  };
  return(
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {userToken ? (
          <Stack.Navigator headerMode='none'>
            <Stack.Screen name='Home' component={HomeNavigator} />
          </Stack.Navigator>
          ) : (
          <AuthStack.Navigator headerMode='none'>
            <AuthStack.Screen name='SignIn' component={SignIn}/>
            <AuthStack.Screen name='SignUp' component={SignUp}/>   
            <AuthStack.Screen name='ForgotPassword' component={ForgotPassword}/>    
          </AuthStack.Navigator>
          )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
