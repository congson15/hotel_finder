import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { BottomNavigation, BottomNavigationTab} from '@ui-kitten/components';
import { Icon } from '@ui-kitten/components';
import { Home } from '../scenes/dashboards/home.component';
import { Favorite } from '../scenes/dashboards/favorite.component';
import { Notifications } from '../scenes/dashboards/notifications.component';
import { Account } from '../scenes/dashboards/account.component';
import { RoomDetail } from '../scenes/rooms/detail.component';
import { PostRoom } from '../scenes/rooms/post-room.component';
import { ChangePass } from '../scenes/settings/change-pass.component';
import { ImageBrowserScreen } from '../scenes/dashboards/image-picker.component';
import { Camera } from '../scenes/dashboards/camera.component';
import { SuccessPost } from '../scenes/rooms/success-post.component';
import { Search } from '../scenes/dashboards/search.component';
import { ShowPosts } from '../scenes/dashboards/show-posts.component';
const { Navigator, Screen} = createBottomTabNavigator();


const selectedColor = '#e65b6f';
const unselectedColor = '#777877';





function BottomTabBar({ navigation, state }){
  const HomeIcon = (props) => (<Icon {...props} name='home-outline' fill={state.index == 0 ? selectedColor : unselectedColor} />);
  const LoveIcon = (props) => (<Icon {...props} name='heart-outline' fill={state.index == 1 ? selectedColor: unselectedColor} />); 
  const BellIcon = (props) => (<Icon {...props} name='bell-outline' fill={state.index == 2 ? selectedColor : unselectedColor} />);
  const PersonIcon = (props) => (<Icon {...props} name='person-outline' fill={state.index == 3 ? selectedColor : unselectedColor} />); 
  
  return( 
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}
    indicatorStyle={{backgroundColor: selectedColor, height: 2,borderRadius:1}}
    style={styles.bottomNavigation}
    >
    <BottomNavigationTab title='Trang chủ' icon={HomeIcon} />
    <BottomNavigationTab title='Yêu thích' icon={LoveIcon}/>
    <BottomNavigationTab title='Thông báo' icon={BellIcon}/>
    <BottomNavigationTab title='Tài khoản' icon={PersonIcon}/>
  </BottomNavigation>
  );
}

const TabNavigator = () => (
  <Navigator tabBar={props => <BottomTabBar {...props} />} >
    <Screen name='Home' component={Home} options={{
          gestureEnabled: false,
          
        }}/>
    <Screen name='Favorite' component={Favorite} options={{
          gestureEnabled: false,
          
        }}/>
    <Screen name='Notifications' component={Notifications} options={{
          gestureEnabled: false,
          
        }}/>
    <Screen name='Account' component={Account} options={{
          gestureEnabled: false,
          
        }}/>
  </Navigator>
);

const Stack = createStackNavigator();


export const HomeNavigator = () => (
    <Stack.Navigator headerMode='none'  initialRouteName="Main">
      <Stack.Screen name='Main' component={TabNavigator} options={{
          gestureEnabled: false,
        }}/>    
      <Stack.Screen name='RoomDetail' component={RoomDetail} options={{
          gestureEnabled: false,
          
        }}/>       
      <Stack.Screen name='ChangePass' component={ChangePass} options={{
          gestureEnabled: false,
          
        }}/> 
      <Stack.Screen name='ImageBrowser' component={ImageBrowserScreen} options={() => ({
    headerTitle: 'Selected 0 files',
    gesturesEnabled: false,
    
  })}/> 
      <Stack.Screen name='Camera' component={Camera} options={{
          gestureEnabled: false,
          
        }}/>
      <Stack.Screen name='SuccessPost' component={SuccessPost} options={{
          gestureEnabled: false,
          
        }}/>

        <Stack.Screen name='Search' component={Search} />
        <Stack.Screen name='PostRoom' component={PostRoom} options={{
            gestureEnabled: false,
          }}/>   
        <Stack.Screen name='ShowPosts' component={ShowPosts} options={{
            gestureEnabled: false,
          }}/>   
                  
    </Stack.Navigator>
    
);

const styles = StyleSheet.create({
  bottomNavigation:{
    paddingBottom:5,
    
  }
})