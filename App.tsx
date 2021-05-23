import React, {createContext, useState} from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Weather from './Weather';

const Stack = createStackNavigator();

export const AppContext = createContext({
  weatherInfo: {},
});

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const contextValue = {
    recipes,
    setRecipes: (newObj: any) => setRecipes(newObj),
  };

  return (
    <AppContext.Provider value={contextValue}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name={'main'}
            options={{title: 'Погода'}}
            component={Weather}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
