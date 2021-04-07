import * as React from 'react';

import { ShowPostsLayout } from '../../layouts/account/show-posts';



export function ShowPosts({ navigation, route }){

    return (
        <>
        <ShowPostsLayout navigation={navigation} route={route}/>
        </>
    );
}