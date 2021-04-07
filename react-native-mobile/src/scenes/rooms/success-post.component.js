import React from 'react';
import { Image, Dimensions, View } from 'react-native';
import { TopNavigation, Text, Button } from '@ui-kitten/components';
import successImage from '../../layouts/assets/image_xacnhan.png';
import StepIndicator from 'react-native-step-indicator';
import { MaterialIcons } from '@expo/vector-icons'; 

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const labels = ["Thông tin","Địa chỉ","Tiện ích","Xác nhận"];
const IndicatorStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 1,
    currentStepStrokeWidth: 1,
    stepStrokeCurrentColor: '#E65B6F',
    stepStrokeWidth: 1,
    separatorStrokeFinishedWidth: 4,
    stepStrokeFinishedColor: '#E65B6F',
    stepStrokeUnFinishedColor: '#E65B6F',
    separatorFinishedColor: '#E65B6F',
    separatorUnFinishedColor: '#E65B6F',
    stepIndicatorFinishedColor: '#E65B6F',
    stepIndicatorUnFinishedColor: '#E65B6F',
    stepIndicatorCurrentColor: '#E65B6F',
    stepIndicatorLabelFontSize: 15,
    currentStepIndicatorLabelFontSize: 15,
    stepIndicatorLabelCurrentColor: '#E65B6F',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#E65B6F',
    labelColor: '#E65B6F',
    labelSize: 13,
    currentStepLabelColor: '#E65B6F',
  };

  const changeIcon = ( position, stepStatus ) => {
    const iconConfig = {
      name: 'check',
      color: '#ffffff',
      size: 15,
    };
    return iconConfig;
  }

export function SuccessPost({navigation}){
    const renderStepIndicator = (params) => (
        <MaterialIcons {...changeIcon( params.position, params.stepStatus )} />
      );
    const renderTitle = () => {
        return(
        <View>
            <Text style={{fontWeight:'300'}} category='h6'>
                Đăng bài
            </Text>
        </View>
        );
    }
    return(
        <View style={{flexDirection: 'columm',flexGrow:1,justifyContent:'space-between'}}>
        <View>
         <TopNavigation 
                alignment='center'
                title={renderTitle}
                />
            <View style={{backgroundColor: 'white',paddingBottom:5}}>
                        <StepIndicator
                            customStyles={IndicatorStyles}
                            stepCount='4'
                            labels={labels}
                            renderStepIndicator={renderStepIndicator}
            />       
            </View>  
            <View >
                <Image source={successImage} style={{height:windowHeight/4.9, width:windowWidth, resizeMode:"contain",backgroundColor:'#ffffff'}}/>
                <View style={{marginTop:50}}>
                    <Text style={{textAlign:'center',fontWeight:'500',marginBottom:20, color:'#383838'}} category='h6'>Yêu cầu đăng bài của bạn đã được gửi đi</Text>
                    <Text style={{textAlign:'center',fontWeight:'400',color:'#b5b3b3'}} category='p1'>Chúng tôi sẽ xem xét và phê duyệt yêu cầu của bạn trong thời gian sớm nhất</Text>
                </View>
            </View>
            </View>
            <View style={{marginBottom:50,marginHorizontal:20}}>
                <Button 
                onPress={()=>{navigation.navigate('Main')}}
                style={{marginTop:10}}>
                    Trở về trang chủ
                </Button>   

            </View>
        </View>
    )
}