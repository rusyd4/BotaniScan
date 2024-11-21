import React from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const InputField = ({
  label,
  placeholder,
  iconSource,
  secureTextEntry,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  showPasswordToggle,
  onTogglePassword,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Image source={iconSource} style={styles.icon} resizeMode="contain" />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="rgba(30, 30, 45, 1)"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
        {showPasswordToggle && (
          <TouchableOpacity onPress={onTogglePassword} style={styles.eyeIcon}>
            <Icon name="home" size={30} color="#900" />

          </TouchableOpacity>
        )}
      </View>
      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: 'rgba(162, 162, 167, 1)',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 16,
  },
  input: {
    flex: 1,
    color: 'rgba(30, 30, 45, 1)',
    fontSize: 14,
    fontWeight: '400',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(162, 162, 167, 0.2)',
    marginTop: 8,
  },
  eyeIcon: {
    padding: 10,
  },
});

export default InputField;

