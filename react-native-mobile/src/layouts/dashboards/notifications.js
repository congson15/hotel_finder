import React from 'react';
import { StyleSheet, View, RefreshControl } from 'react-native';
import { Divider,List, Text, TopNavigation,Spinner } from '@ui-kitten/components';
import { AntDesign } from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import GLOBAL from '../../GLOBAL';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import localization from 'moment/locale/vi';
moment.updateLocale('vi', localization);

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
export function NotificationsLayout(){
    
  const [refreshing, setRefreshing] = React.useState(false);
  const [ listNotification, setListNotification ] = React.useState([]);
  const [ loading, setLoading ] = React.useState(true);
  React.useEffect(()=>{
    async function getNotifications(){
      let userToken = await AsyncStorage.getItem('token');
      await fetch(GLOBAL.localhost+'users/notification',{
        method:'POST',
        headers:{
          Accept: 'application/json',
          'content-type':'application/json',
          'Authorization': 'Bearer '+userToken
        }
      }).then(res=>res.json()).then(resJSON=>setListNotification(resJSON)).finally(()=>setLoading(false));
    }
    getNotifications();
  },[refreshing])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(1000).then(() => setRefreshing(false));
  }, []);

  const onDetailPress = (status) => {
    
  }

    const renderNotifications = ({item,key}) => {
      return(
        <TouchableOpacity onPress={onDetailPress(item.status)}>
        <View style={ item.status ? {backgroundColor: '#fff',padding:20} : {backgroundColor: 'rgb(246,251,255)',padding:20}}>
          <View style={{marginHorizontal:5,flexDirection:'row'}}>
            {item.type===1 ? <AntDesign name="notification" size={30} color="#E65B6F" style={{marginRight:30}} />
           
            :  <AntDesign name="infocirlceo" size={30} color="#E65B6F"  style={{marginRight:30}}/>}

            <View>
              <Text category='h6' style={{fontWeight:'500'}}>
                {item.content}
              </Text>
              <View style={{flexDirection:'row',marginTop:10}}>
                <AntDesign name="clockcircleo" size={15} color="#494949" />
                <Text category='label'style={{marginLeft:5,fontWeight:'500',justifyContent:'center',color:'#494949'}}>
                  {moment(item.createdAt).fromNow()}
                </Text>
              </View>
            </View>
          </View>
        </View>   
        </TouchableOpacity>     
      )
    }
    return(
      <>
      {loading ? 
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Spinner size='giant' />
        </View>
  : <>
      <View style={styles.container}>
        <TopNavigation
            alignment='center'
            title='Thông báo'
            style={{backgroundColor:'transparent'}}
        />     
        <List
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={Divider}
        data={listNotification}
        renderItem={renderNotifications}
    />
        
      </View>
      </>
}
</>
    );
}
const styles = StyleSheet.create({
  container:{
    flex:1,
   
  },
  notification: {
    padding: 5,
  },
  section: {
    marginVertical:10,
    marginHorizontal:10
  },
});