import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Dimensions } from 'react-native';
import { Text } from '@ui-kitten/components';
const windowWidth = Dimensions.get('window').width;

const initialDistrict = [{"id":"1","name":"Quận 1","checked":false},{"id":"2","name":"Quận 2","checked":false},{"id":"3","name":"Quận 3","checked":false},{"id":"4","name":"Quận 4","checked":false},{"id":"q5","name":"Quận 5","checked":false},{"id":"6","name":"Quận 6","checked":false},{"id":"7","name":"Quận 7","checked":false},{"id":"8","name":"Quận 8","checked":false},{"id":"9","name":"Quận 9","checked":false},{"id":"10","name":"Quận 10","checked":false},{"id":"11","name":"Quận 11","checked":false},{"id":"12","name":"Quận 12","checked":false},{"id":"tp","name":"Tân Phú","checked":false}
,{"id":"bt","name":"Bình Tân","checked":false},{"id":"bth","name":"Bình Thạnh","checked":false},{"id":"gv","name":"Gò Vấp","checked":false},{"id":"pn","name":"Phú Nhuận","checked":false},{"id":"tđ","name":"Thủ Đức","checked":false}];;


export default class District extends Component {
    constructor(props){
        super(props);
        this.state={
            data: initialDistrict
        };  
    }
    onChecked(id){
        const data = this.state.data;
        const index = data.findIndex(x=>x.id===id);
        data[index].checked = !data[index].checked;
        this.setState(data);
        if(data[index].checked===true){
          this.props.district.push(data[index].name);   
        }
        else{
          
          let duplicate = this.props.district.findIndex(x=>x===data[index].name);
          console.log(this.props.district[duplicate],duplicate);
          this.props.district.splice(duplicate,1);
        }
        
    }
    renderCheckboxes(){
    return this.state.data.map((item, key)=>{
        return(
          <TouchableOpacity key={key} onPress={()=> this.onChecked(item.id)}>
              {item.checked == true 
              ? (
                <View style={[styles.controlContainer3,{backgroundColor:'white',borderColor:'#E65B6F',borderWidth:1}]}>
                  <Text style={{color:'#E65B6F'}}>{item.name}</Text>
                </View>
                )
              : (
                <View style={[styles.controlContainer3,{backgroundColor:'rgb(234,234,234)'}]}>
                  <Text style={{color:'#797979'}}>{item.name}</Text>
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
      justifyContent:'center',
      width:windowWidth/4,
      borderRadius: 5,
      marginHorizontal: 3,
      marginVertical: 3,
      padding: 5,
    },
  })
