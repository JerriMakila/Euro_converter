import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button } from 'react-native';
import {Picker} from '@react-native-picker/picker';

export default function App() {
  const [baseCurrencyValue, setBaseCurrencyValue] = useState('-');
  const [convCurrencyValue, setConvCurrencyValue] = useState('');
  const [rates, setRates] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [convertionRate, setConvertionRate] = useState('');

  const convert = () => {
    const convertion = (convCurrencyValue / convertionRate).toFixed(2);
    if(!isNaN(convertion)){
      setBaseCurrencyValue(convertion);
    } else {
      setBaseCurrencyValue('-');
    }
    
  }

  useEffect( () => {
    async function fetchData(){
      const response = await fetch('https://api.exchangeratesapi.io/latest');
      const data = await response.json();
      setRates(data.rates);
      setCurrencies(Object.keys(data.rates));
    }

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.baseContainer}>
        <Image style={styles.image}
          source={require('./img/euro-thumbnail.jpg')} />
        <Text style={{fontSize: 25}}>{baseCurrencyValue + " €"}</Text>
      </View>
      <View style={styles.conversionContainer}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input}
            keyboardType='numeric'
            value={convCurrencyValue}
            onChangeText={value => {setConvCurrencyValue(value)}} />
          <Picker
            selectedValue={convertionRate}
            style={{height: 35, width: 150, fontSize: 25}}
            onValueChange={(itemValue, itemIndex) => {
              if(itemIndex != 0){
                setConvertionRate(itemValue);
              }
            }}>
            <Picker.Item label="Choose Currency" value="" />
            {currencies.map(currency => (<Picker.Item label={currency} value={rates[currency]} key={currency} />))}
          </Picker>
        </View>
        <Button title='CONVERT' onPress={convert} />
      </View>
      <StatusBar hidden={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  baseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 50
  },

  conversionContainer: {
    flex: 1
  },

  image: {
    height: 200,
    width: 200
  },

  input: {
    borderColor: 'black',
    borderWidth: 1,
    fontSize: 25,
    height: 35,
    marginBottom: 10,
    paddingHorizontal:5,
    width: 75
  },

  inputContainer: {
    flexDirection: 'row',
  }
});
