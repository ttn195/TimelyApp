import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Text, View } from "../components/Themed";
import firebase from "../fbconfig";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormButton from "../components/FormButton";
import FormikInput from "../components/FormikInput";
import { AuthContext } from "../providers/AuthProvider";
import DateTimePicker from "../components/DateTimePicker";
import FriendListModal from "../components/Modal/FriendListModal";
import Loader from "../components/Modal/Loader";

export const AddEvent = ({ route, navigation }) => {
  // Access auth
  const { currentUser } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [inviteFriends, setInviteFriend] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messText, setMessText] = useState();

  const displayModal = show => {
    setModalVisible(show);
  };

  //this one will get friend list who have been invited
  const retrieveFriendInvitation = friend => {
    console.log(friend);
    let list;
    if (inviteFriends) {
      list = [...inviteFriends];
      list.push(friend);
      //setInviteFriend(list);
    } else {
      list = [];
      list.push(friend);
      //console.log(list);
    }
    setInviteFriend(list);
  };

  const cancelInvitation = item => {
    if (inviteFriends) {
      // make a copy
      let friendData = JSON.parse(JSON.stringify(inviteFriends));
      friendData.forEach((data, idx) => {
        if (item.id === data.id) {
          console.log("remove " + item.id + " from invitation");
          friendData.splice(idx, 1);
        }
      });
      //set to state again
      setInviteFriend(friendData);
    } else {
      console.log("friends invitation is empty!");
    }
  };

  // Saves to database
  const handleSubmit = values => {
    const uid = currentUser.uid;
    const db = firebase.firestore();

    //showing indicator
    setLoading(true);
    setMessText("Adding new event...");
    const now = Date.now();
    //const event_id = "e" + now + uid;
    const query = db
      .collection("events")
      .doc(uid)
      .collection("list");
    // Setting events doc
    return (
      query
        .add({
          ...values,
          event_status: "TBD",
          created: now,
          timezone_offset: new Date().getTimezoneOffset()
        }) // Merge to not overwrite, but set to create if not exists
        // What to do after
        .then(doc => {
          if (inviteFriends) {
            setMessText("Adding members...");
            inviteFriends.forEach((data, idx) => {
              query
                .doc(doc.id)
                .collection("members")
                .add({
                  created: now,
                  status: "pending",
                  friend_id: data.id
                })
                .then(member => {
                  //console.log("added members to event successfully");
                  const noti_data = {
                    created: now,
                    type: "inviteToEvent",
                    uid_from: currentUser.uid,
                    email_from: currentUser.email,
                    uid_to: data.id,
                    message: "",
                    event_id: doc.id,
                    event_title: values.title,
                    status: "pending",
                    member_id: member.id
                  };
                  db.collection("notification")
                    .doc(data.id)
                    .collection("member_notify")
                    .add(noti_data)
                    .then(() => {
                      console.log("added notification successfully");
                    });
                  setIsDone(true);
                });
            });
          }
          setMessText("Added event successfully");
          setTimeout(() => {
            setLoading(false);
            navigation.navigate("PlanScreen");
          }, 1000);
        })
        // Handle errors
        .catch(function(err) {
          Alert.alert("OOPS!", err.message, [{ text: "close" }]);
          setLoading(false);
          console.log(err);
        })
    );
  };

  const memberList = member => {
    let fullName;
    if (member.first_name && member.last_name) {
      fullName = member.first_name + " " + member.last_name;
    }
    return (
      <View style={styles.memberList}>
        <View style={styles.memberInfo}>
          {fullName && (
            <Text style={{ textTransform: "capitalize" }}>{fullName}</Text>
          )}
          <Text>{member.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.memberDelete}
          onPress={() => cancelInvitation(member.id)}
        >
          <AntDesign name="deleteuser" size={25} color="#f9fafd" />
        </TouchableOpacity>
      </View>
    );
  };

  const eventValidationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Name is required")
      .max(30, "Name too long"),
    description: Yup.string().max(220, "Description too long"),
    public: Yup.boolean(),
    start: Yup.string().required("Start date required"),
    end: Yup.string().required("End date required"),
    goal: Yup.string()
  });

  const now = new Date();
  const hourFromNow = new Date();
  hourFromNow.setHours(hourFromNow.getHours() + 1);
  const initialValues = {
    title: "",
    description: "",
    public: false,
    start: now,
    end: hourFromNow,
    goal: ""
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={eventValidationSchema}
      onSubmit={() => {}}
    >
      {formik => {
        const {
          errors,
          touched,
          isValid,
          handleBlur,
          values,
          dirty,
          setFieldValue,
          validateForm
        } = formik;
        return (
          <SafeAreaView>
            <ScrollView>
              {loading ? <Loader isDone={isDone} messText={messText} /> : null}
              <View style={styles.container}>
                <Text>Name</Text>
                <FormikInput name="title" formik={formik} />
                <ErrorMessage name="title" component={Text} className="error" />

                <Text>Public</Text>
                <Switch
                  value={values.public}
                  onValueChange={value => setFieldValue("public", value)}
                />

                <Text>Description</Text>
                <FormikInput name="description" formik={formik} />
                <ErrorMessage
                  name="description"
                  component={Text}
                  className="error"
                />

                <Text>Start</Text>
                <DateTimePicker
                  initialDate={values.start}
                  onSubmit={datetime => {
                    setFieldValue("start", datetime);
                  }}
                />
                <ErrorMessage name="start" component={Text} className="error" />
                <Text>End</Text>
                <DateTimePicker
                  initialDate={values.end}
                  onSubmit={datetime => {
                    setFieldValue("end", datetime);
                  }}
                />
                <ErrorMessage name="end" component={Text} className="error" />
                <Text>Goal</Text>
                <FormikInput name="goal" formik={formik} />
                <ErrorMessage name="goal" component={Text} className="error" />

                <View style={styles.members}>
                  {modalVisible ? (
                    <FriendListModal
                      onPressModal={displayModal}
                      membersData={inviteFriends}
                      addMembers={retrieveFriendInvitation}
                      sendCancelToModal={cancelInvitation}
                    />
                  ) : null}

                  <Text>Members:</Text>
                  <TouchableOpacity
                    style={styles.inviteButton}
                    onPress={() => displayModal(true)}
                  >
                    <Text style={styles.inviteText}>
                      <AntDesign name="adduser" size={18} color="#f9fafd" />
                      Invite Friend
                    </Text>
                  </TouchableOpacity>

                  {inviteFriends && (
                    <FlatList
                      data={inviteFriends}
                      renderItem={({ item }) => memberList(item)}
                    />
                  )}
                </View>

                <FormButton
                  buttonTitle="Submit"
                  onPress={() => {
                    if (!dirty) return Alert.alert("Please input values");
                    if (!isValid) return Alert.alert("Invalid fields");
                    return handleSubmit(values);
                  }}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        );
      }}
    </Formik>
  );
};
export default AddEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
    padding: 10
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
  },
  inviteButton: {
    backgroundColor: "#20bf6b",
    margin: 5,
    borderRadius: 3,
    width: "40%",

    alignItems: "center"
  },
  inviteText: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 5
  },
  memberList: {
    flex: 1,
    flexDirection: "row",
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 3,
    borderColor: "#ccc",
    borderWidth: 1
  },
  memberInfo: {
    flex: 1,
    marginVertical: 5,
    marginLeft: 10,
    justifyContent: "center"
  },
  memberDelete: {
    padding: 5,
    backgroundColor: "#ee5253",
    width: 38,
    height: 38,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 3,
    marginVertical: 5,
    marginRight: 10
  }
});
