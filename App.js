import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';
var config = awsconfig;

const urlOpener = async (url, redirectUrl) => {
  console.log('asd', url, redirectUrl);
  // On Expo, use WebBrowser.openAuthSessionAsync to open the Hosted UI pages.
  const { type, url: newUrl } = await WebBrowser.openAuthSessionAsync(url, redirectUrl);

  if (type === 'success') {
    await WebBrowser.dismissBrowser();

    if (Platform.OS === 'ios') {
      return Linking.openURL(newUrl);
    }
  }
};

config.urlOpener = urlOpener;

Amplify.configure(config);

export default class App extends React.Component {
  async componentDidMount() {
    this._checkIfAuthenticated();
    Hub.listen('auth', async data => {
      switch (data.payload.event) {
        case 'signIn':
          {
            let temp = await Auth.currentSession();
            console.log('User signIn', temp);
          }
          break;
        case 'signOut':
          console.log('User signOut');
          break;
        default:
          break;
      }
    });
  }

  async _checkIfAuthenticated() {
    let currentSession = null;
    try {
      currentSession = await Auth.currentSession();
    } catch (err) {
      console.log(err);
    }
    console.log('currentsession', currentSession);
  }

  signin = () => {
    Auth.federatedSignIn({ provider: 'LoginWithAmazon' });
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Button title="Login With Amazon" onPress={this.signin} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
