import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Provider from "./Provider/Provider";
import CardProvider from "./Provider/CardProvider";

export default function TodoListScreen() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isProvider, setIsProvider] = useState(false);
  const [idProvider, setIdProvider] = useState(null);
  const [selectedProviderId, setSelectedProviderId] = useState(null); // Nuevo estado para el proveedor seleccionado
  const navigation = useNavigation();

  const addTask = () => {
    if (newTask.trim() !== "") {
      const newTaskItem = {
        id: String(new Date().getTime()),
        text: newTask,
        completed: false,
        providerId: idProvider, // Asociar tarea con el proveedor seleccionado
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask("");
      navigation.navigate("New Provider", { task: newTaskItem });
    }
  };

  const completeTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    const completedTask = updatedTasks.find((task) => task.id === taskId);
    if (completedTask && completedTask.completed) {
      setIsProvider(true);
      setSelectedProviderId(completedTask.providerId); // Establecer el proveedor seleccionado
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {!isProvider && (
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <TextInput
            style={{ flex: 1, marginRight: 8, borderWidth: 1, padding: 8 }}
            placeholder="Add a Provider"
            value={newTask}
            onChangeText={(text) => setNewTask(text)}
          />
          <Button title="Add" onPress={addTask} />
        </View>
      )}

      {!isProvider && (
        <View>
          {tasks.map((provider) => (
            <CardProvider
              key={provider.id}
              item={provider}
              completeTask={() => completeTask(provider.id)}
            />
          ))}
        </View>
      )}

      {isProvider && (
        <Provider
          isProvider={isProvider}
          setIsProvider={setIsProvider}
          idProvider={idProvider}
          setIdProvider={setIdProvider}
          selectedProviderId={selectedProviderId} // Proporcionar el proveedor seleccionado
        />
      )}
    </View>
  );
}
