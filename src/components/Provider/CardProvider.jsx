import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function CardProvider({ item, completeTask }) {
  return (
    <TouchableOpacity onPress={completeTask}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
          opacity: item.completed ? 0.5 : 1,
        }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: 'black',
            marginRight: 8,
            backgroundColor: item.completed ? 'green' : 'white',
          }}
        />
        <Text>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );
}

