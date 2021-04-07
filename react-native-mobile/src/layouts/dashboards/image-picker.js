import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import {ImageBrowser} from 'expo-image-picker-multiple';
import { TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components';

export default function ImageBrowserScreen({navigation ,route}){
  const [ headerTitle, setHeaderTitle ] = React.useState('Đã chọn 0 files');
  const initialPhotos = [];
  const [ photoList, setPhotoList ] = React.useState(initialPhotos);

  const imagesCallback = (callback) => {
    callback.then(async (photos) => {
      for(let photo of photos) { 
        const pPhoto = await processImageAsync(photo.uri);
        initialPhotos.push({
          uri: pPhoto.uri,
          name: photo.filename,
          type: 'image/jpg'
        })
       
      }
      setPhotoList(initialPhotos);
    })
    .catch((e) => console.log(e));
  };
  const processImageAsync = async (uri) => {
    const file = await ImageManipulator.manipulateAsync(
      uri,
      [{resize: { width: 1000 }}],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return file;
  }

  const updateHandler = (count, onSubmit) => {
    setHeaderTitle(`Đã chọn ${count} files`);

  };

  const BackIcon = (props) => (
    <Icon {...props} name='arrow-back'/>
  );
  
  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigation.goBack}/>
  );

  const renderDoneAction = () => (
    
    <View>
      <Text onPress={()=>{navigation.navigate('PostRoom',{photoList,})}}>Done</Text>
    </View>
  );

  const renderSelectedComponent = (number) => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );
    return (
      <>
        <TopNavigation
        alignment='center'
        title={()=>{
          return(
            <Text>{headerTitle}</Text>
          )
        }}
        accessoryLeft={renderBackAction}
        accessoryRight={renderDoneAction}
        />
        <View style={[styles.flex, styles.container]}>
          <ImageBrowser

            max={20}
            onChange={updateHandler}
            callback={imagesCallback}
            renderSelectedComponent={renderSelectedComponent}
            
          />
        </View>
      </>
    );
  }

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    position: 'relative'
  },
  emptyStay:{
    textAlign: 'center',
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: 'absolute',
    right: 3,
    bottom: 3,
    justifyContent: 'center',
    backgroundColor: '#0580FF'
  },
  countBadgeText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 'auto',
    color: '#ffffff'
  }
});
