import * as React from 'react';
import * as eva from '@eva-design/eva';
import { StyleSheet, View, TouchableWithoutFeedback, ImageBackground, Alert } from 'react-native';
import { Button, Input, Text, Icon } from '@ui-kitten/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PersonIcon } from '../assets/icons';
import   backgroundImage  from './assets/image-background.jpg';
import { AuthContext } from '../../context/context';
import GLOBAL from '../../GLOBAL';


export function SignInLayout({ navigation }) {
    
    const [ email, setEmail ] = React.useState('');
    const [ password, setPassword ] = React.useState('');
    const [ passwordVisible, setPasswordVisible ] = React.useState(true);
    const EyeIcon = (props) => (
        <TouchableWithoutFeedback onPress={onPasswordIconPress}>
          <Icon {...props} name={passwordVisible ? 'eye-off' : 'eye'}/>
        </TouchableWithoutFeedback>
      );
    const { signIn } = React.useContext(AuthContext); 
      const onSignInButtonPress = (email, password) => {
        signIn(email, password);
        };
      
    
      const onSignUpButtonPress = ()=> {
        navigation && navigation.navigate('SignUp');
      };
    
      const onForgotPasswordButtonPress = () => {
        navigation && navigation.navigate('ForgotPassword');
      };
    const onPasswordIconPress = () => {
        setPasswordVisible(!passwordVisible);
      };

    return(
        <KeyboardAwareScrollView
        contentContainerStyle= {{ flexGrow: 1 }}
        bounces= 'false'
        bouncesZoom= 'false'
        alwaysBounceVertical= 'false'
        alwaysBounceHorizontal= 'false'
        enableOnAndroid = {false}>
            <ImageBackground style={{width:'100%',height:'100%',flex:1}} source={backgroundImage}>
                <View style={styles.overlay}>
                    <View style={styles.headerContainer}>
                        <Text category='h1' style={{color:'white'}}>SagoStay</Text>
                    </View>
                        <View style={styles.formContainer}>
                        <Input
                            status='control'
                            placeholder='Email'
                            value={email}
                            accessoryRight={PersonIcon}
                            onChangeText={setEmail}
                            
                        />
                        <Input
                            style={styles.passwordInput}
                            status='control'
                            placeholder='Mật khẩu'
                            value={password}
                            accessoryRight={EyeIcon}
                            secureTextEntry={passwordVisible}
                            onChangeText={setPassword}
                        />
                        <View style={styles.forgotPasswordContainer}>
                            <Button
                            style={styles.forgotPasswordButton}
                            appearance='ghost'
                            status='control'
                            onPress={onForgotPasswordButtonPress}>
                           Quên mật khẩu ?
                            </Button>
                        </View>
                        </View>
                        <Button
                        style={styles.signInButton}
                        status='control'
                        size='giant'
                        onPress={() => {onSignInButtonPress(email,password) }}>
                        ĐĂNG NHẬP
                        </Button>
                        <Button
                        style={styles.signUpButton}
                        appearance='ghost'
                        status='control'
                        onPress={onSignUpButtonPress}>
                        Chưa có tài khoản ? Đăng ký
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
      signInLabel: {
        marginTop: 16,
      },
      signInButton: {
        marginHorizontal: 16,
      },
      signUpButton: {
        marginVertical: 12,
        marginHorizontal: 16,
      },
      forgotPasswordContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      passwordInput: {
        marginTop: 16,
      },
      forgotPasswordButton: {
        paddingHorizontal: 0,
      },

})