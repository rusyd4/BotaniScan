import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Image } from 'react-native';



const NavBar = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpenCamera = () => {
    setModalVisible(false);
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled camera picker');
        } else if (response.errorCode) {
          console.log('Camera error: ', response.errorCode);
        } else {
          const uri = response.assets[0]?.uri;
          if (uri) {
            navigation.navigate('Identify', { imageUri: uri }); // Navigate to CameraScreen
          } else {
            Alert.alert('Error', 'Failed to capture image.');
          }
        }
      },
    );
  };

  const handleOpenGallery = () => {
    setModalVisible(false);
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('Image picker error: ', response.errorCode);
        } else {
          const uri = response.assets[0]?.uri;
          if (uri) {
            navigation.navigate('Identify', { imageUri: uri }); // Navigate to CameraScreen
          } else {
            Alert.alert('Error', 'Failed to pick image.');
          }
        }
      },
    );
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navItem}
              onPress={() => navigation.navigate('Home')}>
              <Image source={require('../assets/Icons/home.png')} style={styles.iconImage} />
              <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
                onPress={() => navigation.navigate('History')}>
                <Image source={require('../assets/Icons/ClockClockwise.png')} style={styles.iconImage} />
                <Text style={styles.navText}>History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
                onPress={() => setModalVisible(true)}>
                <Image source={require('../assets/Icons/Vector.png')} style={styles.iconImage} />
                <Text style={styles.navText}>Scan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
                onPress={() => navigation.navigate('Leaderboard')}>
                <Image source={require('../assets/Icons/ChartBar.png')} style={styles.iconImage} />
                <Text style={styles.navText}>Leaderboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
                onPress={() => navigation.navigate('User')}>
                <Image source={require('../assets/Icons/user.png')} style={styles.iconImage} />
                <Text style={styles.navText}>User</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Choose an Option</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleOpenCamera}>
              <Text style={styles.modalButtonText}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleOpenGallery}>
              <Text style={styles.modalButtonText}>Open Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#007b6e',
    height: 70,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 10,
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#007b6e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#999',
  },
});

export default NavBar;
