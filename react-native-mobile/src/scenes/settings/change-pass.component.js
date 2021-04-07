import * as React from 'react';
import { Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { ArrowIosBackIcon } from '../../layouts/assets/icons';
import { ChangePassLayout } from '../../layouts/account/change-pass';
export function ChangePass({navigation}){
    const renderBackAction = () =>{
        return(
            <TopNavigationAction
            icon={ArrowIosBackIcon}
            onPress={navigation.goBack}
          />    
        );    
        }
    return(
        <>
            <TopNavigation
                accessoryLeft={renderBackAction}
                alignment='center'
                title='Đổi mật khẩu'
                style={{backgroundColor:'transparent'}}
            /> 
            <ChangePassLayout />
        </>
    );
}