import React from 'react';
import { Alert, ImageBackground, StyleSheet, View, Dimensions, Image, RefreshControl } from 'react-native';
import {Card, List, Text, TopNavigation, Spinner } from '@ui-kitten/components';
import GLOBAL from '../../GLOBAL';
import AsyncStorage from '@react-native-community/async-storage';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}


export function FavoriteLayout( { navigation } ){
  const [ loading, setLoading ] = React.useState(true);
  const [ wishlist, setWishlist ] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  React.useEffect(()=>{
    
    async function getWishlist(){
      let userToken = await AsyncStorage.getItem('token');
      await fetch(GLOBAL.localhost+'wishlist/mywishlist',{
        method:'POST',
        headers:{
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': "Bearer "+userToken           
        }
      })
      .then(res=>res.json()).then(resJSON=>{
        console.log(resJSON.myWishList);
        setWishlist(resJSON.myWishList);
      }).finally(()=>setLoading(false));
    };
    getWishlist();
  },[refreshing]);

  const renderImages = (images) => {
    return(
    <View style={{padding:20,flexDirection:'row',justifyContent:'space-between',backgroundColor:'#fff'}}>
        <Image
        resizeMode='cover'
        style={styles.image1}
        source={{uri: GLOBAL.localhost+images[0]}}
        /> 
        <View style={{flexDirection:'column',justifyContent:'space-between'}}>
        <Image
        resizeMode='cover'
        style={styles.image2}
        source={{uri: GLOBAL.localhost+images[1]}}
        />   
        <Image
        resizeMode='cover'
        style={styles.image2}
        source={{uri: GLOBAL.localhost+images[2]}}
        />               
        </View>
    </View>  
    );
}
const onRefresh = React.useCallback(() => {
  setRefreshing(true);

  wait(1000).then(() => setRefreshing(false));
}, []);
const onCardPress = (id) => {
  navigation && navigation.navigate('RoomDetail',{id,});
}

const renderPosts = ({item,key}) => {
  
    return(
        <View style={styles.boxShadow}>
        <Card
        key={key}
        style={{marginHorizontal:20}}
        header={() => renderImages(item.images)}
        appearance='filled'
        onPress={()=>{onCardPress(item.id)}}
        >
        <Text
        category='s1'
        style={styles.priceLabel}>{item.postDetail.gia}/<Text appearance='hint' category='s2' style={{color:'#E65B6F',fontWeight:'200'}}>phòng</Text></Text>          
        <Text
        style={styles.title}
        category='h6'>
       {item.tieuDe}
        </Text>
        
        <Text
        style={styles.infoAddressLabel}
        category='p2'>
        {item.postDetail.diaChi}
        </Text>
        </Card>             
      </View>
      
    )
}
      return (
        <>
        <TopNavigation
            alignment='center'
            title='Yêu thích'
            style={{backgroundColor:'transparent'}}
        />  
         {loading ? 
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Spinner size='giant' />
            </View>
      : wishlist.length===0 ? 
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text> Chưa có bài yêu thích, hãy thêm đi nào :3 </Text>
      </View> :
        <View style={styles.container}>
        <List
         refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
            style={{backgroundColor:'transparent'}}
            data={wishlist}
            renderItem={renderPosts}
            />
        </View>
}
        </>
         
      );      
}

const styles = StyleSheet.create({
  boxShadow:{
      shadowColor : '#000',
      shadowOpacity : 0.10,
      shadowRadius : 3,
      shadowOffset : {width:0,height:2},
      marginVertical:20
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    padding:15,
  },
  container:{
      flex:1,
  },
    image1: {
      borderRadius:15,
      width:windowWidth/3,
      height:windowHeight/3.5
    },
    image2: {
      borderRadius:15,
      width:windowWidth/2.5,
      height:windowHeight/7.5
    },
    title: {
      width: '100%',
      fontWeight:'600',
      marginTop:10
    },
    infoAddressLabel: {
      marginTop: 10,
      fontWeight:'300'
    },
    priceLabel:{
      fontWeight:'500',
      color:'#E65B6F',
    },
});