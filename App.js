/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  Text,
  FlatList,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const {width} = Dimensions.get('window');

const App = () => {
  const [imagesArr, setImagesArr] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [breed, setBreed] = useState([]);

  async function breedsList() {
    let bucket = [];

    try {
      let response = await fetch('https://api.thecatapi.com/v1/breeds');
      let data = await response.json();
      data.map((value, index) => {
        bucket.push({
          label: value.name,
          value: value.name,
          id: value.id,
        });
      });
    } catch (err) {
      console.log(err);
    }

    setBreed(bucket);
  }

  async function callCatImages() {
    let bucket = [];

    try {
      let response = await fetch(
        'https://api.thecatapi.com/v1/images/search?limit=50&&order=Desc',
      );
      let data = await response.json();
      data.map((value, index) => {
        bucket.push(value.url);
      });
    } catch (err) {
      console.log(err);
    }

    setImagesArr(bucket);
  }

  async function searchBreed(item) {
    console.log('from function', item);
    let bucket = [];

    try {
      let response = await fetch(
        `https://api.thecatapi.com/v1/images/search?breed_ids=${item.id}`,
      );
      let filteredBreed = await response.json();
      console.log(filteredBreed);
      filteredBreed.map((value, index) => {
        bucket.push(value.url);
      });
    } catch (err) {
      console.log(err);
    }

    setImagesArr(bucket);
  }

  useEffect(() => {
    breedsList();
    callCatImages();
  }, []);

  const GridView = ({name}) => (
    <View style={styles.gridStyle}>
      <Image style={styles.stretch} source={{uri: name}} />
    </View>
  );

  return (
    <View style={styles.main}>
      <View style={styles.firstRow}>
        {breed && (
          <DropDownPicker
            open={open}
            value={value}
            items={breed}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setBreed}
            onSelectItem={searchBreed}
            zIndex={2000}
            style={{
              width: '95%',
              alignSelf: 'center',
              marginVertical: 10,
            }}
            dropDownContainerStyle={{
              width: '95%',
              alignSelf: 'center',
              marginVertical: 10,
              zIndex: 100,
            }}
          />
        )}
      </View>
      <View style={styles.secondRow}>
        <FlatList
          data={imagesArr}
          renderItem={({item}) => <GridView name={item} />}
          keyExtractor={item => item}
          numColumns={1}
          key={item => item}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  firstRow: {
    flex: 0,
  },
  secondRow: {
    flex: 7,
  },
  gridStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 130,
    margin: 5,
  },

  gridText: {
    fontSize: 24,
    color: 'white',
  },
  stretch: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  zee: {
    zIndex: -1,
  },
});

export default App;
