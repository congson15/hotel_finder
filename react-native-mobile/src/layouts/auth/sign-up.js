import * as React from 'react';
import * as eva from '@eva-design/eva';
import { StyleSheet, View, TouchableWithoutFeedback, ImageBackground, Alert } from 'react-native';
import { Button, Input, Text, Icon } from '@ui-kitten/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PersonIcon, EmailIcon, PhoneIcon } from '../assets/icons';
import  backgroundImage  from './assets/image-background.jpg';
import { AuthContext } from '../../context/context';
export function SignUpLayout({ navigation }) {
    const { signUp } = React.useContext(AuthContext);
    const [ email, setEmail ] = React.useState('');
    const [ phoneNumber, setPhoneNumber ] = React.useState('');
    const [ fullname, setFullname ] = React.useState('');
    const [ password, setPassword ] = React.useState('');
    const [ rePassword, setRepassword ] = React.useState('');
    const [ passwordVisible, setPasswordVisible ] = React.useState(true);
    const [ phoneValid, setPhoneValid ] = React.useState(true);
    const [ emailValid, setEmailValid ] = React.useState(true);
    const [ confirmPassword, setConfirmPassword ] = React.useState(true);

    const validate = (value,type) => {
      if(type == 'phoneNumber'){
        setPhoneNumber(value);
        const phoneReg =/((09|03|07|08|05)+([0-9]{8})\b)/g
        phoneReg.test(value) ? setPhoneValid(true) : setPhoneValid(false);
      }
      else if(type == 'email'){
        setEmail(value);
        const emailReg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        emailReg.test(value) ? setEmailValid(true) : setEmailValid(false);
      }
      else if(type == 'rePassword'){
        setRepassword(value);
        password == value ? setConfirmPassword(true) : setConfirmPassword(false);
      }   
    }
 
    const onSignUpButtonPress = () => {
        if(fullname.length === 0 || email.length === 0 || password.length === 0 || rePassword.length === 0 || phoneNumber.length === 0){
          Alert.alert('Thông báo','Vui lòng nhập đầy đủ thông tin');
        }
        else{
          signUp(fullname, email, phoneNumber, password);
        }
      };

      const onSignInButtonPress = () => {
        navigation && navigation.navigate('SignIn');
      };

    const onPasswordIconPress = () => {
        setPasswordVisible(!passwordVisible);
      };

    const EyeIcon = (props) => (
        <TouchableWithoutFeedback onPress={onPasswordIconPress}>
          <Icon {...props} name={passwordVisible ? 'eye-off' : 'eye'}/>
        </TouchableWithoutFeedback>
      );
    return(
        <KeyboardAwareScrollView
        contentContainerStyle= {{ flexGrow: 1 }}
        bounces= 'false'
        bouncesZoom= 'false'
        alwaysBounceVertical= 'false'
        alwaysBounceHorizontal= 'false'
        enableOnAndroid = {true}>
            <ImageBackground style={{width:'100%',height:'100%',flex:1}} source={backgroundImage} >
                <View style={styles.overlay}>
                    <View style={styles.headerContainer}>
                        <Text category='h1' style={{color:'white'}}>SagoStay</Text>
                    </View>
                    <View style={styles.formContainer}>
                        <Input
                            
                            status='control'
                            placeholder='Họ tên'
                            value={fullname}
                            accessoryRight={PersonIcon}
                            onChangeText={setFullname}
                        />   
                        <Input
                            style={[styles.emailInput,!emailValid ? styles.warning : null]}
                            status='control'
                            placeholder='Email'
                            value={email}
                            accessoryRight={EmailIcon}
                            onChangeText={(text) => validate(text,'email')}
                        />
                        <Input
                            style={[styles.emailInput,!phoneValid ? styles.warning : null]}
                            status='control'
                            placeholder='Số điện thoại'
                            value={phoneNumber}
                            accessoryRight={PhoneIcon}
                            onChangeText={(text) => validate(text,'phoneNumber')}
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
                        <Input
                            style={[styles.passwordInput,!confirmPassword ? styles.warning : null]}
                            status='control'
                            placeholder='Nhập lại mật khẩu'
                            value={rePassword}
                            accessoryRight={EyeIcon}
                            secureTextEntry={passwordVisible}
                            onChangeText={(text)=> validate(text,'rePassword')}
                        />                            
                    </View>

                    <Button
                        style={styles.signUpButton}
                        status='control'
                        size='giant'
                        onPress={onSignUpButtonPress}>
                        ĐĂNG KÝ
                    </Button>
                    <Button
                        style={styles.signInButton}
                        appearance='ghost'
                        status='control'
                        onPress={onSignInButtonPress}>
                        Đã có tài khoản ? Đăng nhập
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
    paddingHorizontal: 16,

  },
  signUpButton: {
    marginHorizontal: 16,
  },
  signInButton: {
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
  emailInput:{
    marginTop: 16,
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
  },
  warning: {
    borderColor:'#CC3300',
  }
})


