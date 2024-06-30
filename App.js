import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ToastProvider } from "react-native-toast-message";
import GetEmployees from "./screens/GetEmployees";
import UpdateEmployee from "./screens/UpdateEmployee";
import AddEmployee from "./screens/AddEmployee";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GetEmployees">
        <Stack.Screen name="GetEmployees" options={{ title: "Get Employees" }}>
          {(props) => <GetEmployees {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="UpdateEmployee"
          options={{ title: "Update Employee" }}
        >
          {(props) => <UpdateEmployee {...props} />}
        </Stack.Screen>
        <Stack.Screen name="AddEmployee" options={{ title: "Add Employee" }}>
          {(props) => <AddEmployee {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
