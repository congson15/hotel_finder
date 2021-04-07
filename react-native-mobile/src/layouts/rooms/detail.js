import React from 'react';
import {
  Image,
  ScrollView,
  View,
  ImageBackground,
  LogBox,
  TouchableOpacity,
  Dimensions, Alert
} from 'react-native';
import { Button, Card, List, Icon, StyleService, Text, useStyleSheet, Layout, Modal, OverflowMenu, Radio, RadioGroup, MenuItem, Divider,  Spinner, Input } from '@ui-kitten/components';
import backgroundImage from '../auth/assets/image-background.jpg';
import {  WaterIcon} from '../assets/icons';
import call from 'react-native-phone-call';
import Swiper from 'react-native-swiper';
import { AntDesign, SimpleLineIcons, Ionicons, FontAwesome5,MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'; 
import axios from 'axios';
import GLOBAL from '../../GLOBAL';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import localization from 'moment/locale/vi';
moment.updateLocale('vi', localization);

const district = [{"maTienIch":"tl","tenTienIch":"Tủ lạnh","imgUrl":"fridge","checked":false},{"maTienIch":"nvsr","tenTienIch":"WC riêng","imgUrl":"toilet","checked":false},{"maTienIch":"bdx","tenTienIch":"Bãi để xe","imgUrl":"parking","checked":false},{"maTienIch":"wf","tenTienIch":"Wifi","imgUrl":"wifi","checked":false},{"maTienIch":"g","tenTienIch":"Giường","imgUrl":"bed-empty","checked":false},{"maTienIch":"mg","tenTienIch":"Máy giặt","imgUrl":"washing-machine","checked":false},{"maTienIch":"tv","tenTienIch":"Tivi","imgUrl":"television","checked":false},{"maTienIch":"td","tenTienIch":"Tủ đồ","imgUrl":"locker","checked":false}];
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export function RoomDetailLayout({navigation,route}) {
  const  styles = useStyleSheet(themedStyles);
 
  const dataImage = new Array(10).fill();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [love, setLove] = React.useState(false);
  const [visibleReport, setVisibleReport] = React.useState(false);
  const [visiblePost, setVisiblePost] = React.useState(false);
  const [selectedIndexPost, setSelectedIndexPost] = React.useState(0);
  const [ postDetail, setPostDetail ] = React.useState([]);
  const [ isLoading, setLoading ] = React.useState(true);
  const [ baoCao, setBaoCao ] = React.useState('');
  const infiniteAnimationIconRef = React.useRef();

  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested', // TODO: Remove when fixed
  ]);



  React.useEffect(()=>{
    async function getDetail(){
      let userToken = await AsyncStorage.getItem('token');
      await fetch(GLOBAL.localhost+'posts/'+route.params.id,{
        method:'GET',
        headers:{
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': "Bearer "+userToken 
        }
      }).then(res=>res.json()).then(resJSON=>{
        setPostDetail(resJSON);

      }).finally(()=>{
        
        setLoading(false);
        infiniteAnimationIconRef.current.startAnimation();
      })
    }
    getDetail();
  }
  
  ,[])

  const renderFlagAction = () => (
    <TouchableOpacity onPress={toggleMenu}>
      <SimpleLineIcons name="menu" size={25} color="white" />
    </TouchableOpacity>
  );
  const headerReport = (props) => (
    <View {...props}>
      <Text style={{fontWeight:"700"}}>Bạn muốn chọn gì ?</Text>
    </View>    
  )

  const loveAction = async () =>{
    let userToken = await AsyncStorage.getItem('token');
    await fetch(GLOBAL.localhost+'wishlist/add/'+postDetail.id,{
      method:'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+userToken 
      }
    }).then(res=>res.json()).then(resJSON=>console.log(resJSON)).finally(()=>setLove(!love));
  }  
  const toggleMenu= () => {
      setMenuVisible(!menuVisible);
    };

  const renderImage = (item,key) => {  
    return(
    <Image
    key={key}
    source={{uri:GLOBAL.localhost+item}}
    style={styles.imageItem} 
    />
    );
  };
  const renderInfiniteAnimationIcon = (props) => (
    <Icon
      {...props}
      ref={infiniteAnimationIconRef}
      animationConfig={{ cycles: Infinity }}
      animation='pulse'
      name='phone-call-outline'
    />
  );  

  const makeCall = () => {
    const args = {
      number: postDetail.postDetail.soDienThoai,
      prompt: true,
    };
    call(args).catch(console.error);
  }

  const renderFacilities = () => {
    return postDetail.facilities.map((item,key)=>{
      return(
        <View key={key} style={{flexDirection:'column',padding:10,alignItems:'center'}}>
          <MaterialCommunityIcons name={`${item.imgUrl}`} size={20} color='#808080'/>
          <Text style={{color:'#808080'}} category='p2'>{`${item.tenTienIch}`}</Text>
        </View>
      )
    })
  }
  const onBack = () => {
    navigation.goBack();
}
  const renderBackAction = () =>{
    return(
      <TouchableOpacity onPress={onBack}>
        <AntDesign name="arrowleft" size={30} color="white" />
      </TouchableOpacity> 
    );    
    }


  const onVisiblePress = async () => {
    let userToken = await AsyncStorage.getItem('token');
    if(selectedIndexPost===0){
      setVisiblePost(false); 
      setMenuVisible(false)     
      navigation.navigate('PostRoom',{postDetail,});
    }
    else{
      Alert.alert(
        "Thông báo",
        "Bạn có muốn xoá bài viết ?",
        [
          { text: "OK", onPress: async () => {
            await fetch(GLOBAL.localhost+'posts/delete/'+postDetail.id,{
              method:'POST',
              headers:{
                Accept: 'application/json',
                'content-type': 'application/json',
                'Authorization': 'Bearer '+userToken
              }
            }).then(res=>res.json()).then(resJSON=>{Alert.alert('Thông báo',resJSON.message); 
            navigation.goBack();
            });
            
          }},
          {
            text: "Huỷ bỏ",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
        ],
        { cancelable: false }
      );      

    }
  }
  const onCancelReportPress = () => {
    setVisibleReport(!visibleReport); 
    setMenuVisible(!menuVisible);    
  }
  const onCancelEditPress = () => {
    setVisiblePost(!visiblePost); 
    setMenuVisible(!menuVisible);    
  }
  const onEditPress = () => {
    
    if(postDetail.isAuthor===false){
      Alert.alert('Thông báo','Bạn không có quyền chỉnh sửa bài viết');
      setMenuVisible(false);
      return;
    }
    else{
    setVisiblePost(true); 
    setMenuVisible(false)    
    }        
  }
  const onReportPress = () => {
    setVisibleReport(true); 
    setMenuVisible(false)            
  }
  const renderPagination = (index, total, context) => {
    return (
      <View style={styles.paginationStyle}>
        <Text style={{ color: 'grey' }}>
          <Text style={styles.paginationText}>{index + 1}</Text>/{total}
        </Text>
      </View>
    )
  }

  const submitReport = async () => {
    let userToken = await AsyncStorage.getItem('token');
    await fetch(GLOBAL.localhost+'reports',{
      method : 'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+userToken 
      },
      body: JSON.stringify({
        postId: postDetail.id,
        reason: baoCao
      })
    }).then(res=>res.json()).then(resJSON=>{
      Alert.alert('Thông báo',resJSON.message);
      setVisibleReport(false);
    });
    
  }

  const changePostRadio = (index) => {
    setSelectedIndexPost(index);
  }
  const changeBaoCao = (value) => {
    setBaoCao(value);
  }
  const renderRightAction = () =>{
    return(
      <>
        <Modal visible={visiblePost} 
          backdropStyle={{  backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Card disabled={true} header={headerReport} style={{minHeight:200,minWidth:280}}>
            <RadioGroup
            selectedIndex={selectedIndexPost}
            onChange={(index) => {changePostRadio(index)}}>
              <Radio>Sửa bài viết</Radio>
              <Radio>Xoá bài viết</Radio>
            </RadioGroup>
            <View style={{marginTop:15}}>
              <Button onPress={onVisiblePress} size='medium'>
                  Tiếp tục
              </Button> 
              <Button onPress={onCancelEditPress} 
                size='medium' appearance='ghost'>
                Huỷ bỏ
              </Button>               
            </View>
          </Card>
        </Modal>               
        <Modal visible={visibleReport} 
          backdropStyle={{  backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Card disabled={true} header={headerReport} style={{minHeight:200,minWidth:280}}>
          <Input
              multiline={true}
              value={baoCao}
              label={()=><Text style={styles.label}  category='label'>Báo cáo</Text>}
              placeholder='Nhập lý do báo cáo ( nếu có )'
              onChangeText={nextValue => {changeBaoCao(nextValue)}}
              style={{backgroundColor:'white',
              marginBottom:5}}
              textStyle={{height:windowHeight/10}}  
              numberOfLines={10} 
          />    
            <View style={{marginTop:15}}>
              <Button onPress={submitReport} size='medium'>
                  Tiếp tục
              </Button> 
              <Button onPress={onCancelReportPress} 
                size='medium' appearance='ghost'>
                Huỷ bỏ
              </Button>               
            </View>
          </Card>
        </Modal>        
        <View style={{flexDirection:'row',marginRight:10}}>
          <TouchableOpacity onPress={loveAction} style={{marginRight:20}}>
            <AntDesign name={ !love ? "hearto" : "heart" } size={25} color={ !love ? "white" : '#E65B6F'} />
          </TouchableOpacity>
          <OverflowMenu
            backdropStyle={{  backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            anchor={renderFlagAction}
            visible={menuVisible}
            onBackdropPress={toggleMenu}>
            <MenuItem  title='Báo cáo' onPress={onReportPress}/>
            <MenuItem  title='Quản lý bài viết'  onPress={onEditPress}/>
          </OverflowMenu>
      </View>
      </> 
    );
}

    return (
      <>
      {isLoading ? 
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Spinner size='giant' color='#0092f2'/>
            </View>
      :
      <>
<ScrollView style={styles.container}>
          <ImageBackground style={styles.image} 
            source={{uri:GLOBAL.localhost+postDetail.images[0]}}>
            <View style={{marginTop:30,marginLeft:15,flexDirection:'row',justifyContent:'space-between'}}>
             {renderBackAction()}
             {renderRightAction()}
            </View>
          </ImageBackground>
          <View style={styles.boxShadow}>
          <Card
              style={styles.bookingCard}
              appearance='filled'
              disabled={true}>
              <View style={{marginBottom:20}}>
                <Text
                style={styles.title}
                category='h6'>
                {postDetail.tieuDe}
                </Text>
                <Text
                style={styles.rentLabel}
                appearance='hint'
                category='p2'>
                Giá thuê: <Text category='p1' style={{color:'#E65B6F',fontWeight:'500'}}>{postDetail.postDetail.gia}đ/<Text style={{color:'#E65B6F',fontWeight:'200'}} category='s2' appearance='hint'>tháng</Text></Text>
                
                </Text>
                <Text
                style={styles.rentLabel}
                appearance='hint'
                category='p2'>
                Đặt cọc: <Text category='p1' style={{color:'#E65B6F',fontWeight:'500'}}> {postDetail.postDetail.datCoc}đ</Text>
                </Text>
               <View style={{flexDirection:'row',justifyContent:'space-around',padding:10,marginTop:20}}>
                 <View style={{alignItems:'center'}}>
                  <FontAwesome5 name="plug" size={24} color="#4f4f4f" />
                  <Text style={{marginTop:5,color:'#4f4f4f'}}>{postDetail.postDetail.giaTienDien}đ</Text>
                  </View>
                  <View style={{alignItems:'center'}}>
                  <Ionicons name="ios-water" size={24} color="#4f4f4f" />
                  <Text style={{marginTop:5,color:'#4f4f4f'}}>{postDetail.postDetail.giaTienNuoc}đ</Text>
                  </View>
                  <View style={{alignItems:'center'}}>
                  <FontAwesome5 name="wifi" size={24} color="#4f4f4f" />
                  <Text style={{marginTop:5,color:'#4f4f4f'}}>{postDetail.postDetail.giaTienWifi}đ</Text>
                  </View>
               </View>
              </View>
              <Divider />
              <View style={{marginTop:10,marginBottom:10}}>
                <Text style={{fontWeight:'500'}}
                  category='h6'>
                  Tiện ích
                </Text>
                <View style={{marginTop:10,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around'}}>
                  {renderFacilities()}
                </View>                
              </View>
              <Divider />
              <View style={{marginTop:10}}>
                  <Text
                      style={{fontWeight:'500'}}
                      category='h6'>
                      Địa chỉ
                </Text>
                <Text
                    style={styles.description}
                    appearance='hint'>
                    <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                    <FontAwesome name="map-marker" size={20} color="#808080" />
                      <Text style={{marginLeft:20,color:'#808080'}}>{postDetail.postDetail.diaChi}</Text>
                    </View>
                </Text> 
              </View>
              <View style={{marginTop:10,marginBottom:10}}>
                <Text style={{fontWeight:'500'}}
                  category='h6'>
                  Thông tin
                </Text>
                <Text
                style={styles.description}
                appearance='hint'>
                {postDetail.postDetail.moTa}
              </Text>               
              </View>
              <Divider />
              <View style={{marginTop:10}}>
                  <Text
                      style={{fontWeight:'500'}}
                      category='h6'>
                      Ngày đăng
                </Text>
                <Text
                    style={styles.description}
                    appearance='hint'>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="clock" size={20} color="#808080" />
                      <Text style={{marginLeft:20,color:'#808080'}}>{moment(postDetail.ngayDang).fromNow()}</Text>
                    </View>
                </Text> 
              </View>
              <Divider />

              <Divider />
              <View style={{marginTop:10,marginBottom:10}}>
                <Text
                style={{fontWeight:'500'}}
                category='h6'>
                Hình ảnh
                </Text>
                <Swiper containerStyle={styles.imagesList} loop={false}
                                autoplay={false} 
                                renderPagination={renderPagination}
                                >
                  {postDetail.images.map((item,key)=>renderImage(item,key))}
                </Swiper>
                {/* <List
                contentContainerStyle={styles.imagesList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={dataImage}
                renderItem={renderImage}
                />         */}
              </View>
          </Card>       
          </View>
        </ScrollView>
        <Button onPress={makeCall} accessoryLeft={renderInfiniteAnimationIcon} style={styles.buttonStyle}>

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
    height: windowHeight/2,
  },
  bookingCard: {
    marginTop: -80,
    margin: 16,
    borderTopRightRadius:20,
    borderTopLeftRadius:20
  },
  layout:{
    marginHorizontal:16,
    marginBottom:16,
    borderRadius:6
  },
  title: {
    width: '100%',
  },
  rentLabel: {
    marginTop: 10,
  },
  facilitiesList:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: -4,
    marginVertical: 8
  },
  optionItem: {
    marginHorizontal: 4,
    paddingHorizontal: 0,
  },
  description: {
    marginHorizontal: 16,
    marginVertical: 8,
    color:'#808080'
  },
  sectionLabel: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  imagesList: {
    marginTop:10,
    backgroundColor: 'white',
    height:windowHeight/2.5,
    marginLeft:20
  },
  imageItem: {
    width: windowWidth/1.4,
    height: windowHeight/2.5,
    borderRadius: 8,

  },
  icon:{
    width:26,
    height:26,
  },
  boxShadow:{
    shadowColor : '#000',
    shadowOpacity : 0.2,
    shadowRadius : 3,
    shadowOffset : {width:0,height:2},
},
paginationStyle: {
  position: 'absolute',
  bottom: windowHeight/2.5,
  right: 10
},
paginationText: {
  color: '#E65B6F',
  fontSize: 20
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