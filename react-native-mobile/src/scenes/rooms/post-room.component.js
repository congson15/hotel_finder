import * as React from 'react';
import { StyleSheet, View, Alert, Dimensions, TouchableOpacity, Image,  } from 'react-native';
import { TopNavigation, TopNavigationAction, Text, Layout, Input, Button, Select, SelectItem, IndexPath, Icon, Spinner  } from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import StepIndicator from 'react-native-step-indicator';
import Swiper from 'react-native-swiper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { ArrowIosBackIcon } from '../../layouts/assets/icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CheckBoxStep3 from './checkbox-step3';
import axios from 'axios';
import GLOBAL from '../../GLOBAL';
import AsyncStorage from '@react-native-community/async-storage';
const labels = ["Thông tin","Địa chỉ","Tiện ích","Xác nhận"];

const windowWidth= Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const initialDistrict = [{"id":"760","name":"Quận 1"},{"id":"771","name":"Quận 10"},{"id":"772","name":"Quận 11"},{"id":"761","name":"Quận 12"},{"id":"769","name":"Quận 2"},{"id":"770","name":"Quận 3"},{"id":"773","name":"Quận 4"},{"id":"774","name":"Quận 5"},{"id":"775","name":"Quận 6"},{"id":"778","name":"Quận 7"},{"id":"776","name":"Quận 8"},{"id":"763","name":"Quận 9"},{"id":"777","name":"Quận Bình Tân"},{"id":"765","name":"Quận Bình Thạnh"},{"id":"764","name":"Quận Gò Vấp"},{"id":"768","name":"Quận Phú Nhuận"},{"id":"766","name":"Quận Tân Bình"},{"id":"767","name":"Quận Tân Phú"},{"id":"762","name":"Quận Thủ Đức"},{"id":"785","name":"Huyện Bình Chánh"},{"id":"784","name":"Huyện Hóc Môn"},{"id":"787","name":"Huyện Cần Giờ"},{"id":"783","name":"Huyện Củ Chi"},{"id":"786","name":"Huyện Nhà Bè"}];
const thanhPho = 'Hồ Chí Minh'; 


const IndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 1,
  stepStrokeCurrentColor: '#E65B6F',
  stepStrokeWidth: 1,
  separatorStrokeFinishedWidth: 4,
  stepStrokeFinishedColor: '#E65B6F',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#E65B6F',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#E65B6F',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: '#E65B6F',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#E65B6F',
};




const changeIcon = ( position, stepStatus ) => {
  const iconConfig = {
    name: 'feed',
    color: stepStatus === 'finished' ? '#ffffff' : '#E65B6F',
    size: 15,
  };
  switch(position){
    case 0: {
      iconConfig.name = stepStatus === 'finished' ? 'check' : 'info-outline';
      break;
    }
    case 1: {
      iconConfig.name = stepStatus === 'finished' ? 'check' :'pin-drop';
      break;
    }
    case 2: {
      iconConfig.name = stepStatus === 'finished' ? 'check' :'format-list-bulleted';
      break;
    }
    case 3: {
      iconConfig.name = 'check';
      break;
    }
    default:{
      iconConfig.name = 'check';
      iconConfig.color = '#E65B6F';
      break;
    }
    
  }
  return iconConfig;
}

export function PostRoom({ navigation, route }){
    const [currentPage, setCurrentPage] = React.useState(0);
    const [ title, setTitle ] = React.useState(''); 
    const [ dienTich, setDienTich ] = React.useState(''); 
    const [ sucChua, setSucChua ] = React.useState(''); 
    const [ giaChoThue, setGiaChoThue ] = React.useState(''); 
    const [ datCoc, setDatCoc ] = React.useState(''); 
    const [ tienDien, setTienDien ] = React.useState('');  
    const [ tienNuoc, setTienNuoc ] = React.useState(''); 
    const [ tienWifi, setTienWifi ] = React.useState(''); 
    const [ soDienThoai, setSoDienThoai ] = React.useState(''); 
    const [ moTa, setMoTa ] = React.useState(''); 
    const [ warning, setWarning ] = React.useState(false);
    const [ selectedWardIndex, setSelectedWardIndex ] = React.useState(new IndexPath(0));
    const [ selectedDistrictIndex, setSelectedDistrictIndex ] = React.useState(new IndexPath(0));
    const [ initialWard, setInitialWard ] = React.useState([]);
    const [ tenDuong, setTenDuong ] = React.useState(''); 
    const [ isLoading, setIsLoading ] = React.useState(true);
    const initialPhotos = [];
    const [ photoList, setPhotoList ] = React.useState(initialPhotos);
    const [ facilities, setFacilities] = React.useState([]);
    const [ isEdit, setEdit ] = React.useState(false);

    React.useEffect(()=>{
      if(route.params?.postDetail){
        setEdit(true);
        let editData = route.params.postDetail;
        
        setTitle(editData.tieuDe);
        setDienTich(editData.postDetail.dienTich);
        setSucChua(editData.postDetail.sucChua);
        setGiaChoThue(editData.postDetail.gia);
        setDatCoc(editData.postDetail.datCoc);
        setTienDien(editData.postDetail.giaTienDien);
        setTienNuoc(editData.postDetail.giaTienNuoc);
        setTienWifi(editData.postDetail.giaTienWifi);
        let address = editData.postDetail.diaChi.split(',');
        setTenDuong(address[0]);
        let districtIndex = initialDistrict.findIndex(item=>item.name===address[2].trim());
        let tempImages = editData.images.map(item=>item=GLOBAL.localhost+item);
        let final=[];
        tempImages.forEach(image=>final.push({uri:image}));
        setPhotoList(final);
        setSoDienThoai(editData.postDetail.soDienThoai);
        setMoTa(editData.postDetail.moTa);


      }
    },[route.params?.postDetail]);

    const renderStepIndicator = (params) => (
      <MaterialIcons {...changeIcon( params.position, params.stepStatus )} />
    );

    
    
      React.useEffect(() => {
          async function getWard(){
            await fetch('https://api.mysupership.vn/v1/partner/areas/commune?district='+initialDistrict[selectedDistrictIndex.row].id)
            .then(res=>res.json()).then(resJSON => setInitialWard(resJSON.results)).finally(()=>setIsLoading(false));
          }
          getWard();
      },[initialDistrict[selectedDistrictIndex.row].id]);


      const renderOption = (id,title) => {
        return(
        <SelectItem key={id} title={title}/>
        );
      };
  
    const renderDistrict =  () => {
        return(
            <Select
            style={styles.select}
            label={()=><Text style={styles.label}  category='label'>Chọn quận/huyện</Text>}
            selectedIndex={selectedDistrictIndex}
            value={initialDistrict[selectedDistrictIndex.row].name}
            onSelect={index => {setSelectedDistrictIndex(index)}}>
              {initialDistrict.map((data) => renderOption(data.id,data.name))}
            </Select>
            );
        } 
    const renderWard = () => {

      return(
        <>
         { isLoading ? 
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Spinner size='giant' />
          </View> :
          <Select
          style={styles.select}
          label={()=><Text style={styles.label}  category='label'>Chọn phường/xã</Text>}
          selectedIndex={selectedWardIndex}
          value={initialWard[selectedWardIndex.row].name}
          onSelect={index => setSelectedWardIndex(index)}>
            {initialWard.map((data) => renderOption(data.code,data.name))}
          </Select>   }
          </>
      )
    }    

    const renderBackAction = () =>{
        if(currentPage!==0){
        return(
            <TopNavigationAction
            icon={ArrowIosBackIcon}
            onPress={() => setCurrentPage(currentPage-1)}
          />    
        );    
        }
        else{
        return(
            <TopNavigationAction/>              
        );
        }
        }
    const renderButtonAction = () => {
      let position = currentPage+1;

      switch(position){
        case 1:{
          if(!title.trim() || !tienWifi.trim() || !tienNuoc.trim() ||
          !tienDien.trim() || !datCoc.trim() || !giaChoThue.trim() || 
          !dienTich.trim() || !sucChua.trim() )
          {
              setWarning(true);
              break;;
          }
          setCurrentPage(position);
          break;
        }
        case 2:{
          if(!tenDuong.trim() )
          {
              setWarning(true);
              break;;
          }
          setCurrentPage(position);
          break;
        }
        case 3:{
          if(photoList.length==0 || photoList.length <= 4 || facilities.length===0)
          {
              setWarning(true);
              Alert.alert('Cảnh báo','Chưa đủ 5 tấm hình và ít nhất 1 tiện ích');
              break;;
          }
          setCurrentPage(position);
          break;
        }
      }
    }
    const renderRightAction = () =>{
        return( 
            <Text category='h6' onPress={navigation.goBack} style={styles.rightText}>
                Huỷ
            </Text>
             
        );
    }  
    
    const renderTitle = () => {
        return(
        <View>
            <Text style={styles.titleText} category='h6'>
                Đăng bài
            </Text>
        </View>
        );
    }
  
    const onStepPress = (position) => {
      switch(position){
        case 1:{
          if(!title.trim() || !tienWifi.trim() || !tienNuoc.trim() ||
          !tienDien.trim() || !datCoc.trim() || !giaChoThue.trim() || 
          !dienTich.trim() || !sucChua.trim() )
          {
              setWarning(true);
              break;;
          }
          setCurrentPage(position);
          break;
        }
        case 2:{
          if(!tenDuong.trim())
          {
              setWarning(true);
              break;;
          }
          setCurrentPage(position);
          break;
        }
        case 3:{
          if(photoList.length==0 || photoList.length <= 4)
          {
              setWarning(true);
              break;;
          }
          setCurrentPage(position);
          break;
        }
        default:{
          setCurrentPage(position);
        }
  }
}

    
    const step1 = () => {       
        return(
            <KeyboardAwareScrollView
            contentContainerStyle= {{ flexGrow: 1 }}
            bounces= 'true'
            bouncesZoom= 'true'
            alwaysBounceVertical= 'false'
            alwaysBounceHorizontal= 'false'
            enableOnAndroid = {true}>
            <Layout style={styles.stepContainer}>
                <Text style={styles.title}>Thông tin chung</Text>
                <Input
                    value={title}
                    label={()=><Text style={styles.label}  category='label'>Tiêu đề</Text>}
                    placeholder='Nhập tiêu đề'
                    caption={()=>(
                    warning == true && title.length==0?
                    <Text style={{color:'red',fontWeight:'300'}}  category='label'>Vui lòng không bỏ trống</Text>
                    :
                    <Text style={{color:'red',fontWeight:'300'}}  category='label'></Text>
                    )
                }
                    onChangeText={(nextValue) => {updateTitle(nextValue)}}
                    style={styles.input}     
            />
                <Input
                value={dienTich}
                label={()=><Text style={styles.label}  category='label'>Diện tích</Text>}
                placeholder='Nhập diện tích phòng'
                accessoryRight={()=><Text>m2</Text>}
                caption={()=>(
                    warning == true && dienTich.length==0? 
                    <Text style={{color:'red',fontWeight:'300'}}  category='label'>Vui lòng không bỏ trống</Text>
                    :
                    <Text style={{color:'red',fontWeight:'300'}}  category='label'></Text>
                    )
                }
                onChangeText={(nextValue) => {updateArea(nextValue)}}
                keyboardType='numeric'
                style={styles.input}     
            />
                <Input
                value={sucChua}
                label={()=><Text style={styles.label}  category='label'>Sức chứa</Text>}
                placeholder='Nhập sức chứa'
                accessoryRight={()=><Text>người/phòng</Text>}
                caption={()=>(
                    warning == true && sucChua.length==0?
                    <Text style={{color:'red',fontWeight:'300'}}  category='label'>Vui lòng không bỏ trống</Text>
                    :
                    <Text style={{color:'red',fontWeight:'300'}}  category='label'></Text>
                    )
                }
                onChangeText={(nextValue) => {updateSucChua(nextValue)}}
                keyboardType='numeric'
                style={styles.input}     
            />       
            <Text style={styles.title}>Chi phí</Text> 
            <Input
                    value={giaChoThue}
                    label={()=><Text style={styles.label}  category='label'>Giá cho thuê</Text>}
                    placeholder='Nhập giá cho thuê'
                    keyboardType='numeric'
                    caption={()=>(
                        warning == true && giaChoThue.length==0?
                        <Text style={{color:'red',fontWeight:'300'}}  category='label'>Vui lòng không bỏ trống</Text>
                        :
                        <Text style={{color:'red',fontWeight:'300'}}  category='label'></Text>
                        )
                    }
                    accessoryRight={()=><Text>VNĐ/phòng</Text>}
                    onChangeText={(nextValue) => {updateGiaThue(nextValue.replace(/\D/g,"").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))}}
                    style={styles.input}     
            />
                <Input
                value={datCoc}
                label={()=><Text style={styles.label}  category='label'>Đặt cọc</Text>}
                placeholder='Nhập tiền đặt cọc'
                caption={()=>(
                    warning == true && datCoc==0 ?
                    <Text style={{color:'red',fontWeight:'300'}}  category='label'>Vui lòng không bỏ trống</Text>
                    :
                    <Text style={{color:'red',fontWeight:'300'}}  category='label'></Text>
                    )
                }
                accessoryRight={()=><Text>VNĐ</Text>}
                onChangeText={(nextValue) => {updateDatCoc(nextValue.replace(/\D/g,"").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))}}
                keyboardType='numeric'
                style={styles.input}     
            />
                <Input
                value={tienDien}
                label={()=><Text style={styles.label}  category='label'>Tiền điện</Text>}
                placeholder='Nhập tiền điện'
                caption={()=>(
                    warning == true && tienDien==0?
                    <Text style={{color:'red',fontWeight:'300'}}  category='label'>Vui lòng không bỏ trống</Text>
                    :
                    <Text style={{color:'red',fontWeight:'300'}}  category='label'></Text>
                    )
                }
                accessoryRight={()=><Text>VNĐ</Text>}
                onChangeText={(nextValue) => {updateTienDien(nextValue.replace(/\D/g,"").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))}}
                keyboardType='numeric'
                style={styles.input}     
            />    
                <Input
                value={tienNuoc}
                label={()=><Text style={styles.label}  category='label'>Tiền nước</Text>}
                placeholder='Nhập tiền nước'
                caption={()=>(
                    warning == true && tienNuoc==0 ?
                    <Text style={{color:'red',fontWeight:'300'}}  category='label'>Vui lòng không bỏ trống</Text>
                    :
                    <Text style={{color:'red',fontWeight:'300'}}  category='label'></Text>
                    )
                }
                accessoryRight={()=><Text>VNĐ</Text>}
                onChangeText={(nextValue) => {updateTienNuoc(nextValue.replace(/\D/g,"").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))}}
                keyboardType='numeric'
                style={styles.input}     
            />  
                <Input
                value={tienWifi}
                label={()=><Text style={styles.label}  category='label'>Tiền Wifi</Text>}
                placeholder='Nhập tiền Wifi'
                caption={()=>(
                    warning == true && tienWifi==0?
                    <Text style={{color:'red',fontWeight:'300'}}  category='label'>Vui lòng không bỏ trống</Text>
                    :
                    <Text style={{color:'red',fontWeight:'300'}}  category='label'></Text>
                    )
                }
                accessoryRight={()=><Text>VNĐ</Text>}
                onChangeText={(nextValue) => {updateTienWifi(nextValue.replace(/\D/g,"").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."))}}
                keyboardType='numeric'
                style={styles.input}     
            />   
              <Button 
              onPress={renderButtonAction}
              >
                Tiếp theo
              </Button>                                               
            </Layout>             
            </KeyboardAwareScrollView>
        );
    }        

    const updateTitle = (value) =>{
      setTitle(value);
    }   
    const updateArea = (value) =>{
      setDienTich(value);
    }   
    const updateSucChua = (value)=>{
      setSucChua(value);
    }
    const updateGiaThue = (value) =>{
      setGiaChoThue(value);
    }   
    const updateDatCoc = (value) =>{
      setDatCoc(value);
    }   
    const updateTienDien = (value) =>{
      setTienDien(value);
    }   
    const updateTienNuoc = (value) =>{
      setTienNuoc(value);
    }   
    const updateTienWifi = (value) =>{
      setTienWifi(value);
    }   
    const updateTenDuong = (value)=>{
      setTenDuong(value);
    }


    const step2 = () => {    
        
        return(
            <KeyboardAwareScrollView
            contentContainerStyle= {{ flexGrow: 1 }}
            bounces= 'true'
            bouncesZoom= 'true'
            alwaysBounceVertical= 'false'
            alwaysBounceHorizontal= 'false'
            enableOnAndroid = {true}>
            <Layout style={styles.stepContainer}>
                <Text style={styles.title}>Thông tin chung</Text>
                <Input
                    value={thanhPho}
                    label={()=><Text style={styles.label}  category='label'>Thành phố</Text>}
                    disabled='true'
                    label=''
                    style={styles.input}     
            />
            
            <Input
                    value={tenDuong}
                    label={()=><Text style={styles.label}  category='label'>Tên đường</Text>}
                    placeholder='Nhập tên đường'
                    caption={()=>(
                        warning == true && tenDuong.length==0?
                        <Text style={{color:'red',fontWeight:'300'}}  category='label'>Vui lòng không bỏ trống</Text>
                        :
                        <Text style={{color:'red',fontWeight:'300'}}  category='label'></Text>
                        )
                    }
                    onChangeText={(nextValue) => {updateTenDuong(nextValue)}}
                    style={styles.input}     
            />
           
              {renderDistrict()}  
              {renderWard()}     
              <Button 
              onPress={renderButtonAction}
              style={{marginTop:10}}>
                Tiếp theo
              </Button>       
            </Layout>
   
        
            </KeyboardAwareScrollView>
        );
      }  

    //STEP 3 START//
  
    React.useEffect(()=>{
      
      if(route.params?.photoList){
        photoList.map(item=>route.params.photoList.push(item));
        setPhotoList(route.params.photoList);
        delete route.params.photoList;
      }
      
    },[route.params?.photoList,photoList]);
    
    React.useEffect(()=>{
      
      if(route.params?.imageJSON){
        
        setPhotoList([...photoList,JSON.parse(route.params.imageJSON)]);
  
        delete route.params.imageJSON;
        
      }    
    },[route.params?.imageJSON])

  const onSubmit = async () => {
    let finalFacilties = facilities.join('-');
    let userToken = await AsyncStorage.getItem('token');
    console.log(userToken);
    var FormData = require('form-data');
    let formData = new FormData();
    let detailPost = JSON.stringify({
      tieuDe: title,
      postDetail: {
        gia: giaChoThue,
        datCoc: datCoc,
        giaTienDien: tienDien,
        giaTienNuoc: tienNuoc,
        giaTienWifi: tienWifi,
        dienTich: dienTich,
        sucChua:sucChua,
        trangThaiPhong:false,
        diaChi:tenDuong+', '+initialWard[selectedWardIndex.row].name+', '+initialDistrict[selectedDistrictIndex.row].name+', '+thanhPho,
        chuoiTienIch:finalFacilties,
        moTa:moTa,
        soDienThoai:soDienThoai
      }
    })
    formData.append('post',detailPost);
    photoList.forEach((image) => {
      
      const file = {
        uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
        name: image.name===undefined ? 'image' : image.name,
        type: 'multipart/form-data'
      };
      formData.append('images', file);
      
    });
    console.log(formData);
    
     let res = await fetch(GLOBAL.localhost+'posts',{
      method: 'POST' , 
      headers:{
        'Content-Type': 'multipart/form-data',
        'Authorization': "Bearer "+userToken 
      },
      body: formData
    });
    let responJSON = await res.json();
    if(responJSON.statusCode===0){
      Alert.alert('Thông báo','Vui lòng xác thực email trước khi đăng bài');
      navigation.navigate('Account');
    }
    else{
      navigation.navigate('SuccessPost');
    }
    
  }
  const onEdit = async () => {
    let finalFacilties = facilities.join('-');
    let userToken = await AsyncStorage.getItem('token');
    console.log(userToken);
    var FormData = require('form-data');
    let formData = new FormData();
    let detailPost = JSON.stringify({
      tieuDe: title,
      postDetail: {
        gia: giaChoThue,
        datCoc: datCoc,
        giaTienDien: tienDien,
        giaTienNuoc: tienNuoc,
        giaTienWifi: tienWifi,
        dienTich: dienTich,
        sucChua:sucChua,
        trangThaiPhong:false,
        diaChi:tenDuong+', '+initialWard[selectedWardIndex.row].name+', '+initialDistrict[selectedDistrictIndex.row].name+', '+thanhPho,
        chuoiTienIch:finalFacilties,
        moTa:moTa,
        soDienThoai:soDienThoai
      }
    })
    formData.append('post',detailPost);
    photoList.forEach((image) => {
      const file = {
        uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
        name: image.name,
        type: 'multipart/form-data'
      };
      formData.append('images', file);
      
    });
    console.log(formData);
    
     let res = await fetch(GLOBAL.localhost+'posts',{
      method: 'PUT' , 
      headers:{
        'Content-Type': 'multipart/form-data',
        'Authorization': "Bearer "+userToken 
      },
      body: formData
    });
    let responJSON = await res.json();
    if(responJSON.statusCode===0){
      Alert.alert('Thông báo','Vui lòng xác thực email trước khi đăng bài');
      navigation.navigate('Account');
    }
    else{
      navigation.navigate('SuccessPost');
    }
          
  }
  const renderImage = (item, i) => {

    return (
     <Image
        style={{ height: 100, width: 100,marginLeft:20, marginBottom:20,borderColor:'rgb(234,234,234)',borderWidth:1,borderRadius:15}}
        resizeMode='cover'
        source={{ uri: item.uri }}
        key={i}
      />
    )
  }    
    const step3 = () => {
      return (
        <View style={styles.container3}>
          <Text category='h6' style={{fontWeight:'500',marginBottom:5}} >Hình ảnh</Text>
          <Layout
                style={styles.header3}
                
                level='1'
                >
            <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {photoList.map((item,key)=>renderImage(item,key))}
            </View>
            <TouchableOpacity style={{alignItems:'center',padding:40}} onPress={()=>{navigation.navigate('ImageBrowser')}}>
            <Icon name='image' fill='#83838383' style={{height:30,width:30}}/>
            <Text
              style={styles.titleLabel3}
              appearance='hint'>
              Nhấn vào đây để thêm hình ảnh
            </Text>
            </TouchableOpacity>
            <Text
              style={{fontWeight:'200',color:!warning ?'#838383':'red',marginBottom:5}}
              category='p2'
              >
              Vui lòng thêm ít nhất 5 ảnh(tối đa 20 ảnh).
            </Text>
          </Layout>
          <Button onPress={()=>{navigation.navigate('Camera')}} appearance='outline' style={{backgroundColor:'#ffffff',marginHorizontal:50,borderRadius:10}}>Chụp hình</Button>
          <Text category='h6' style={{fontWeight:'500',marginBottom:5,marginTop:20}} >Tiện ích</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>
            <CheckBoxStep3 facilities={facilities}/>
          </View> 
            <Button 
              onPress={renderButtonAction}
              style={{marginTop:10}}>
                Tiếp theo
            </Button>       
           
        </View>
      );
    }
    //STEP 3 END//
    //STEP 4 START//
    const updateSoDienThoai = (value) => {
      setSoDienThoai(value)
    }
    const updateMoTa = (value) => {
      setMoTa(value);
    }
    const step4 = () => {
      return(
        <Layout style={styles.stepContainer}>
          <Text style={styles.title} >Xác nhận</Text>
          <Input
              value={soDienThoai}
              label={()=><Text style={styles.label}  category='label'>Số điện thoại liên lạc</Text>}
              placeholder='Nhập số điện thoại'
              caption={()=>(
              warning == true && soDienThoai.length==0?
              <Text style={{color:'red',fontWeight:'300'}}  category='label'>Vui lòng không bỏ trống</Text>
              :
              <Text style={{color:'red',fontWeight:'300'}}  category='label'></Text>
              )
          }
              onChangeText={(nextValue) => {updateSoDienThoai(nextValue)}}
              style={styles.input}     
              keyboardType='numeric'
          />
          <Input
              multiline={true}
              value={moTa}
              label={()=><Text style={styles.label}  category='label'>Mô tả</Text>}
              placeholder='Nhập mô tả ( nếu có )'
              onChangeText={(nextValue) => {updateMoTa(nextValue)}}
              style={styles.input}
              textStyle={{height:windowHeight/10}}  
              numberOfLines={10} 
          />     
             <Button 
              onPress={isEdit ? onEdit : onSubmit}
              style={{marginTop:10}}>
                Xác nhận
            </Button>       
        </Layout>
      )      
    }

    //STEP4 END//

    return(
        <>
                <TopNavigation 
                alignment='center'
                title={renderTitle}
                accessoryRight={renderRightAction}
                accessoryLeft={renderBackAction}
                
                />
                <View style={styles.stepIndicator}>
                        <StepIndicator
                            customStyles={IndicatorStyles}
                            currentPosition={currentPage}
                            stepCount='4'
                            labels={labels}
                            renderStepIndicator={renderStepIndicator}
                            onPress={onStepPress}
                        />     
                </View>  
                          
              <Swiper
                style={{ flexGrow: 1 }}
                loop={false}
                index={currentPage}
                autoplay={false} 
                showsPagination={false}
                scrollEnabled={false}
                >
              
                <ScrollView style={{backgroundColor:'white'}}>
                {step1()}
                </ScrollView>
                <ScrollView style={{backgroundColor:'white'}}>
                {step2()}
                </ScrollView>
                <ScrollView style={{backgroundColor:'white'}}>
                {step3()}
                </ScrollView>     
                <ScrollView style={{backgroundColor:'white'}}>
                {step4()}
                </ScrollView>                  
                
             </Swiper>  
            

        </>
        
    );    
}

const styles = StyleSheet.create({

    stepIndicator: {
        backgroundColor: 'white',
        marginVertical: 0,
      },
      page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      stepLabel: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
        color: '#999999',
      },
      stepLabelSelected: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
        color: '#4aae4f',
      },
    titleHeader:{
        justifyContent:'center'
    },
    rightText:{
        color:'#aaaaaa',
        fontWeight:'300',
        marginRight:5
    },
    titleText: {
        fontWeight:'300'
        
      },
    stepContainer:{
        flex:1,
        marginHorizontal:20,
        backgroundColor:'white'
    },
    title:{
        fontWeight:'500',
        marginVertical:10
    },
    input:{
        backgroundColor:'white',
        marginBottom:5
    },
    label:{
        fontWeight:'300',
        marginBottom:0
    },
    select:{
      marginBottom:10
    },
    container3: {
      flex: 1,
      marginHorizontal:20,
      marginTop:50
    },
    header3: {
      alignItems:'center',
      backgroundColor:'transparent',
      marginBottom: 20,
      borderColor:'#aaaaaa',
      borderWidth:1.5,
      borderStyle:'dashed'
    },
    titleLabel3: {
      textAlign:'center',
      fontWeight:'100',
      fontSize:25
    },
    controlContainer3: {
      flexDirection:'row',
      width:windowWidth/2.5,
      borderRadius: 5,
      marginHorizontal: 5,
      marginVertical: 5,
      padding: 5,
    },

    warning: {
      borderColor:'#CC3300',
    }
})