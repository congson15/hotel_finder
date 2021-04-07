import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image} from 'react-native';
import {  Text, Card, List, TopNavigation, TopNavigationAction, Spinner  } from '@ui-kitten/components';
import { ArrowIosBackIcon } from '../assets/icons'; 

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const array = [1,2,3,4,5,6,7,8,9,10];

export function SearchLayout({navigation,route}){
    const [currentImage, setCurrentPage] = React.useState(0);
    const [ value, setValue ] = React.useState('');
    const [ loading, setLoading ] = React.useState(true);
    const [ data , setData ] = React.useState([]);

    React.useState(()=>{
      if(route.params?.dataSearch){
        setData(route.params.dataSearch);
        setLoading(false);
      }
    },[route.params?.dataSearch])

    
    const renderTitle = () => {
      return(
      <>
        <Text style={{fontWeight:'500'}}>
          {route.params.dataSearch.length===0 ? 'Không tìm thấy phòng' : route.params.dataSearch.length + ' kết quả'}
        </Text>
      </>
      )
  }
  const renderBackAction = () =>{

    return(
        <TopNavigationAction
        icon={ArrowIosBackIcon}
        onPress={() => {navigation.goBack()}}
      />    
    );    
    }
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
    const onCardPress = (id) => {
      navigation && navigation.navigate('RoomDetail',{id,});
    }

    const renderPosts = ({item,key}) => {
        return(
            <View style={styles.boxShadow}>
            <Card
            style={{marginHorizontal:20}}
            header={() => renderImages(item.images)}
            appearance='filled'
            onPress={()=>{onCardPress(item.id)}}
            >
            <Text
            style={styles.title}
            category='h6'>
            Nhà cho thuê
            </Text>
            <Text
            category='s1'
            style={styles.priceLabel}>10 triệu/<Text appearance='hint' category='s2' style={{color:'#E65B6F',fontWeight:'200'}}>phòng</Text></Text>
            <Text
            style={styles.infoAddressLabel}
            category='p2'>
            273 An Dương Vương Phường 3, Quận 5, TP Hồ Chí Minh
            </Text>
            </Card>             
          </View>
          
        )
    }

    return(
        <>
        {loading ? 
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Spinner size='giant' />
            </View>
      :  data.length===0 ? 
      <>
      <TopNavigation 
      alignment='center'
      title={renderTitle}
      accessoryLeft={renderBackAction}
          
          />
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text> Không tìm thấy kết quả, vui lòng quay lại nha. </Text>
    </View>
    </> : <> 
    <TopNavigation 
            alignment='center'
            title={renderTitle}
            accessoryLeft={renderBackAction}
                
                />
        <View style={styles.container}>
        <List
            style={{backgroundColor:'transparent'}}
            data={array}
            renderItem={renderPosts}
            />
        </View>
        </>
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
      padding:15,
    },
    container:{
        flex:1,
        marginTop:20
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
        width: '55%',
        fontWeight:'600'
      },
      infoAddressLabel: {
        marginTop: 10,
        fontWeight:'300'
      },
      priceLabel:{
        fontWeight:'500',
        color:'#E65B6F',
        position: 'absolute',
        top:20,
        right: 24,
      },
  });