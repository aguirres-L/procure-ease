import React from 'react';
import { View, Text, Button } from 'react-native';

export default function TaskDetailScreen({ route, navigation }) {
  const { task } = route.params;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>{task.text}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
