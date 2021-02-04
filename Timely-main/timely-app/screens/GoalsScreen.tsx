import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import firebase from "../fbconfig";
import { AuthContext } from "../providers/AuthProvider.js";
import GoalListItem from "../components/PlanScreen/GoalListItem";

export const GoalsScreen = ({ navigation }) => {
  const [goalList, setGoalList] = useState(null);
  const [limit, setLimit] = useState(7);
  const [isFetching, setIsFetching] = useState(false);
  const [lastVisited, setLastVisited] = useState();
  const [loading, setLoading] = useState();
  const { currentUser } = useContext(AuthContext);

  const db = firebase.firestore();
  const fStorage = firebase.storage();

  useEffect(() => {
    try {
      retrieveData();
    } catch (error) {
      console.log("retrieveData error: " + error);
    }
  }, []);

  const retrieveData = async () => {
    let initialQuery = await db
      .collection("goals")
      .doc(currentUser.uid)
      .collection("list")
      .orderBy("created", "desc")
      .limit(limit);

    initialQuery.onSnapshot(snapshot => {
      if (snapshot.size) {
        //set loading
        setLoading(true);

        let goals = [];
        snapshot.forEach(item => {
          goals.push({ ...item.data(), id: item.id });
        });
        //console.log(goals);
        //set goals data to state
        setTimeout(() => {
          setGoalList(goals);
          setLoading(false);
        }, 500);
        //Cloud Firestore: Last Visible Document
        //Document ID To Start From For Proceeding Queries
        let last = snapshot.docs[snapshot.docs.length - 1];
        //console.log('visited: ' + last);
        setLastVisited(last);
        //setLoading(false)
      } else {
        setLoading(false);
      }
    });
  };

  const retrieveMoreData = async () => {
    let initialQuery = await db
      .collection("goals")
      .doc(currentUser.uid)
      .collection("list")
      .orderBy("created", "desc")
      .startAfter(lastVisited)
      .limit(limit);

    initialQuery.onSnapshot(snapshot => {
      if (snapshot.size) {
        //set loading
        setIsFetching(true);
        let moreGoals = [...goalList];
        snapshot.forEach(item => {
          //console.log(item.data())
          moreGoals.push({ ...item.data(), id: item.id });
        });
        //console.log(moreGoals);
        setTimeout(() => {
          //set goals data to state
          setGoalList(moreGoals);
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

  const handleDetail = itemDetail => {
    navigation.navigate("EditGoal", itemDetail);
  };

  const handleViewDetail = itemDetail => {
    navigation.navigate("GoalDetail", itemDetail);
  };

  const handleRemoveGoal = itemDetail => {
    console.log("check if here");
    if (itemDetail.picUrl) {
      fStorage
        .refFromURL(itemDetail.picUrl)
        .delete()
        .then(() => {
          console.log("Old pic has been deleted!");
        })
        .catch(function (error) {
          //setLoading(false)
          console.log("Delete picture: Uh-oh, an error occurred! " + error);
        });
    }

    db.collection("goals")
      .doc(currentUser.uid)
      .collection("list")
      .doc(itemDetail.id)
      .delete()
      .then(function() {
        console.log("Goal successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {goalList ? (
        <>
          <FlatList
            data={goalList}
            renderItem={({ item }) => (
              <GoalListItem
                itemDetail={item}
                onPressDetail={handleDetail}
                onPressVewDetail={handleViewDetail}
                onPressRemoveGoal={handleRemoveGoal}
              />
            )}
            onEndReached={() => retrieveMoreData()}
            onEndReachedThreshold={0.1}
          />
          {isFetching && <ActivityIndicator size="large" color="#0097e6" />}
        </>
      ) : (
          <>
            {loading && <ActivityIndicator size="large" color="#0097e6" />}
            {!goalList && !loading && (
              <Text style={styles.noDataText}>No Goals Available</Text>
            )}
          </>
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  noDataText: {
    fontSize: 16,
    color: "#f5f6fa",
    textTransform: "capitalize",
    fontWeight: "bold",
    alignSelf: "center"
  }
});

export default GoalsScreen;
