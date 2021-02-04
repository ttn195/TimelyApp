//FLow
//First user enters old password. Then firebase checks if the password is correct, if not retype password.
//Then create a new password and save that password for that user.

import * as React from "react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider.js";
import {
  Image,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { windowHeight, windowWidth } from "../utils/Dimensions";
import * as Yup from "yup";
import * as firebase from "firebase";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import FormButton from "../components/FormButton";
import Loader from "../components/Modal/Loader";
import { createRandomString } from "../utils/utils";
import FormInput from "../components/FormInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const EditProfileScreen = ({ route, navigation }) => {
  const { currentUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState();
  const [isDone, setIsDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messText, setMessText] = useState();
  const [isPickedPic, setIsPickedPic] = useState(false);
  const [profile, setProfile] = useState({});
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
    //console.log("profile data", route.params);
    setImage(route.params.profileImgURL);
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

  const handleEditProfile = async values => {
    //showing indicator
    setLoading(true);

    try {
      if (isPickedPic) {
        //send a message to indicator modal
        setMessText("Uploading...");
        const img_extension = image.split(".").pop();
        const imageName =
          "profile-image-" + createRandomString() + "." + img_extension;

        const response = await fetch(image);
        const file = await response.blob();
        const uploadTask = fStorage
          .ref()
          .child("profile_images/" + imageName)
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

                if (route.params.profileImgURL && !currentUser.photoURL) {
                  setMessText("Deleting old picture...");

                  fStorage
                    .refFromURL(route.params.profileImgURL)
                    .delete()
                    .then(() => {
                      console.log("old pic deleted");
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
                  setMessText("Updating profile...");
                  console.log(values);
                  return db
                    .collection("profiles")
                    .doc(currentUser.uid)
                    .set(
                      {
                        // changed
                        ...values,
                        modifiedDate: Date.now(),
                        profileImgURL: downloadURL
                      },
                      { merge: true }
                    )
                    .then(() => {
                      setIsDone(true);
                      console.log("Updated Profile Successfully");
                      setMessText("Updated Profile Successfully");
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
        setMessText("Updating profile...");
        setTimeout(() => {
          console.log(values);
          return db
            .collection("profiles")
            .doc(currentUser.uid)
            .set(
              {
                // changed
                ...values,
                modifiedDate: Date.now()
              },
              { merge: true }
            )
            .then(() => {
              console.log("Updated Profile wihtout a picture successfully!");
              setIsDone(true);
              setMessText("Updated Profile Successfully!");
              setTimeout(() => {
                setLoading(false);
                navigation.navigate("Profile");
              }, 300);
            });
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues = {
    first_name: route.params.first_name ? route.params.first_name : "",
    last_name: route.params.last_name ? route.params.last_name : "",
    bio: route.params.bio ? route.params.bio : ""
    //profile_visibility: route.params.profile_visibility
  };

  const profileValidationSchema = Yup.object().shape({
    first_name: Yup.string()
      .max(20, "First name too long")
      .required("First name is Required"),
    last_name: Yup.string()
      .max(20, "Last name too long")
      .required("Last name is Required"),
    bio: Yup.string().max(220, "Bio too long")
  });

  return (
    <KeyboardAwareScrollView>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <Loader progress={progress} isDone={isDone} messText={messText} />
        ) : null}

        {image ? (
          <Image source={{ uri: image }} style={styles.profile_picture} />
        ) : (
          <View style={styles.defaultPic}>
            <AntDesign name="picture" size={40} color="#666" />
          </View>
        )}

        <TouchableOpacity style={styles.choosePicContainer} onPress={pickImage}>
          <Text style={styles.choosePicText}>Choose Profile Picture</Text>
        </TouchableOpacity>

        <Formik
          initialValues={initialValues}
          validationSchema={profileValidationSchema}
        >
          {({
            handleChange,
            handleBlur,

            values,
            errors,
            isValid,
            dirty,
            touched
          }) => (
            <>
              <FormInput
                labelValue={values.first_name}
                onChangeText={handleChange("first_name")}
                placeholderText={"First Name: " + values.first_name}
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={handleBlur("firstName")}
              />
              {errors.first_name && touched.first_name && (
                <Text style={styles.alertText}>{errors.first_name}</Text>
              )}
              <FormInput
                labelValue={values.last_name}
                onChangeText={handleChange("last_name")}
                placeholderText={"Last Name: " + values.last_name}
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={handleBlur("lastName")}
              />
              {errors.last_name && touched.last_name && (
                <Text style={styles.alertText}>{errors.last_name}</Text>
              )}
              <View style={styles.emailContainer}>
                <Text style={styles.emailText}>{route.params.email}</Text>
              </View>
              <FormInput
                nOfLines={3}
                labelValue={values.bio}
                onChangeText={handleChange("bio")}
                placeholderText={"Bio: " + values.bio}
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={handleBlur("bio")}
              />

              <FormButton
                buttonTitle="Update"
                onPress={() => {
                  //if (!dirty) return Alert.alert("Please update values");
                  if (!isValid) return Alert.alert("Invalid fields");
                  return handleEditProfile(values);
                }}
                //disabled={!isValid}
              />
            </>
          )}
        </Formik>

        <TouchableOpacity
          style={styles.pButtonContainer}
          onPress={() => {
            navigation.navigate("EditPassword", profile);
          }}
        >
          <Text style={styles.pButtonText}>Edit Password</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111111",
    flex: 1,
    justifyContent: "center",
    padding: 10
  },

  choosePicContainer: {
    marginBottom: 10,
    height: windowHeight / 20,
    backgroundColor: "#0984e3",
    padding: 10,
    alignSelf: "center",
    borderRadius: 3,
    justifyContent: "center",
    marginTop: 10
  },

  choosePicText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff"
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

  profile_picture: {
    backgroundColor: "#dcdde1",
    height: windowHeight / 4,
    width: windowHeight / 4,
    borderColor: "#ccc",
    borderRadius: windowHeight / 4 / 2,
    borderWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 15
  },

  nameContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: "50%",
    height: windowHeight / 15,
    borderColor: "#ccc",
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff"
  },

  pButtonContainer: {
    marginTop: 10,
    width: "100%",
    height: windowHeight / 15,
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3
  },

  pButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff"
  },

  alertText: {
    color: "#ff7979",
    fontSize: 12,
    margin: 5,
    fontWeight: "bold"
  },
  emailContainer: {
    backgroundColor: "#fff",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#ced6e090",
    padding: 10,
    marginBottom: 5,
    height: windowHeight / 15,
    justifyContent: "center"
  },
  emailText: {
    color: "#8395a7",
    fontSize: 16
  }
});
