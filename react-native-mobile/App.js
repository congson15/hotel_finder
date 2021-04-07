import React, { useEffect } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider,IconRegistry} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { default as theme } from './custom-theme.json';
import MainNavigator from './src/navigation/app.navigator';

export default () => (
   <>
      <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme}}>
          <MainNavigator />
        </ApplicationProvider>
    </>
);