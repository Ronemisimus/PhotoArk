import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Resizer from 'react-native-image-resizer';
import { apiService } from './src/services/api';

import { Colors } from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const fetchMedia = async () => {
    const fetchedMedia = await apiService.getMedia();
    setMedia(fetchedMedia);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async () => {
    const result = await launchImageLibrary({ mediaType: 'mixed' });

    if (result.didCancel || !result.assets || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];
    if (!asset.uri || !asset.fileName || !asset.type) {
      Alert.alert('Error', 'Selected media is invalid.');
      return;
    }

    try {
      // 1. Generate Thumbnail
      const thumbnail = await Resizer.createResizedImage(
        asset.uri,
        150,
        150,
        'JPEG',
        80,
      );

      // 2. Get Pre-signed URLs
      const urlsResponse = await apiService.getUploadUrl(
        asset.fileName,
        thumbnail.name,
        asset.type.startsWith('video') ? 'video' : 'photo',
      );

      if (!urlsResponse) {
        throw new Error('Failed to get upload URLs.');
      }

      const { uploadUrl, thumbnailUploadUrl, mediaUrl, thumbnailUrl } = urlsResponse;

      // 3. Upload both files
      const [uploadSuccess, thumbnailUploadSuccess] = await Promise.all([
        apiService.uploadFile(uploadUrl, asset.uri, asset.type),
        apiService.uploadFile(thumbnailUploadUrl, thumbnail.uri, 'image/jpeg'),
      ]);

      if (!uploadSuccess || !thumbnailUploadSuccess) {
        throw new Error('Failed to upload one or more files.');
      }

      // 4. Create Media Record
      await apiService.createMediaRecord(
        'A New Media File', // This would come from user input
        '',
        mediaUrl,
        thumbnailUrl,
        asset.type.startsWith('video') ? 'video' : 'photo',
      );

      // 5. Refresh List
      await fetchMedia();
      Alert.alert('Success', 'Media uploaded successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred during upload.');
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  if (selectedMedia) {
    return (
      <SafeAreaView style={backgroundStyle}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => setSelectedMedia(null)}>
            <Text style={styles.backButton}>{'< Back'}</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedMedia.url }} style={styles.fullImage} />
          <Text style={styles.title}>{selectedMedia.title}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.header}>
        <Text style={styles.title}>PhotoArk</Text>
        <Button title="Upload" onPress={handleUpload} />
      </View>
      <FlatList
        data={media}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedMedia(item)}>
            <View style={styles.photoContainer}>
              <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
              <Text style={styles.photoTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  photoTitle: {
    fontSize: 18,
  },
  fullImage: {
    width: '100%',
    height: 300,
    marginBottom: 16,
  },
  backButton: {
    fontSize: 18,
    color: 'blue',
    marginBottom: 16,
  },
});

export default App;