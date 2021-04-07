import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Dimensions } from 'react-native';
import { Text } from '@ui-kitten/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const windowWidth = Dimensions.get('window').width;

const district = [{"maTienIch":"tl","tenTienIch":"Tủ lạnh","imgUrl":"fridge","checked":false},{"maTienIch":"nvsr","tenTienIch":"WC riêng","imgUrl":"toilet","checked":false},{"maTienIch":"bdx","tenTienIch":"Bãi để xe","imgUrl":"parking","checked":false},{"maTienIch":"wf","tenTienIch":"Wifi","imgUrl":"wifi","checked":false},{"maTienIch":"g","tenTienIch":"Giường","imgUrl":"bed-empty","checked":false},{"maTienIch":"mg","tenTienIch":"Máy giặt","imgUrl":"washing-machine","checked":false},{"maTienIch":"tv","tenTienIch":"Tivi","imgUrl":"television","checked":false},{"maTienIch":"td","tenTienIch":"Tủ đồ","imgUrl":"locker","checked":false}];


export default class CheckBoxSearch extends Component {
  state = {
    data : district
  }
    constructor(props){
        super(props);
        this.state={
            data: district
        };  
    }

    onChecked(maTienIch){
        const data = this.state.data;
        const index = data.findIndex(x=>x.maTienIch===maTienIch);
        data[index].checked = !data[index].checked;
        this.setState(data);
        if(data[index].checked===true){
          this.props.facilities.push(data[index].maTienIch);   
        }
        else{
          let duplicate = this.props.facilities.findIndex(x=>x===data[index].maTienIch);
          this.props.facilities.splice(duplicate,1);
        }
        
    }
    renderCheckboxes(){
    return this.state.data.map((item, key)=>{
        return(
          <TouchableOpacity key={key} onPress={()=> this.onChecked(item.maTienIch)}>
              {item.checked == true 
              ? (
                <View style={[styles.controlContainer3,{backgroundColor:'white',borderColor:'#E65B6F',borderWidth:1}]}>
                <MaterialCommunityIcons name={`${item.imgUrl}`} size={22} color='#E65B6F'/>
                <View style={{justifyContent:'center',flexWrap:'wrap',marginLeft:15}}>
                  <Text style={{color:'#E65B6F'}}>{item.tenTienIch}</Text>
                </View>
                </View>
                )
              : (
                <View style={[styles.controlContainer3,{backgroundColor:'rgb(234,234,234)'}]}>
                <MaterialCommunityIcons name={`${item.imgUrl}`} size={22} color='#797979'/>
                <View style={{justifyContent:'center',flexWrap:'wrap',marginLeft:15}}>
                  <Text style={{color:'#797979'}}>{item.tenTienIch}</Text>
                </View>
                </View>
              )}
          </TouchableOpacity>
          
        )});
    }
    render(){
      return(
        <>
          {this.renderCheckboxes()}
        </>
      )
    }
  }

  const styles = StyleSheet.create({
    titleLabel3: {
      textAlign:'center',
      fontWeight:'100',
      fontSize:25
    },
  
    checkbox: {
      margin: 2,
      
    },
    controlContainer3: {
      flexDirection:'row',
      width:windowWidth/2.7,
      borderRadius: 10,
      marginHorizontal: 5,
      marginVertical: 5,
      padding: 7,
    },
  })
