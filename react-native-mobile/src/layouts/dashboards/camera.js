import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const heightWindow = Dimensions.get('window').height;

export function CameraLayout({navigation}) {
  const [hasPermission, setHasPermission] = React.useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [ capturedPhoto, setCapturedPhoto] = React.useState(null);
  const [ imageJSON, setImageJSON ] = React.useState(''); 
  
  const [ open, setOpen ] = React.useState(false);
  let camera;
  

  const takePicture = async () => {
    if (camera) {
        let options = { quality: 0.5 };
        let photo = await camera.takePictureAsync(options);
        setImageJSON(JSON.stringify({
            uri: photo.uri,
            name: 'captured',
            type: 'image/jpg'
        }));
        
        setCapturedPhoto(photo.uri);
        setOpen(true);
        }
    
    }
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={ref => (camera = ref)}>
      <View style={{flex:1, flexDirection:'row',justifyContent:'space-between',margin:20}}>
            
            <TouchableOpacity
                style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',                  
                }}
                onPress={()=>{navigation.navigate('Home')}}>
                <Text style={{color:'white',fontSize:20}}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',
                }}
                onPress={takePicture}>
                <FontAwesome
                    name="camera"
                    style={{ color: "#fff", fontSize: 40}}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',
                
                }}
                onPress={()=>{
                    setType(type=== Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)
                }}
                >
                <MaterialCommunityIcons
                    name="camera-switch"
                    style={{ color: "#fff", fontSize: 40}}
                />
            </TouchableOpacity>
            {capturedPhoto && 

            <Modal animationType='slide'
            transparent='false'
            visible={open}
            >
                <View style={{flex:1, justifyContent:'center', backgroundColor:'black'}}>
                    <Image source={{uri:capturedPhoto}} style={{width:'100%',height:heightWindow}} resizeMode='stretch'/>
                    <View style={{flexDirection:'row',margin:20,justifyContent:'space-between'}}>
                        <TouchableOpacity
                            onPress={()=>{
                               setOpen(false);
                            }}
                            >
                            <Text style={{color:'#ffffff',fontSize:20,marginBottom:heightWindow/15}}>Chụp lại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{
                               navigation.navigate('PostRoom',{imageJSON,})
                            }}
                            >
                            <Text style={{color:'#ffffff',fontSize:20,marginBottom:heightWindow/15}}>Tiếp tục</Text>
                        </TouchableOpacity>                        
                    </View>
                </View>

            </Modal>}
            </View>
      </Camera>
    </View>
  );
}