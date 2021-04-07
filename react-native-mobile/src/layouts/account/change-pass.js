import * as React from 'react';
import { Input, Text, Button } from '@ui-kitten/components';
import { StyleSheet, View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GLOBAL from '../../GLOBAL';
import AsyncStorage from '@react-native-community/async-storage';
export function ChangePassLayout({navigation}){
    const [ oldPassword, setOldPassword ] = React.useState('');
    const [ newPassword, setNewPassword ] = React.useState('');
    const [ rePassword, setRepassword ] = React.useState('');
    const [secureTextEntry] = React.useState(true);

    const onChangePass = async () =>{

        let userToken = await AsyncStorage.getItem('token');
        const result = await fetch(GLOBAL.localhost+'users/changepassword',{
            method: 'POST',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer "+userToken 
              },
              body: JSON.stringify({
                oldPassword : oldPassword,
                newPassword : newPassword
              })
        }).then(res=>res.json()).then(resJSON=>{
            console.log(resJSON.statusCode);
            if(resJSON.statusCode===-1){
                Alert.alert('Thông báo',resJSON.message);
            }
            else{
                Alert.alert('Thông báo','Đổi mật khẩu thành công');
                navigation.goBack;
            }
        });
}

    const onSavePress = () => {
        if(!oldPassword.trim() || !newPassword.trim() || !rePassword.trim()){
            Alert.alert('Thông báo','Vui lòng nhập đủ thông tin');
        }
        else if(newPassword!=rePassword){
            Alert.alert('Thông báo','Mật khẩu không khớp');
        }
        else{
            Alert.alert(
                "Thông báo",
                "Bạn xác nhận đổi mật khẩu ?",
                [
                  {
                    text: "Huỷ bỏ",
                    style: "cancel"
                  },
                  { text: "Xác nhận", 
                     onPress: () => onChangePass(),
                }
                ],
                { cancelable: false }
              );
            }
          };

    return(
        <KeyboardAwareScrollView
        contentContainerStyle= {{ flexGrow: 1 }}
        bounces= 'false'
        bouncesZoom= 'false'
        alwaysBounceVertical= 'false'
        alwaysBounceHorizontal= 'false'
        enableOnAndroid = {true}>
        <View style={styles.container}>
            <Text style={styles.title}>Mật khẩu cũ</Text>
            <Input
                style={styles.passwordInput}
                value={oldPassword}
                
                secureTextEntry={secureTextEntry}
                onChangeText={setOldPassword}
                />  
            <Text style={styles.title}>Mật khẩu mới</Text>     
            <Input
                style={styles.passwordInput}
                value={newPassword}
                secureTextEntry={secureTextEntry}
                onChangeText={setNewPassword}
                />   
            <Text style={styles.title}>Nhập lại mật khẩu mới</Text>    
            <Input
                style={styles.passwordInput}
                value={rePassword}
                secureTextEntry={secureTextEntry}
                onChangeText={setRepassword}
                />                                   
        </View>
        <View style={styles.buttonContainer}>
            <Button onPress={onSavePress}> Lưu thay đổi</Button>
        </View>
        </KeyboardAwareScrollView>
        
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        padding:20
        
    },
    passwordInput:{
        marginTop: 5,
        marginBottom:15,
        backgroundColor:'#F1F0F0',
    },
    title:{  
        fontWeight:'400'
    },
    buttonContainer:{
        margin:20
    }
})