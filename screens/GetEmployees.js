import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { useNavigation, useRoute } from "@react-navigation/native";

const GetEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const username = process.env.API_USERNAME;
  const password = process.env.API_PASSWORD;
  const auth = "Basic " + btoa(username + ":" + password);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(process.env.GetEmployee_API_URL, {
        method: "GET",
        headers: {
          Authorization: auth,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        console.error("Failed to fetch employees", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchEmployees();
    });

    return unsubscribe;
  }, [fetchEmployees, navigation]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(process.env.RemoveEmployee_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: auth,
        },
        body: `employeeID=${id}`,
      });

      if (response.ok) {
        const employeeToDelete = employees.find(
          (employee) => employee.employeeID == id
        );
        const updatedEmployees = employees.filter(
          (employee) => employee.employeeID !== id
        );
        setEmployees(updatedEmployees);

        showToast(
          `Employee '${employeeToDelete.employeeName}' deleted successfully.`
        );
      } else {
        console.error("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleEdit = (employee) => {
    navigation.navigate("UpdateEmployee", {
      employee: employee,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.employeeName}</Text>
      <Text style={styles.cell}>{item.employeeAge}</Text>
      <Text style={styles.cell}>{item.employeeEmail}</Text>
      <View style={styles.actionCell}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={styles.editButton}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.employeeID)}
          style={styles.deleteButton}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const showToast = (message) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Toast not supported", message);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
        overlayColor="rgba(255, 255, 255, 1)"
      />
      <Text style={styles.title}>Employee List</Text>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Age</Text>
        <Text style={styles.headerCell}>Email</Text>
        <Text style={styles.headerCell}>Actions</Text>
      </View>
      <FlatList
        data={employees}
        renderItem={renderItem}
        keyExtractor={(item) => item.employeeID.toString()} // Use keyExtractor for proper re-rendering
        contentContainerStyle={styles.listContainer}
        extraData={employees} // Force re-render when employees array changes
      />
      <Button
        title="Add Another Employee"
        onPress={() => navigation.navigate("AddEmployee")}
      />
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  listContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: width * 0.9,
    alignSelf: "center",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: width * 0.9,
    alignSelf: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    paddingHorizontal: 0,
  },
  actionCell: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  spinnerTextStyle: {
    color: "#000",
  },
});

export default GetEmployees;
