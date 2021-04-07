
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    ImageBackground, 
    View,
    LogBox,
    Dimensions,
    RefreshControl,
    Image,
     Alert
} from 'react-native';
import { Button, Card, Input, List, StyleService, Text, useStyleSheet, Modal, Divider, Icon, Spinner } from '@ui-kitten/components';
import   backgroundImage  from '../auth/assets/image-background.jpg';
import District from '../../scenes/rooms/district';
import CheckBoxSearch from '../../scenes/rooms/checkbox-search';
import { FontAwesome } from '@expo/vector-icons'; 
import axios from 'axios';
import GLOBAL from '../../GLOBAL';
import AsyncStorage from '@react-native-community/async-storage';


const windowWidth = Dimensions.get('window').width - (Platform.OS === 'android' ? 56 : 64);

const windowHeight = Dimensions.get('window').height;

const initDistrict = []; 
const initFacilities = [];
const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export function HomeLayout({ navigation }){
  const [fromValue, setFromValue] = React.useState('');
  const [toValue, setToValue] = React.useState('');
  const [fromArea, setFromArea] = React.useState('');
  const [toArea, setToArea] = React.useState('');
  const [listPost, setListPost] = React.useState([]);
  const [ value, setValue ] = React.useState('');
  const [ visible, setVisible ] = React.useState(false);
  const [ district, setDistrict ] = React.useState(initDistrict);
  const [ facilities, setFacilities ] = React.useState(initFacilities);
  const [ isLoading, setLoading ] = React.useState(true);
  const [ data, setData ] = React.useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const [ dataSearch, setDataSearch ] = React.useState([]);

  const infiniteAnimationIconRef = React.useRef();
    LogBox.ignoreLogs([
        'VirtualizedLists should never be nested', // TODO: Remove when fixed
      ]);

      React.useEffect(() => {
        let ignore = false;
        async function fetchData() {
          const result = await axios(GLOBAL.localhost+'posts');
          if (!ignore) { setData(result.data); setLoading(false);infiniteAnimationIconRef.current.startAnimation()} ;
        }
        
        async function sendExpoToken(){
          let expoToken = await AsyncStorage.getItem('expoToken');
          let userToken = await AsyncStorage.getItem('token');
        await fetch(GLOBAL.localhost+'users/expo',{
            method:'POST',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer "+userToken 
            },
            body: JSON.stringify({
                token: expoToken,
                isTurnOn: true
            })
        });
      }
        sendExpoToken();
        fetchData();
        
        return () => { ignore = true; }
      }, [refreshing]);

    const renderInfiniteAnimationIcon = (props) => (
      <Icon
        {...props}
        ref={infiniteAnimationIconRef}
        animationConfig={{ cycles: Infinity }}
        animation='pulse'
        name='plus-outline'
      />
    );  


    const styles = useStyleSheet(themedStyles);

    const onItemPress = (id) => {
      navigation && navigation.navigate('RoomDetail',{id,});
    };      

    const onSearchPress = async () =>{

      if(!fromValue.trim() || !toValue.trim() || !fromArea.trim() || !toArea.trim() || district.length===0 || facilities.length===0){
        Alert.alert('Thông báo','Vui lòng nhập đầy đủ thông tin');
        return;
      }
      else{
        console.log(JSON.stringify({
          minPrice : parseInt(fromValue.replace(/([.])/g,'')),
          maxPrice : parseInt(toValue.replace(/([.])/g,'')),
          minArea: parseInt(fromArea),
          maxArea: parseInt(toArea),
          facility: facilities.join('-'),
          districts: district
        }))
      let userToken = await AsyncStorage.getItem('token');
      await fetch(GLOBAL.localhost+'posts/search',{
        method:'POST',
        headers:{
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+userToken
        },
        body: JSON.stringify({
          minPrice : fromValue.replace(/([.])/g,''),
          maxPrice : toValue.replace(/([.])/g,''),
          minArea: fromArea,
          maxArea: toArea,
          facility: facilities.join('-'),
          districts: district
        })
      }).then(res=>res.json()).then(resJSON=> 
        {
          console.log(resJSON);
          setDataSearch(resJSON)
        }).finally(()=>setVisible(false));

      navigation.navigate('Search',{dataSearch,})
    }
  }
    const onCancelPerss = () => {
      setVisible(!visible);
    }
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
  
      wait(1000).then(() => setRefreshing(false));
    }, []);
    const renderFeaturedRoom = ({item,index}) => {
      return(
        <View style={styles.boxShadow}>
        <Card
        style={{marginHorizontal:20,borderRadius:5}}
        header={() => renderImages(item.images)}
        appearance='filled'
        onPress={()=>{onItemPress(item.id)}}
        >
        <Text
        category='s1'
        style={styles.priceLabel}>{item.postDetail.gia}đ/<Text appearance='hint' category='s2' style={{color:'#E65B6F',fontWeight:'200'}}>phòng</Text></Text>
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
      );
      }
      const changeFromValue = (nextValue) => {
        setFromValue(nextValue.replace(/\D/g,"").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."));
      }
      const changeToValue = (nextValue) => {
        setToValue(nextValue.replace(/\D/g,"").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."));
      }
      const renderPrice = () => {
        return(
          <View style={{flexDirection:'row',justifyContent:'center'}}>
          <Input
          style={styles.popupInput}
          placeholder='Tối thiểu'
          value={fromValue}
          onChangeText={(nextValue) => {changeFromValue(nextValue)}}
          keyboardType='numeric'
          multiline={true}
          />
          <Text category='h6' style={{marginLeft:10}}>-</Text>
          <Input
          style={styles.popupInput}
          placeholder='Tối đa'
          value={toValue}
          onChangeText={(nextValue) => {changeToValue(nextValue)}}
          keyboardType='numeric'
          multiline={true}
          />
          </View>
        )
      }
      const changeFromArea = (nextValue) => {
        setFromArea(nextValue);
      }
      const changeToArea = (nextValue) => {
        setToArea(nextValue);
      }
      const renderArea = () => {
        return(
          <View style={{flexDirection:'row',justifyContent:'center'}}>
          <Input
          style={styles.popupInput}
          placeholder='Tối thiểu'
          value={fromArea}
          onChangeText={(nextValue) => {changeFromArea(nextValue)}}
          keyboardType='numeric'
          multiline={true}
          />
          <Text category='h6' style={{marginLeft:10}}>-</Text>
          <Input
          style={styles.popupInput}
          placeholder='Tối đa'
          value={toArea}
          onChangeText={(nextValue) => {changeToArea(nextValue)}}
          keyboardType='numeric'
          multiline={true}
          />
          </View>
        )
      }
      
      const renderImages = (images) => {
          return(
            <View style={{padding:22,flexDirection:'row',justifyContent:'space-between',backgroundColor:'#fff'}}>
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
        
    const hidePopup = () => {
      setVisible(false);
    }
 
    const renderSearchPop = () => (
      <Modal
      style={styles.popup}
      visible={visible}
      backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
      onBackdropPress={() => {hidePopup}}>
        <ScrollView >
          <View style={{marginHorizontal:20}}>
            <View>
              <Text category='h6' style={{fontWeight:"500",marginBottom:7,textAlign:'center'}}> Tìm kiếm nâng cao </Text>
            </View>            
            <Divider />
            <Text style={{fontWeight:'600',marginVertical:6}} category='s1'> Khoảng giá (VNĐ)</Text>
              {renderPrice()}
            <Text style={{fontWeight:'600',marginVertical:6}} category='s1'> Diện tích</Text>
              {renderArea()}
            <Text style={{fontWeight:'600',marginVertical:6}} category='s1'>Quận</Text>
            <View style={styles.section}>
              <District district={district}/>
            </View>
            <Divider />
            <Text style={{fontWeight:'600',marginVertical:6,marginHorizontal:10}}>Tiện ích</Text>
            <View style={styles.section}>
              <CheckBoxSearch facilities={facilities}/>
            </View>

            <View style={styles.popupFooter}>
            <Button  appearance='ghost' style={styles.leftPopupButton} onPress={onCancelPerss}>
                Huỷ bỏ
              </Button>
              <Button onPress={onSearchPress}>
                Tìm kiếm
              </Button>

            </View>
          </View>
          </ScrollView>
    </Modal>

    );

    const renderLeftButton = () => (
      <View style={{flex:1,flexDirection:'row'}}>
        <FontAwesome name="search" size={20} color="rgb(188,188,190)" />
        <Text style={{color:'rgb(188,188,190)',marginLeft:10}}>Tìm kiếm ở đây nè</Text>
      </View>
    )
    const menuHome = () => {
      return(
        <Card
        style={styles.searchCard}
        disabled={true}
        >
            <Button 
            style={{backgroundColor:'rgb(240,240,240)',borderColor:'rgb(240,240,240)',borderWidth:1,borderRadius:15,height:60}}
            appearance='outline'
            onPress={()=>setVisible(true)}
            accessoryLeft={renderLeftButton}>    
            </Button>
    </Card>
      );
    }   
    return (
      <>
      {isLoading ? 
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Spinner size='giant' />
            </View>
       : 
      <>
      <ScrollView style={styles.container} 
       refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
>
          <ImageBackground
              style={styles.image}
              source={backgroundImage}
          />
          {menuHome()}
          
          {renderSearchPop()}   
          <Text
              style={styles.sectionLabel}
              category='s1'>
              Phòng nổi bật
          </Text>
          
          <List
          style={{backgroundColor:'transparent'}}
          data={data}
          renderItem={renderFeaturedRoom}
          />
          
      </ScrollView>
      <Button onPress={() => navigation && navigation.navigate('PostRoom')} accessoryLeft={renderInfiniteAnimationIcon} style={styles.buttonStyle}>

      </Button> 
      </>
      }
          
        </>
      );
    };
    
    const themedStyles = StyleService.create({
      container: {
        backgroundColor: 'background-basic-color-2',
      },
      image: {
        height: 150,
      },
      searchCard: {
        marginTop: -60,
        margin: 16,
        height:100
      },
      detailsList: {
        flexDirection: 'row',
        marginHorizontal: -4,
        marginVertical: 8,
      },
      detailItem: {
        marginHorizontal: 4,
        borderRadius: 16,
      },
      optionList: {
        flexDirection: 'row',
        marginHorizontal: -4,
        marginVertical: 8,
      },
      sectionLabel: {
        fontWeight:'500',
        marginHorizontal: 26,
        marginVertical: 8,
      },
      optionItem: {
        marginHorizontal: 4,
        paddingHorizontal: 0,
      },
      headerTitle: {
        marginVertical: 8,
      },
      boxShadow:{
          shadowColor : '#000',
          shadowOpacity : 0.12,
          shadowRadius : 3,
          shadowOffset : {width:0,height:2},
          marginBottom: 20
      },
      searchView:{
        flex:1,
        flexDirection:'row',
      },
      searchButton:{
          marginTop:5,
          marginHorizontal:5
      },
      section:{
        flexDirection: 'row',
        justifyContent:'center',
        flexWrap:'wrap',
        width:windowWidth,
        marginBottom:10,
      },
      searchLabel:{
        fontWeight:'600',
        marginVertical:10,
        
      },
      popup:{
        alignItems:'center',
        backgroundColor:'rgb(249,249,252)',
        borderRadius:20
      },
      popupInput:{
        marginLeft:10,
        width:windowWidth/2.4,
      },
      popupFooter:{
        flexDirection:'row',
        justifyContent:'flex-end',
        marginBottom:10
      },
      leftPopupButton:{
        marginTop:10
      },
      image1: {
        borderRadius:15,
        width:windowWidth/2,
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
      buttonStyle : {
        backgroundColor: '#E65B6F',
        width: 66,
        height: 66,
        borderRadius: 33,
        justifyContent: 'center',
        alignItems:'center',
        position: 'absolute',
        bottom: 20,
        right: 20
      }
    });