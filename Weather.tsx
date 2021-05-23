import React, {useEffect, useState, useCallback} from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {
  Button,
  Text,
  Form,
  Item,
  Input,
  Label,
  Picker,
  Icon,
  Textarea,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Weather = () => {
  const [search, setSearch] = useState('');
  const [currentCity, setCurrentCity] = useState({
    name: 'Беларусь Минск',
    pos: '27.561831 53.902284',
    weatherData: [],
  });

  const findCity = async () => {
    console.log('ffind');
    const res = await fetch(
      `https://geocode-maps.yandex.ru/1.x/?apikey=1fe493b9-0e43-4718-ace9-e0898a089a7e&format=json&geocode=${encodeURIComponent(
        search,
      )}`,
    );
    const json = await res.json();
    console.log(json);
    const results = json?.response?.GeoObjectCollection?.featureMember;
    if (results?.length > 0) {
      console.log(results[0]);
      const cityGeo = results[0]?.GeoObject;
      const cityName = `${cityGeo?.description} ${cityGeo?.name}`;
      console.log({cityName});
      const cityPos = cityGeo?.Point?.pos;
      console.log({cityPos});
      Alert.alert('Найден нужный город?', cityName, [
        {
          text: 'Всё правильно',
          style: 'default',
          onPress: async () => {
            setCurrentCity({
              name: cityName,
              pos: cityPos,
              weatherData: await getWeather(cityPos),
            });
            setSearch('');
          },
        },
        {text: 'Не тот', style: 'destructive', onPress: () => {}},
      ]);
    }
  };
  const getWeather = useCallback(async poss => {
    const pos = poss.split(' ');
    const lat = pos[1];
    const lon = pos[0];
    const res = await fetch(
      `https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}&extra=true`,
      {headers: {'X-Yandex-API-Key': '58735da8-b75b-457e-aead-2d0805370da5'}},
    );
    const json = await res.json();
    console.log({json});
    const conditions = {
      clear: 'ясно',
      'partly-cloudy': 'малооблачно',
      cloudy: 'облачно с прояснениями',
      overcast: 'пасмурно',
      drizzle: 'морось',
      'light-rain': 'небольшой дождь',
      rain: 'дождь',
      'moderate-rain': 'умеренно сильный дождь',
      'heavy-rain': 'сильный дождь',
      'continuous-heavy-rain': 'длительный сильный дождь',
      showers: 'ливень',
      'wet-snow': 'дождь со снегом',
      'light-snow': 'небольшой снег',
      snow: 'снег',
      'snow-showers': 'снегопад',
      hail: 'град',
      thunderstorm: 'гроза',
      'thunderstorm-with-rain': 'дождь с грозой',
      'thunderstorm-with-hail': 'гроза с градом',
    };

    const weatherCity = json?.forecasts?.map((forecast: any) => {
      const day = forecast?.parts?.day;
      return {
        date: forecast.date,
        temp: day?.temp_avg || '',
        weather: (day?.condition && conditions[day?.condition]) || '',
      };
    });
    console.log({weatherCity});

    return weatherCity;
    // setCurrentCity({...currentCity, weatherData: weatherCity});
  }, []);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem('@currentCity', JSON.stringify(currentCity));
    }
  }, [currentCity, loaded]);

  useEffect(() => {
    const get = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@currentCity');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        // error reading value
      }
      return null;
    };

    console.log('load');
    get().then(data => {
      if (data) {
        setCurrentCity(data);
      }
      setLoaded(true);
    });
  }, []);

  return (
    <ScrollView style={{backgroundColor: '#fcfcfc'}}>
      <Text style={{padding: 10}}>
        Текущий город:{' '}
        <Text style={{fontWeight: '700'}}>{currentCity.name}</Text>
      </Text>
      <Button
        style={{margin: 10}}
        onPress={async () => {
          const weather = await getWeather(currentCity.pos);
          setCurrentCity({...currentCity, weatherData: weather});
        }}>
        <Text>Обновить</Text>
      </Button>

      <View style={{padding: 10}}>
        <Item rounded style={{marginLeft: 0, marginBottom: 10}}>
          <Input
            placeholder="Найти город"
            // style={{marginLeft: 10}}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={findCity}
          />
        </Item>
      </View>

      {currentCity.weatherData.map((wi, index) => (
        <View style={{flexDirection: 'row', borderBottomWidth: 1}} key={index}>
          <Text
            style={{
              width: '30%',
              padding: 10,
              borderRightWidth: 1,
              fontSize: 18,
              fontWeight: '700',
            }}>
            {wi.date}
          </Text>
          <View style={{width: '70%', padding: 10}}>
            <Text>Температура: {wi.temp}</Text>
            <Text>{wi.weather}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Weather;
