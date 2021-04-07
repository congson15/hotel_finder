import * as React from 'react';
import * as eva from '@eva-design/eva';
import { StyleSheet, View, TouchableWithoutFeedback, ImageBackground, Alert } from 'react-native';
import { Button, Input, Text, Icon } from '@ui-kitten/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { EmailIcon } from '../assets/icons';
import  backgroundImage  from './assets/image-background.jpg';
import GLOBAL from '../../GLOBAL';
import axios from 'axios';
export function ForgotPasswordLayout({ navigation }) {

    const [email, setEmail] = React.useState('');

    const onResetPasswordButtonPress = async () => {
        await fetch(GLOBAL.localhost+'users/recoverypassword',{
          method:'POST',
          headers:{
            Accept:'application/json',
            'content-type': 'application/json'
          },
          body:JSON.stringify({
            email:email
          })
        }).then(res=>res.json()).then(resJSON=>Alert.alert('Thông báo',resJSON.message));
        navigation && navigation.goBack();
    };
    const onBackButtonPress = () =>{
        navigation && navigation.goBack();
    }

    return(
        <KeyboardAwareScrollView
        contentContainerStyle= {{ flexGrow: 1 }}
        bounces= 'false'
        bouncesZoom= 'false'
        alwaysBounceVertical= 'false'
        alwaysBounceHorizontal= 'false'
        enableOnAndroid = {true}>
            <ImageBackground style={{width:'100%',height:'100%',flex:1}} source={backgroundImage}>
                <View style={styles.overlay}>
                    <View style={styles.headerContainer}>
                        <Text category='h1' style={{color:'white'}}>SagoStay</Text>
                    </View>
                    <View style={styles.formContainer}>
 
                        <Input
                            style={styles.emailInput}
                            status='control'
                            placeholder='Email'
                            value={email}
                            accessoryRight={EmailIcon}
                            onChangeText={setEmail}
                        />                          
                    </View>

                    <Button
                        style={styles.forgotPasswordButton}
                        status='control'
                        size='giant'
                        onPress={onResetPasswordButtonPress}>
                        RESET PASSWORD
                    </Button>
                    <Button
                        style={styles.backButton}
                        appearance='ghost'
                        status='control'
                        onPress={onBackButtonPress}>
                        Quay về
                    </Button>                    
                </View>
            </ImageBackground>
        </KeyboardAwareScrollView>    
); 

};
const styles = StyleSheet.create({
    container: {
        flex : 1,
    },
    overlay:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.45)', 
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 216,       
      },
      formContainer: {
        flex: 1,
        marginTop: 32,
        paddingHorizontal: 16,  
      },
      forgotPasswordButton: {
        marginHorizontal: 16,
      },
      backButton: {
        marginVertical: 12,
        marginHorizontal: 16,
      },
      emailInput:{
        marginTop: 16,
      },
    })
    
    
    