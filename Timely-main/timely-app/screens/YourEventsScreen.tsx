import * as React from 'react';
import { StyleSheet, SafeAreaView, FlatList, Alert } from 'react-native';
import EventBlock from '../components/EventBlock';
import firebase from "../fbconfig";
import { AuthContext } from '../providers/AuthProvider';

export default class YourEventsScreen extends React.Component<{}, { events_list: any[] }>{
  constructor(props) {
    super(props)
    this.state = {
      events_list: []
    }
    this.handleSignOut = this.handleSignOut.bind(this)
  }


  // Access auth
  static contextType = AuthContext

  componentDidMount() {
    this.getUserEvents()
  }


  getUserEvents() {
    const { uid } = this.context.currentUser
    const db = firebase.firestore();

    // Getting correct document in events collection
    return db.collection('events').doc(uid).collection('list').get()
      .then(docs => {
        const events_list: any[] = []
        docs.forEach((doc) => {

          events_list.push({ ...doc.data(), id: doc.id })
        })
        this.setState(
          { events_list },
        )
      })
      // Handle errors
      .catch(function (err) {
        Alert.alert('OOPS!', err.message, [{ text: 'close' }])
        console.log(err)
      });
  }

  handleSignOut() {
    firebase.auth().signOut();
  }

  renderItem = ({ item }) => {
    return <EventBlock event={item} key={item.id} />
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={{ width: '100%' }}
          data={this.state.events_list}
          renderItem={this.renderItem}
          keyExtractor={event => event[0]}
        />
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
