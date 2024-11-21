import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const SignInButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="self-end px-16 pt-4 pb-7 mt-10 w-full font-bold leading-loose text-center text-white bg-emerald-700 rounded-2xl max-w-[335px]"
      accessibilityRole="button"
      accessibilityLabel="Sign In"
    >
      <Text className="text-white font-bold">Sign In</Text>
    </TouchableOpacity>
  );
};

export default SignInButton;