import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = ({ navigation }: any) => {
  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch("https://private-anon-b26f96742a-pizzaapp.apiary-mock.com/restaurants/1/menu?category=Pizza&orderBy=rank")
      .then((response) => response.json())
      .then((data) => {
        setPizzas(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pizzas:", error);
        setIsLoading(false);
      });
  }, []);

  const addToCart = (pizza: any) => {
    const existingPizza = cartItems.find((item) => item.id === pizza.id);
    if (existingPizza) {
      setCartItems(cartItems.map((item) =>
        item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...pizza, quantity: 1 }]);
    }
  };

  function Home({ navigation }: any) {
    let routeName="Home";
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Pizza Listing</Text>
        {isLoading ? (
          <Text>Loading pizzas...</Text>
        ) : (
          <FlatList
            data={pizzas}
            renderItem={({ item }) => (
              <View key={item.id}>
                <Text>{item.name}</Text>
                <Button title="View Details" onPress={() => navigation.navigate('Details', { item, routeName })} />
                <Button title="Add To Cart" onPress={() => addToCart(item)} />
              </View>
            )}
            keyExtractor={item => item.id}
          />
        )}
      </SafeAreaView>
    );
  }

  function Cart({ navigation }: any) {
    let routeName="Cart";
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Cart</Text>
        <Text>Total Items: {cartItems.length}</Text>
        <FlatList
          data={cartItems}
          renderItem={({ item }) => (
            <View key={item.id}>
              <Text>
                <Button title={item.name} onPress={() => navigation.navigate("Details", { item , routeName})} /> - Quantity: {item.quantity}
              </Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    );
  }

  function Details({ navigation, route }: any) {
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Details</Text>
        <Text>Name: {route.params.item.name}</Text>
        <Text>Description: {route.params.item.description}</Text>
        <Text>Price: {route.params.item.price}</Text>
        <Button title="Back" onPress={() => navigation.navigate(route.params.routeName)} />
      </SafeAreaView>
    );
  }

  return (
<>
<View style={styles.tabBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.appButtonContainer}>
          <Text style={styles.appButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.appButtonContainer}>
          <Text style={styles.appButtonText}>Cart</Text>
        </TouchableOpacity>
      </View>
    <Stack.Navigator>
      <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
      <Stack.Screen name='Cart' component={Cart} options={{ headerShown: false }} />
      <Stack.Screen name='Details' component={Details} options={{ headerShown: false }} />
    </Stack.Navigator>
</>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: "grey",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  appButtonContainer: {
    backgroundColor: "blue",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 3
  },
  appButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  }
});

export default App;