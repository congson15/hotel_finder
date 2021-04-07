import React from 'react';
import { Alert, ImageBackground, StyleSheet, View, Dimensions, Image } from 'react-native';
import {Card, List, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { ArrowIosBackIcon } from '../assets/icons';
import GLOBAL from '../../GLOBAL';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const array = [1,2,3,4,5,6,7,8,9,10];
export function ShowPostsLayout( { navigation, route } ){
    const [ data, setData] = React.useState([]);
    const [ loading, setLoading ] = React.useState(true);
    React.useEffect(()=>{
        if(route.params?.approvedPosts){
            data.map(item=>route.params.approvedPosts.push(item));
            setData(route.params.approvedPosts);
            delete route.params.approvedPosts;
        }
    },[route.params?.approvedPosts])
    React.useEffect(()=>{
        if(route.params?.rejectedPosts){
            data.map(item=>route.params.rejectedPosts.push(item));
            setData(route.params.rejectedPosts);

            delete route.params.rejectedPosts;
        }       
    },[route.params?.rejectedPosts]);
    React.useEffect(()=>{
        if(route.params?.pendingPosts){
            data.map(item=>route.params.pendingPosts.push(item));
            setData(route.params.pendingPosts);
            delete route.params.pendingPosts;
        }       
    },[route.params?.pendingPosts])
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
        source={{uri:GLOBAL.localhost+images[1]}}
        />   
        <Image
        resizeMode='cover'
        style={styles.image2}
        source={{uri:GLOBAL.localhost+images[2]}}
        />               
        </View>
    </View> 
    );
}
const renderTitle = () => {
    return(
    <View>
        <Text style={{fontWeight:'300'}} category='h6'>
            {route.params.title}
        </Text>
    </View>
    );
}
const renderBackAction = () =>{
   
    return(
        <TopNavigationAction
        icon={ArrowIosBackIcon}
        onPress={() => {navigation.goBack()}}
      />    
    );    
    }
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
            title={renderTitle}
            accessoryLeft={renderBackAction}
                
                />
        { data.length === 0
 ? 
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text> Chưa có bài viết nào </Text>
        </View> : 
        <View style={styles.container}>
        <List
            style={{backgroundColor:'transparent'}}
            data={data}
            renderItem={renderPosts}
            />
        </View>}

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
      height:windowHeight/3.5,
      
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