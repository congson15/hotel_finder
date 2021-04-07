import React, { useEffect } from 'react';
import { Alert, StyleSheet, View,
    RefreshControl, } from 'react-native';
import { Menu, MenuItem, MenuGroup, TopNavigation, Toggle, Icon, Text, Layout, Avatar, Button, Spinner } from '@ui-kitten/components';
import { SettingIcon, LogOutIcon } from '../assets/icons';
import { AuthContext } from '../../context/context';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import GLOBAL from '../../GLOBAL';
import { ScrollView } from 'react-native-gesture-handler';

const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
export function AccountLayout( { navigation } ){
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [checked, setChecked] = React.useState();
    const [ profile, setProfile ] = React.useState();
    const [ approvedPosts, setApprovedPosts] = React.useState();
    const [ rejectedPosts, setRejectedPosts] = React.useState();
    const [ pendingPosts, setPendingPosts] = React.useState();
    const [ isLoading, setLoading ] = React.useState(true);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(1000).then(() => setRefreshing(false));
  }, []);
    const pushNotification = async (checked) => {
        let userToken = await AsyncStorage.getItem('token');
        let expoToken = await AsyncStorage.getItem('expoToken');
        await fetch(GLOBAL.localhost+'users/expo',{
            method:'POST',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer "+userToken 
            },
            body: JSON.stringify({
                token: expoToken,
                isTurnOn: checked
            })
        }).then(res=>res.json()).then(resJSON=>setChecked(checked));

    }
    const onVerify = async() =>{
        await fetch(GLOBAL.localhost+'auth/sendemail',{
            method:'GET',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email:profile.email
            })
        });
        
    }
    const onCheckedChange = () => {
        if(checked===true){
            Alert.alert(
                "Thông báo",
                "Bạn muốn tắt thông báo ?",
                [
                    {
                        text: "Không",
                        onPress: () => console.log(checked),
                        style: "cancel"
                      },                    
                  { text: "Có", onPress: () => {
                      pushNotification(!checked);
                  } }
                ],
                { cancelable: false }
              );
        }
        else{
            Alert.alert(
                "Thông báo",
                "Bạn muốn bật thông báo ?",
                [
                    {
                        text: "Không",
                        onPress: () => console.log(checked),
                        style: "cancel"
                      },  
                  { text: "Có", onPress: () => {
                      pushNotification(!checked);
                  } }
                ],
                { cancelable: false }
              );            
        }
      };
    const HomeIcon = (props) => (<Icon {...props} name='home'/>);
    const { signOut } = React.useContext(AuthContext);
    
    useEffect(()=>{
        setSelectedIndex(null);
    },[selectedIndex])

    useEffect(()=>{
        async function getProfile(){
            let userToken = await AsyncStorage.getItem('token');
            await fetch(GLOBAL.localhost+'users/profile',{
                method:'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+userToken 
                  }
            }).then(res=>res.json()).then(resJSON=>{
                setChecked(resJSON.batThongBao);
                setProfile(resJSON)
            });

            await fetch(GLOBAL.localhost+'posts/approved',{
                method:'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+userToken 
                  }
            }).then(res=>res.json()).then(resJSON=>{setApprovedPosts(resJSON)});

            await fetch(GLOBAL.localhost+'posts/rejected',{
                method:'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+userToken 
                  }
            }).then(res=>res.json()).then(resJSON=>{setRejectedPosts(resJSON)});     

            await fetch(GLOBAL.localhost+'posts/pending',{
                method:'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+userToken 
                  }
            }).then(res=>res.json()).then(resJSON=>{

                setPendingPosts(resJSON);
            }).finally(()=>setLoading(false));           
        }
        getProfile();
        
    },[refreshing])
    const onChangePassPress = () => {
        navigation && navigation.navigate('ChangePass');
      };  
    const onApprovedPress = () => {

        navigation && navigation.navigate('ShowPosts',{title:'Phòng trọ đã duyệt',approvedPosts,});
    }
    const onRejectPress = () => {

        navigation && navigation.navigate('ShowPosts',{title:'Phòng trọ bị từ chối',rejectedPosts,});
    }
    const onPendingPress = () => {
        
        navigation && navigation.navigate('ShowPosts',{title:'Phòng trọ chờ duyệt',pendingPosts,});
    }
    return(
        <>
        {isLoading ? 
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Spinner size='giant' />
            </View>
      : <>
        <TopNavigation
            alignment='center'
            title='Tài khoản'
            style={{backgroundColor:'transparent'}}
        />   
        <ScrollView
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
        <Menu
            
            selectedIndex={selectedIndex}
            onSelect={index => setSelectedIndex(index)}
            style={{backgroundColor:'transparent'}}>
            <MenuItem disabled='true' accessoryLeft={()=>
            <>
                <Layout
                    style={styles.container}
                    level='2'>
                    <Layout
                        style={styles.header}
                        level='1'>
                        <View style={styles.profileContainer}>
                        <Avatar
                            style={{marginHorizontal: 10}}
                            size='giant'
                            source={{uri:'data:image/jpeg;base64,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'}}
                        />
                        <View style={styles.profileDetailsContainer}>
                            <Text style={styles.profileDetail}>
                            {profile.hoTen}
                            </Text>
                            <Text
                            style={styles.profileSubDetail}
                            appearance='hint'
                            >
                            {profile.email}
                            </Text>   
                                                 
                        </View>
                        </View>   
                    </Layout>
                </Layout>         
            </>
        }></MenuItem>

            <MenuGroup title='Phòng trọ của tôi' accessoryLeft={HomeIcon}>
                
                <MenuItem onPress={onApprovedPress} accessoryRight={()=><>
                        <Text style={styles.menuItem}>Phòng trọ đã duyệt</Text>
                    </>
                } /> 
                <MenuItem  onPress={onPendingPress}accessoryRight={()=><>
                    <Text style={styles.menuItem}>Phòng trọ chờ duyệt</Text>  
                </>
            } /> 
                <MenuItem onPress={onRejectPress} accessoryRight={()=><>
                    <Text style={styles.menuItem}>Phòng trọ bị từ chối</Text>  
                </>
            } />             
            </MenuGroup>
            <MenuGroup title='Thiết lập' accessoryLeft={SettingIcon}>
                <MenuItem onPress={onChangePassPress} accessoryLeft={()=><>
                        <Text style={styles.menuItem}>Đổi mật khẩu</Text>

                    </>
                } />  
             
                <MenuItem accessoryRight={()=><>
                    <Text style={styles.menuItem}>Nhận thông báo</Text>
                    <Toggle checked={checked} onChange={onCheckedChange}></Toggle> 
                    
                </>
            } disabled='true'/> 
             {!profile.xacThucEmail ? <MenuItem onPress={onVerify} accessoryLeft={()=><>
                        <Text style={styles.menuItem}>Xác thực email</Text>
                    </>
                } />   : <></>}             
            </MenuGroup>
        </Menu>
        </ScrollView>
        <Button style={styles.logoutButton}
         appearance='outline'
         onPress={() => signOut() }>Đăng xuất</Button>
        </>
        }
      </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
      },
      header: {
        padding: 0,
      },
      profileContainer: {
        flexDirection: 'row',
      },
      profileDetailsContainer: {
        flex: 1,
        marginHorizontal: 10,
      },    
      profileDetail:{
        fontWeight:'600'
      },
      profileSubDetail: {
        fontWeight:'200'
      },
    menuItem: {
        fontWeight:'200',
        marginLeft:10,
        color:'rgba(0, 0, 0, .60)'
    },
    logoutButton:{
        backgroundColor:'white',
        margin:20,
        borderWidth:1.9
    }
  });