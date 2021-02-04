import {
  SafeAreaView,
  Switch,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import FormButton from "../components/FormButton";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as ImagePicker from "expo-image-picker";
import FormInput from "../components/FormInput";
import AntDesign from "react-native-vector-icons/AntDesign";
import DateTimePicker from "../components/DateTimePicker";
import * as Yup from "yup";
import { Formik } from "formik";
import firebase from "../fbconfig";
import { AuthContext } from "../providers/AuthProvider.js";
import Loader from "../components/Modal/Loader";
import { createRandomString } from "../utils/utils";
import { windowHeight, windowWidth } from "../utils/Dimensions";

export const EditGoalScreen = ({ route, navigation }) => {
  const { currentUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [isPickedPic, setIsPickedPic] = useState(false);
  const [progress, setProgress] = useState();
  const [isDone, setIsDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messText, setMessText] = useState();

  const db = firebase.firestore();
  const fStorage = firebase.storage();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();

    //retrieve goal detail
    console.log("detail id is: " + route.params.id);
    //console.log('pic: ' + route.params.picUrl);
    //set picture image
    setImage(route.params.picUrl);
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      setIsPickedPic(true);
      setImage(result.uri);
    }
  };

  const handleUpdateGoal = async values => {
    //showing indicator
    setLoading(true);

    try {
      if (isPickedPic) {
        //send a message to indicator modal
        setMessText("Uploading...");
        const img_extension = image.split(".").pop();
        const imageName =
          "goal-image-" + createRandomString() + "." + img_extension;

        const response = await fetch(image);
        const file = await response.blob();
        const uploadTask = fStorage
          .ref()
          .child("goal_images/" + imageName)
          .put(file);
        setTimeout(() => {
          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            snapshot => {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              setProgress(progress);
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log("Upload is paused");
                  setMessText("Upload is paused");
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log("Upload is running");
                  setMessText("Upload is running");
                  break;
              }
            },
            error => {
              setMessText("Error: " + error.code);
              setLoading(false);
              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
                case "storage/unauthorized":
                  console.log(
                    "User does not have permission to access the object"
                  );
                  break;

                case "storage/canceled":
                  console.log("User canceled the upload");
                  break;

                case "storage/unknown":
                  console.log(
                    "Unknown error occurred, inspect error.serverResponse"
                  );
                  break;
              }
            },
            () => {
              // Upload completed successfully, now we can get the download URL
              uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                console.log("File available at", downloadURL);

                //delete old picture
                if (route.params.picUrl) {
                  setMessText("Deleting old picture...");

                  fStorage
                    .refFromURL(route.params.picUrl)
                    .delete()
                    .then(() => {
                      setMessText("Old pic has been deleted!");
                    })
                    .catch(function(error) {
                      setMessText("Uh-oh, an error occurred!");
                      setLoading(false);
                      console.log(
                        "Delete picture: Uh-oh, an error occurred! " + error
                      );
                    });
                }
                setTimeout(() => {
                  setMessText("Updating goal...");
                  return db
                    .collection("goals")
                    .doc(currentUser.uid)
                    .collection("list")
                    .doc(route.params.id)
                    .update({
                      ...values,
                      modifiedDate: Date.now(),
                      picUrl: downloadURL
                    })
                    .then(() => {
                      setIsDone(true);
                      console.log("Updated Goal SUCCESSFULLY");
                      setMessText("Updated goal successfully!");
                      setTimeout(() => {
                        setLoading(false);
                        navigation.navigate("Profile");
                      }, 1500);
                    });
                });
              }, 1500);
            }
          );
        }, 2500);
      } else {
        setMessText("Updating goal...");
        setTimeout(() => {
          // add new goal without a picture url
          return db
            .collection("goals")
            .doc(currentUser.uid)
            .collection("list")
            .doc(route.params.id)
            .update({
              ...values,
              modifiedDate: Date.now()
            })
            .then(() => {
              console.log("Updated goal without a picture SUCCESSFULLY");
              setIsDone(true);
              setMessText("Updated goal successfully!");
              setTimeout(() => {
                setLoading(false);

                navigation.navigate("PlanScreen");
              }, 300);
            });
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /****** VALIDATION using Formik and Yup ******/
  const endDate = route.params.end.toDate();
  const initialValues = {
    title: route.params.title,
    description: route.params.description,
    end: endDate,
    status: route.params.status,
    public: route.params.public
  };

  // With Yup validationSchema
  const signInValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is Required"),
    public: Yup.boolean(),
    status: Yup.boolean(),
    end: Yup.string().required("End date required"),
    description: Yup.string().max(220, "Description too long")
  });

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <Loader progress={progress} isDone={isDone} messText={messText} />
        ) : null}

        {image ? (
          <Image source={{ uri: image }} style={styles.defaultPic} />
        ) : (
          <View style={styles.defaultPic}>
            <AntDesign name="picture" size={40} color="#666" />
          </View>
        )}

        <TouchableOpacity style={styles.choosePicContainer} onPress={pickImage}>
          <Text style={styles.choosePicText}>Choose Picture</Text>
        </TouchableOpacity>

        <Formik
          initialValues={initialValues}
          validationSchema={signInValidationSchema}
          onSubmit={values => {
            handleUpdateGoal(values);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            isValid,
            touched
          }) => (
            <>
              <FormInput
                labelValue={values.title}
                onChangeText={handleChange("title")}
                placeholderText="title"
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={handleBlur("title")}
              />
              {errors.title && touched.title && (
                <Text style={styles.alertText}>{errors.title}</Text>
              )}
              <TextInput
                value={values.description}
                onChangeText={handleChange("description")}
                placeholder={"Description"}
                numberOfLines={4}
                multiline={true}
                style={styles.descriptionBoxStyle}
                placeholderTextColor="grey"
              >
                {errors.description && touched.description && (
                  <Text style={styles.alertText}>{errors.description}</Text>
                )}
              </TextInput>

              <Text style={styles.completionBoxStyle}>Completed By:</Text>

              <DateTimePicker
                initialDate={values.end}
                onSubmit={datetime => {
                  setFieldValue("end", datetime);
                }}
              />
              {errors.end && touched.end && (
                <Text style={styles.alertText}>{errors.end}</Text>
              )}
              <Text style={styles.notCompleteTextBoxStyle}>
                Is Completed ?:
              </Text>

              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor="#0984e3"
                ios_backgroundColor="#3e3e3e"
                value={values.status}
                onValueChange={value => setFieldValue("status", value)}
              ></Switch>
              <Text style={styles.notCompleteTextBoxStyle}>Public:</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor="#0984e3"
                ios_backgroundColor="#3e3e3e"
                value={values.public}
                onValueChange={value => setFieldValue("public", value)}
              ></Switch>
              <FormButton
                buttonTitle="Update"
                onPress={handleSubmit}
                disabled={!isValid}
              />
            </>
          )}
        </Formik>
      </SafeAreaView>
    </ScrollView>
  );
};

export default EditGoalScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9fafd",
    flex: 1,
    justifyContent: "center",
    padding: 10
  },

  choosePicContainer: {
    marginTop: 10,
    marginBottom: 10,
    height: windowHeight / 20,
    backgroundColor: "#0984e3",
    padding: 10,
    alignSelf: "center",
    borderRadius: 3
  },
  choosePicText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",

    paddingLeft: 10,
    paddingRight: 10
  },

  defaultPic: {
    backgroundColor: "#dcdde1",
    height: windowHeight / 4,
    width: windowWidth / 1.5,
    borderColor: "#ccc",
    borderRadius: 3,
    borderWidth: 1,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center"
  },

  completionBoxStyle: {
    marginTop: 10,
    marginBottom: 10,
    color: "grey",
    fontWeight: "bold"
  },

  completeTextBoxStyle: {
    backgroundColor: "white",
    color: "grey",
    padding: 10,
    width: "45%"
  },

  descriptionBoxStyle: {
    backgroundColor: "#fff",
    height: windowHeight / 8,
    paddingLeft: 5,
    borderColor: "#ccc",
    borderRadius: 3,
    borderWidth: 1
  },

  notCompleteTextBoxStyle: {
    marginTop: 10,
    marginBottom: 10,
    color: "grey",
    alignItems: "flex-start",
    fontWeight: "bold"
  },

  alertText: {
    margin: 5,
    color: "#ff7979",
    fontSize: 12,
    marginTop: 0,
    fontWeight: "bold"
  }
});
