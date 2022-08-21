import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Image, View, FlatList} from 'react-native';

const App = ({navigator}) => {
  const [imagesArr, setImagesArr] = useState([]);

  async function callCatImages() {
    let bucket = [];

    try {
      let response = await fetch(
        'https://api.thecatapi.com/v1/images/search?limit=10&page=10&order=Desc',
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

  useEffect(() => {
    callCatImages();
  }, []);

  const GridView = ({name}) => (
    <View style={styles.gridStyle}>
      <Image style={styles.stretch} source={{uri: name}} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={imagesArr}
        renderItem={({item}) => <GridView name={item} />}
        keyExtractor={item => item}
        numColumns={2}
        key={item => item}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
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
});

export default App;
