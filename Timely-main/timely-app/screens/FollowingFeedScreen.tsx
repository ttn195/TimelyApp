import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { AuthContext } from "../providers/AuthProvider";
import firebase from "../fbconfig";
import { SafeAreaView } from "react-navigation";
import { FlatList } from "react-native-gesture-handler";
import EventListItem from "../components/FeedScreen/EventListItem";
import FollowingFilter from "../components/FeedScreen/FollowingFilter";
import FollowingGoalListItem from "../components//FeedScreen/FollowingGoalListItem";
export const FollowingFeedScreen = ({ navigation }) => {
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [goalsList, setGoalsList] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [eventFilter, setEventFilter] = useState(0);
  const { currentUser } = useContext(AuthContext);

  const db = firebase.firestore();
  const fStorage = firebase.storage();

  let query = db
    .collection("profiles")
    .doc(currentUser.uid)
    .collection("friend_list")
    .where("pending", "==", false);

  useEffect(() => {
    try {
      retrieveEvents();
      retrieveGoals();
    } catch (error) {
      console.log("retrieveData error: " + error);
    }
  }, [eventFilter]);

  const retrieveEvents = async () => {
    setIsFetching(true);
    let initialQuery = await query;

    let eventsList: any[] = [];
    initialQuery.onSnapshot(snapshot => {
      if (snapshot.size) {
        snapshot.forEach(user => {
          //get friend's info

          db.collection("profiles")
            .doc(user.data().friend_id)
            .get()
            .then(info => {
              let tempEvents = db
                .collection("events")
                .doc(user.data().friend_id)
                .collection("list")
                .where("public", "==", true);

              tempEvents.get().then(snap => {
                if (snap.size) {
                  snap.forEach(event => {
                    // check if current user is already member in event
                    db.collection("events")
                      .doc(user.data().friend_id)
                      .collection("list")
                      .doc(event.id)
                      .collection("members")
                      .where("friend_id", "==", currentUser.uid)
                      .where("status","==","joined")
                      .onSnapshot(snapshot => {
                        if (!snapshot.size) {
                          eventsList.push({
                            ...event.data(),
                            id: event.id,
                            friend_id: user.data().friend_id,
                            friend_info: info.data()
                          });
                        }
                      });
                  });
                  setTimeout(() => {
                    setEventsList(eventsList);
                    setIsFetching(false);
                  }, 1000);
                }
              });
            });
        });
      }
    });
  };

  const retrieveGoals = async () => {
    setIsFetching(true);
    let initialQuery = await query;
    let goalsList: any[] = [];
    initialQuery.onSnapshot(snapshot => {
      if (snapshot.size) {
        snapshot.forEach(user => {
          db.collection("profiles")
            .doc(user.data().friend_id)
            .get()
            .then(info => {
              db.collection("goals")
                .doc(user.id)
                .collection("list")
                .where("public", "==", true)
                .get()
                .then(goals => {
                  if (goals.size) {
                    goals.forEach(goal => {
                      goalsList.push({
                        ...goal.data(),
                        id: goal.id,
                        friend_id: user.data().friend_id,
                        friend_info: info.data()
                      });
                    });
                  }
                });
            });
        });
      }
      setTimeout(() => {
        setGoalsList(goalsList);
        setIsFetching(false);
      }, 400);
    });
  };

  const handleFilter = idx => {
    //console.log("filter pressed", idx);
    setEventFilter(idx);
  };
  if (eventsList)
    return (
      <SafeAreaView style={styles.container}>
        <FollowingFilter onPressFilter={handleFilter} />
        {!eventFilter ? (
          <FlatList
            data={eventsList}
            renderItem={({ item }) => (
              <EventListItem itemDetail={item} navigation={navigation} />
            )}
          />
        ) : (
          <FlatList
            data={goalsList}
            renderItem={({ item }) => (
              <FollowingGoalListItem
                itemDetail={item}
                navigation={navigation}
              />
            )}
          />
        )}
        {isFetching && <ActivityIndicator size="large" color="#0097e6" />}
      </SafeAreaView>
    );
  else
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0097e6" />
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default FollowingFeedScreen;
