import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator
} from "react-native";
import { Text } from "../components/Themed";
import React, { useState, useEffect, useContext } from "react";
import firebase from "../fbconfig";
import { AuthContext } from "../providers/AuthProvider.js";
import EventListItem from "../components/PlanScreen/EventListItem";
import EventFilter from "./PlanScreen/EventFilter";

export const EventsScreen = ({ route, navigation }) => {
  const [eventList, setEventList] = useState(null);
  const [eventFriendList, setFriendEventList] = useState(null);
  const [limit, setLimit] = useState(7);
  const [isFetching, setIsFetching] = useState(false);
  const [lastVisited, setLastVisited] = useState();
  const [lastVisitedGroup, setLastVisitedGroup] = useState();
  const [loading, setLoading] = useState();
  const [eventFilter, setEventFilter] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const db = firebase.firestore();
  useEffect(() => {
    //clean up useEffect
    let isSubscribed = true;
    if (isSubscribed) {
      try {
        retrieveAllData();
      } catch (error) {
        console.log("retrieveData error: " + error);
      }
    }
    return () => (isSubscribed = false);
  }, [eventFilter]);

  const retrieveAllData = async () => {
    let initialQuery = await db.collection("events").doc(currentUser.uid);
    //set loading
    setLoading(true);
    initialQuery
      .collection("list")
      .orderBy("created", "desc")
      //.limit(limit)
      .onSnapshot(snapshot => {
        let events = [];
        if (snapshot.size) {
          snapshot.forEach(item => {
            events.push({
              ...item.data(),
              id: item.id
            });
          });

          //Document ID To Start From For Proceeding Queries
          let last = snapshot.docs[snapshot.docs.length - 1];
          //console.log('visited: ' + last);
          setLastVisited(last);
          //setLoading(false)
        } else {
          setLoading(false);
        }
        setTimeout(() => {
          //console.log(events);
          setEventList(events);
          setLoading(false);
        }, 300);
      });
  };

  const retrieveFilterData = idx => {
    switch (idx) {
      case false:
        //get only events by current user
        retrieveAllData();
        break;
      case true:
        //get only other events from group
        getEventFromGroup();
        break;
    }
  };

  const getEventFromGroup = async () => {
    let initialQuery = await db.collection("events").doc(currentUser.uid);
    setLoading(true);
    initialQuery
      .collection("group_list")
      .orderBy("created", "desc")
      //.limit(limit)
      .onSnapshot(snapshot => {
        let eventGroup = [];
        if (snapshot.size) {
          snapshot.forEach(event => {
            db.collection("events")
              .doc(event.data().uid_event_owner)
              .collection("list")
              .doc(event.data().event_id)
              .get()
              .then(item => {
                //console.log(item.data());
                eventGroup.push({
                  ...item.data(),
                  id: item.id,
                  uid_owner: event.data().uid_event_owner
                });
              });
            let last = snapshot.docs[snapshot.docs.length - 1];
            //console.log('visited: ' + last);
            setLastVisitedGroup(last);
          });
        } else {
          console.log("no more rows to fetch");
          setLoading(false);
        }
        setTimeout(() => {
          // if eventGroup is empty and set the state to show No Event Available
          if (eventGroup === undefined || eventGroup.length == 0) {
            setEventList(null);
          } else {
            setEventList(eventGroup);
          }

          setLoading(false);
        }, 300);
      });
  };

  const retrieveMoreData = async () => {
    let initialQuery = await db
      .collection("events")
      .doc(currentUser.uid)
      .collection("list");

    initialQuery
      .orderBy("created", "desc")
      .startAfter(lastVisited)
      .limit(limit)
      .onSnapshot(snapshot => {
        if (snapshot.size) {
          //set loading
          setIsFetching(true);

          let moreEvents = [...eventList];
          snapshot.forEach(item => {
            //console.log(item.data())
            moreEvents.push({
              ...item.data(),
              id: item.id,
              member_count: snapshot.size
            });
          });

          //console.log(moreEvents);
          setTimeout(() => {
            //set events data to state
            setEventList(moreEvents);
            setIsFetching(false);
          }, 500);

          let last = snapshot.docs[snapshot.docs.length - 1];
          setLastVisited(last);
        } else {
          console.log("no more row to fetch");
          setIsFetching(false);
        }
      });
  };

  const handleEditEvent = itemDetail => {
    navigation.navigate("EditEvent", itemDetail);
  };

  const handleFilter = idx => {
    retrieveFilterData(idx);
    //console.log("filter pressed", idx);
    //setEventFilter(idx);
  };

  return (
    <SafeAreaView style={styles.container}>
      <EventFilter onPressFilter={handleFilter} />
      {eventList ? (
        <>
          {!loading ? (
            <>
              <FlatList
                data={eventList}
                renderItem={({ item }) => (
                  <EventListItem
                    itemDetail={item}
                    onPressDetail={handleEditEvent}
                    navigation={navigation}
                  />
                )}
                //onEndReached={() => retrieveMoreData()}
                //onEndReachedThreshold={0.1}
              />
            </>
          ) : (
            <ActivityIndicator size="large" color="#0097e6" />
          )}

          {isFetching && <ActivityIndicator size="large" color="#0097e6" />}
        </>
      ) : (
        <>
          {loading && <ActivityIndicator size="large" color="#0097e6" />}
          {!eventList && !loading && (
            <Text style={styles.noDataText}>No Events Available.</Text>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  noDataText: {
    fontSize: 16,
    color: "#f5f6fa",
    textTransform: "capitalize",
    fontWeight: "bold",
    marginTop: 275,
    alignSelf: "center"
  }
});

export default EventsScreen;
