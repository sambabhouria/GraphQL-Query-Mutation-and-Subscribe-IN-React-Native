/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
// How to Call GraphQL Query and Mutation from React Native

import React, {useEffect, useState} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';

import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import {gql} from '@apollo/client';
import {WebSocketLink} from '@apollo/client/link/ws';

const App = () => {
  const [user, setUser] = useState({});

  // Connection for the subscription
  const wsLink = new WebSocketLink({
    uri: 'ws://localhost:4000/graphql',
    options: {
      reconnect: true,
    },
  });

  // Initialize Apollo Client
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    headers: {
      // Header(if any)
      authorization: 'a1b2c3d4-a1b2-a1b2c3d4e5f6',
    },
    cache: new InMemoryCache(),
    // link WebSocketLink subscription
    link: wsLink,
  });

  useEffect(() => {
    // Creating Suscription Observer
    let observer = client.subscribe({
      query: gql`
        subscription userAdded {
          userAdded {
            name
            age
            email
            address
            password
          }
        }
      `,
    });

    // Observer callback
    let subscriptionObj = observer.subscribe((result) => {
      console.log('Subscription data => ', result.data.userAdded);
      setUser(result.data.userAdded);
    });

    return () => {
      // Unsubscribe subscription
      console.log('Unsubscribed');
      subscriptionObj.unsubscribe();
    };
  }, [client]);

  const simpleQuery = async () => {
    alert('calling simple querry');
    // Calling Simple Graph Query
    const {data, error} = await client.query({
      query: gql`
        query users {
          users {
            name
            age
            email
            address
            password
          }
        }
      `,
    });
    // In case Error in Response
    if (error) {
      alert(`error + ${JSON.stringify(error)}`);
      console.log('error', JSON.stringify(error));
      return;
    }
    alert(`Got Record of ${data.users.length} Users`);
    console.log('data', JSON.stringify(data));
  };

  const dynamicQuery = async () => {
    // Calling Graph Query with variables
    const {data, error} = await client.query({
      query: gql`
        query user($email: String!) {
          user(email: $email) {
            name
            age
            email
            address
            password
          }
        }
      `,
      variables: {
        email: 'netus.et.malesuada@ornarelectusjusto.co.uk',
      },
    });
    // In case Error in Response
    if (error) {
      console.log('error', JSON.stringify(error));
      alert(`error + ${JSON.stringify(error)}`);
      return;
    }
    console.log('data', JSON.stringify(data.user));
    alert(`Response: ${JSON.stringify(data.user)}`);
  };

  const simpleMutation = async () => {
    // Calling Graph Mutation with variables
    const {data, error} = await client.mutate({
      mutation: gql`
        mutation createUser(
          $name: String!
          $email: String!
          $age: Int!
          $address: String!
          $password: String!
        ) {
          createUser(
            name: $name
            email: $email
            age: $age
            address: $address
            password: $password
          )
        }
      `,
      variables: {
        name: `New User ${Math.random()}`,
        //'newuser@gmail.com',
        email: `newuser${Math.random()}@gmail.com`,
        age: 30,
        address: 'Demo Address',
        password: '12345',
      },
    });
    // In case Error in Response
    if (error) {
      alert(`error => ${JSON.stringify(error)}`);
      console.log('error', JSON.stringify(error));
      return;
    }
    alert(`Response: ${JSON.stringify(data.createUser)}`);
    console.log('data', JSON.stringify(data.createUser));
  };

  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.titleText}>
            How to Call GraphQL Query and Mutation from React Native
          </Text>
          <View style={styles.innerContainer}>
            <Text style={styles.textStyle}>
              Run Simple Query (Get All User)
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttonStyle}
              onPress={simpleQuery}>
              <Text style={styles.buttonTextStyle}>Get Data</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.innerContainer}>
            <Text style={styles.textStyle}>
              Run Dynamic Query by passing payload as variable {'\n'}
              (Get Single User by Email)
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttonStyle}
              onPress={dynamicQuery}>
              <Text style={styles.buttonTextStyle}>Get Data</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.innerContainer}>
            <Text style={styles.textStyle}>
              Run Mutation by passing payload as variable {'\n'}
              (Create User)
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttonStyle}
              onPress={simpleMutation}>
              <Text style={styles.buttonTextStyle}>Add User</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.innerContainer}>
            <Text style={styles.textStyle}>
              Subscription Data {'\n'}
              (Subscribed for Successfull user Creation)
            </Text>
            <Text style={{textAlign: 'center'}}>
              Last Added User: {JSON.stringify(user)}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: 'grey',
          }}>
          sambabhouria@gmail.com
        </Text>
      </SafeAreaView>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    textAlign: 'center',
  },
  innerContainer: {
    marginTop: 16,
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonStyle: {
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#8ad24e',
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default App;
