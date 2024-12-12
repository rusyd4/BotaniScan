import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure to install react-native-vector-icons

const { width } = Dimensions.get('window');

const NavBar = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpenCamera = () => {
    setModalVisible(false);
    launchCamera(
      { mediaType: 'photo', cameraType: 'back', quality: 1 },
      response => {
        if (response.didCancel) {
          console.log('User cancelled camera picker');
        } else if (response.errorCode) {
          console.log('Camera error: ', response.errorCode);
        } else {
          const uri = response.assets[0]?.uri;
          if (uri) {
            navigation.navigate('Identify', { imageUri: uri });
          } else {
            Alert.alert('Error', 'Failed to capture image.');
          }
        }
      }
    );
  };

  const handleOpenGallery = () => {
    setModalVisible(false);
    launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('Image picker error: ', response.errorCode);
        } else {
          const uri = response.assets[0]?.uri;
          if (uri) {
            navigation.navigate('Identify', { imageUri: uri });
          } else {
            Alert.alert('Error', 'Failed to pick image.');
          }
        }
      }
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
                <Image source={require('../assets/Icons/Close_LG.png')} style={styles.closeIcon} />
                </TouchableOpacity>

            <Text style={styles.modalTitle}>Choose Scan Method</Text>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleOpenCamera}>
                                <Image source={require('../assets/Icons/Camera.png')} style={styles.icon} />

                <Text style={styles.optionButtonText}>Camera</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleOpenGallery}>
                                <Image source={require('../assets/Icons/Image.png')} style={styles.icon} />

                <Text style={styles.optionButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
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
    flex: 1,
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
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  icon: {
    width: 48,
    height: 48,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '45%',
  },
  optionIconContainer: {
    backgroundColor: 'rgba(0, 123, 110, 0.1)',
    borderRadius: 50,
    padding: 15,
    marginBottom: 10,
  },
  optionButtonText: {
    color: '#007b6e',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NavBar;