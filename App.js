/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Image,
  View,
  FlatList,
  Button,
  TouchableOpacity,
} from 'react-native';
import SelectList from 'react-native-dropdown-select-list';
import Lightbox from 'react-native-lightbox-v2';

const App = () => {
  const [imagesArr, setImagesArr] = useState([]);
  const [breed, setBreed] = useState([]);
  const [selected, setSelected] = React.useState('');

  async function breedsList() {
    let bucket = [];
    try {
      let response = await fetch('https://api.thecatapi.com/v1/breeds');
      let allBreeds = await response.json();
      allBreeds.map((a, index) => {
        bucket.push({
          key: a.id,
          value: a.name,
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
      let allCats = await response.json();
      allCats.map((b, index) => {
        bucket.push(b.url);
      });
    } catch (err) {
      console.log(err);
    }
    setImagesArr(bucket);
  }

  async function searchBreed(item) {
    let bucket = [];
    try {
      let response = await fetch(
        `https://api.thecatapi.com/v1/images/search?breed_ids=${item}`,
      );
      let filteredBreed = await response.json();
      filteredBreed.map((c, index) => {
        bucket.push(c.url);
      });
    } catch (err) {
      console.log(err);
    }
    setImagesArr(bucket);
  }

  useEffect(() => {
    breedsList();
    callCatImages();
    setSelected('');
  }, []);

  const GridView = ({name}) => (
    <View style={styles.gridStyle}>
      <TouchableOpacity style={{margin: 5, width: 400, height: 110}}>
        <Lightbox useNativeDriver={false} underlayColor="transparent">
          <Image
            style={styles.stretch}
            source={{uri: name}}
            resizeMode="center"
          />
        </Lightbox>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.main}>
      <View style={styles.firstRow}>
        {breed && (
          <SelectList
            search={false}
            setSelected={setSelected}
            data={breed}
            onSelect={() => searchBreed(selected)}
          />
        )}
      </View>
      <View style={styles.secondRow}>
        <FlatList
          data={imagesArr}
          renderItem={({item}) => <GridView name={item} />}
          keyExtractor={item => item}
          numColumns={2}
          key={item => item}
        />
      </View>
      {selected !== '' ? (
        <View style={{flex: 7, alignItems: 'center', marginTop: 50}}>
          <Button
            title="Back To Home"
            onPress={() => {
              setSelected('');
              callCatImages();
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  firstRow: {
    flex: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
  stretch: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default App;
