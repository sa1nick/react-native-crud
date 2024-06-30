import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const AddEmployee = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const username = process.env.API_USERNAME;
  const password = process.env.API_PASSWORD;
  const auth = "Basic " + btoa(username + ":" + password);

  const handleSubmit = async () => {
    if (!name.trim()) {
      showAlert("Please enter a name.");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(name.trim())) {
      showAlert("Name should only contain alphabets and spaces.");
      return;
    }

    if (!age.trim() || isNaN(age)) {
      showAlert("Please enter a valid age.");
      return;
    }

    if (parseInt(age, 10) <= 0) {
      showAlert("Please enter a valid age greater than 0.");
      return;
    }

    if (!email.trim() || !validateEmail(email)) {
      showAlert("Please enter a valid Gmail address.");
      return;
    }

    const requestBody = {
      employeeName: name.trim(),
      employeeAge: parseInt(age),
      employeeEmail: email.trim(),
    };

    try {
      const response = await fetch(process.env.AddEmployee_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: auth,
        },
        body: Object.keys(requestBody)
          .map(
            (key) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(
                requestBody[key]
              )}`
          )
          .join("&"),
      });

      if (response.ok) {
        showToast();

        // Navigate back to GetEmployees with refresh parameter
        navigation.navigate("GetEmployees", { refresh: true });
      } else {
        console.error("Failed to add employee:", response.statusText);
        showAlert("Failed to add employee. Please try again later.");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      showAlert("Failed to add employee. Please try again later.");
    }
  };

  const validateEmail = (email) => {
    const regex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
  };

  const showAlert = (message) => {
    Alert.alert("Validation Error", message, [
      { text: "OK", onPress: () => {} },
    ]);
  };

  const showToast = () => {
    ToastAndroid.show("Employee added successfully!", ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={(text) => setAge(text)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
      </View>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "column",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
  },
  input: {
    width: 309,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 10,
  },
});

export default AddEmployee;
