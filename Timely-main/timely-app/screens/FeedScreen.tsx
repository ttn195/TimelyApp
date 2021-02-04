import * as React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import SelectFeed from "./FeedScreen/SelectFeed";
import { createStackNavigator } from "@react-navigation/stack";
import { FeedSelectParamList } from "../types";
import FollowingFeedScreen from "./FollowingFeedScreen";
import NotificationsFeedScreen from "./NotificationsFeedScreen";
import firebase from "../fbconfig";
import { AuthContext } from "../providers/AuthProvider";

const FeedSelectStack = createStackNavigator<FeedSelectParamList>();

export default class FeedScreen extends React.Component<
  { route: any; navigation: any },
  { selected: string; badge: number }
> {
  constructor(props) {
    super(props);
    this.state = {
      selected: "Following",
      badge: 0
    };

    this.handleSelect = this.handleSelect.bind(this);
  }
  // Access auth
  static contextType = AuthContext;

  componentDidMount() {
    this.handleBadge();
  }

  handleSelect(selected) {
    this.setState({ selected }, () => {
      this.props.navigation.navigate(selected);
    });
  }

  handleBadge() {
    const { uid } = this.context.currentUser;
    const db = firebase.firestore();
    try {
      return db
        .collection("notification")
        .doc(uid)
        .collection("member_notify")
        .where("status", "==", "pending")
        .onSnapshot(snapshot => {
          if (snapshot.size) {
            this.setState({ badge: snapshot.size });
          } else {
            this.setState({ badge: 0 });
          }
        });
    } catch (error) {
      console.log("notification badges error", error);
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <SelectFeed onSelect={this.handleSelect} badge={this.state.badge} />
        <FeedSelectStack.Navigator>
          <FeedSelectStack.Screen
            name="Following"
            component={FollowingFeedScreen}
          />
          <FeedSelectStack.Screen
            name="Notifications"
            component={NotificationsFeedScreen}
          />
        </FeedSelectStack.Navigator>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
  }
});
