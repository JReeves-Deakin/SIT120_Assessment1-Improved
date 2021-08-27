import firebase from "firebase/app";
import 'firebase/storage'
import 'firebase/firestore';
require('firebase/auth')

const storageRef = firebase.storage().ref();

// This file holds most scripts used for Walkr

//Used to log the user in 
export function LoginUser(Email, Password) {
    firebase.auth().signInWithEmailAndPassword(Email, Password).catch((error) => alert(error));
}

//Creates a 'Walkr' account (does not add dogs onto the account)
export function Create_Walkr(AccountDetails) {
    firebase.auth().createUserWithEmailAndPassword(AccountDetails.Email, AccountDetails.Password)
        .then((User_details) => { //Create the user and then pass the user details (user_details)
            Set_profile_Data(AccountDetails, User_details.user); //Use function set profile data to set the data for the new user
        }).catch((error) => alert(error)); // Alert box with an error (existing account etc;)
}

//Creates an 'Ownr' account (adds dogs onto the account)
export function Create_Ownr(AccountDetails, Dog_data) {
    firebase.auth().createUserWithEmailAndPassword(AccountDetails.Email, AccountDetails.Password)
        .then((User_details) => {
            Set_profile_Data(AccountDetails, User_details.user);
            Add_Dogs(Dog_data, User_details.user); //Same as above, but also adding dogs 
        }).catch((error) => alert(error));
}

// Main function for creation user accounts
function Set_profile_Data(AccountDetails, user) {

    // Creates a document with the User ID as the title (also included in the document to get later)
    firebase.firestore().collection("Users").doc(user.uid).set({
        UID: user.uid
    }, { merge: true })

    //Set names to lowercase... firebase doesnt allow case insenitive searches (WHY?!)
    AccountDetails.Fname = AccountDetails.Fname.toLowerCase();
    AccountDetails.Lname = AccountDetails.Lname.toLowerCase();

    // iterate through each item in account details and attatch to the account
    for (const item in AccountDetails) {

        //If we're at "image", this is an actual file and cant be saved to users document
        if (item == 'Image') {
            if (AccountDetails.Image == null) { //If there's no image - there's just a URL (Default image used) add the URL to user account
                firebase.firestore().collection("Users").doc(user.uid).set({
                    ProfileImage: AccountDetails.ImageURL
                }, { merge: true })
            } else { Set_Profile_image(AccountDetails.Image, user) } // Upload the image to the users folder, then add the URL onto the user
        }

        //We don't need to add the image URL again, we cant add a file to a document &  we dont want to save password in plain text
        else if (item != 'Password' && item != "ImageURL" && item != "Image") {
            firebase.firestore().collection("Users").doc(user.uid).set({
                [item]: AccountDetails[item]
            }, { merge: true })
        }
    }
    return;
}

//Sets the users profile image
export function Set_Profile_image(img, user) {
    //a reference to the users folder
    const path = "users/" + user.uid + "/image/" + img.name;

    //Uploading the file to the folder (put), then adding the downloadURL to the user account
    storageRef.child(path).put(img).then((response) => {
        response.ref.getDownloadURL().then((download_URL) => {
            firebase.firestore().collection("Users").doc(user.uid)
                .set({ ProfileImage: download_URL }, { merge: true })
        });
    });
}

export async function Add_Dogs(Dog_data, user) {

    //How long an array is (they will all have same length (Name, Bio, DOB))
    for (var i = 0; i < Dog_data.Name.length; i++) {
        //Make new doc in 'UID/DOGS'
        const { id } = await firebase.firestore().collection("Users").doc(user.uid).collection("Dogs").add({ Account_type: "Dog" })
            // Loop through all items in Dog Data (i to go into their array)
        for (const item in Dog_data) {
            // if the item is an image (We need to upload and add the reference to the dog)
            if (item == "Image") {
                if (Dog_data.Image[i] == null) { //if theres no image, add the default URL to the dog
                    firebase.firestore().collection("Users").doc(user.uid).collection("Dogs").doc(id).set({
                        Image: Dog_data.ImageURL[i]
                    }, { merge: true })
                } else { //otherwise upload the image and get the reference to attach onto the dog
                    const path = "users/" + user.uid + "/image/" + Dog_data.Image[i].name;
                    storageRef.child(path).put(Dog_data.Image[i]).then((response) => {
                        response.ref.getDownloadURL().then((download_URL) => {
                            firebase.firestore().collection("Users").doc(user.uid).collection("Dogs").doc(id)
                                .set({ Image: download_URL }, { merge: true })
                        });
                    });
                }
            } else if (item != "ImageURL") { //if the item isnt the image URL, add it into the dog
                firebase.firestore().collection("Users").doc(user.uid).collection("Dogs").doc(id).set({
                    [item]: Dog_data[item][i]
                }, { merge: true })
            }
        }
    }
}

export async function SearchUsers(query) {

    var resultArray = [];
    var AddedUID = [];
    //Firebase queries are case sensitive, everything needs to be lowercase
    query = query.toLowerCase();

    // Query for first name, adding the user ID's to "resultarray"
    await firebase.firestore().collection("Users").where("Fname", ">=", query).where('Fname', '<=', query + '\uf8ff').get().then((results) => {
        results.forEach(item => {
            resultArray.push(item);
            AddedUID.push(item.data().UID);
        })
    }).catch()

    // Query for Last name, adding the user ID's to "resultarray"
    await firebase.firestore().collection("Users").where("Lname", ">=", query).where('Lname', '<=', query + '\uf8ff').get().then((results) => {
        results.forEach(item => {
            if (!AddedUID.includes(item.data().UID)) {
                resultArray.push(item)
            }
        })
    }).catch();

    return (resultArray);
}

//Returns the dogs associated with the user ID
export async function LoadUserDogs(UserID) {
    var resultArray = [];
    await firebase.firestore().collection("Users").doc(UserID).collection("Dogs").get().then((results) => {
        results.forEach(item => {
            resultArray.push(item)
        })
    });
    return (resultArray);
}

// Follows a user ID
export async function FollowUser(UserID) {
    var curr_UID = firebase.auth().currentUser.uid; //Grab the current users ID

    //if we're not following, add the document that says we are (this is done terribly, by checking if a document exists)
    if (!await CheckIfFollowing(UserID)) {
        await firebase.firestore().collection("Users").doc(curr_UID).collection("Following").doc(UserID).set({ Following: true, UID: UserID })
        await firebase.firestore().collection("Users").doc(UserID).collection("Followers").doc(curr_UID).set({ Follower: true, UID: curr_UID })
    }
}

//if we're following, delete the document that says we are (see above)
export async function UnFollowUser(UserID) {
    var curr_UID = firebase.auth().currentUser.uid;
    var result = CheckIfFollowing(UserID)
    if (result) {
        await firebase.firestore().collection("Users").doc(curr_UID).collection("Following").doc(UserID).delete();
        await firebase.firestore().collection("Users").doc(UserID).collection("Followers").doc(curr_UID).delete();
    }
}

//Checks if a document exists, this document has a UID as the name
export async function CheckIfFollowing(UserID) {
    var curr_UID = firebase.auth().currentUser.uid;
    var result = false;
    await firebase.firestore().collection("Users").doc(curr_UID).collection("Following").doc(UserID).get().then((snapsot) => {
        if (snapsot.exists) { //We found the file, change the bool to true, otherwise it stays false
            result = true
        }
    });
    return result;
}

//Used to create a post
export async function CreatePost(PostImage, PostText) {
    const PostUID = firebase.auth().currentUser.uid; //Get user ID
    const UserInfo = await firebase.firestore().collection("Users").doc(PostUID).get(); //get user info to add onto the post

    const timestamp = firebase.firestore.FieldValue.serverTimestamp(); //Add a timestamp so we can sort by time later
    const { id } = await firebase.firestore().collection("Posts").add({ //Adding the data to the document
        UID: PostUID,
        PostText: PostText,
        TimeStamp: timestamp,
        ImageURL: '',
        Poster_Fname: UserInfo.data().Fname,
        Poster_Lname: UserInfo.data().Lname,
        Poster_imageURL: UserInfo.data().ProfileImage,
    })

    firebase.firestore().collection("Posts").doc(id).set({ //Adding the document ID to the document, to reference later (for likes)
        postID: id,
    }, { merge: true });

    if (PostImage) { //If we have an image, upload it to user folder then append the URL
        const path = "users/" + PostUID + "/image/" + PostImage.name;
        await storageRef.child(path).put(PostImage).then((response) => {
            response.ref.getDownloadURL().then((download_URL) => {
                firebase.firestore().collection("Posts").doc(id).set({
                    ImageURL: download_URL,
                }, { merge: true });
            });
        });
    }
}

//returns posts by UID, sorted by timestamp descending. UID can be a string or an array of UID's. 
export async function LoadPosts(UIDList) {
    var resultArray = []
    if (Array.isArray(UIDList)) {
        for (var UID in UIDList) {
            await firebase.firestore().collection("Posts").where("UID", "==", UIDList[UID]).orderBy("TimeStamp", "desc").get().then((results) => {
                results.forEach(item => {
                    resultArray.push(item)
                })
            }).catch();
        }
    } else {
        await firebase.firestore().collection("Posts").where("UID", "==", UIDList).orderBy("TimeStamp", "desc").get().then((results) => {
            results.forEach(item => {
                resultArray.push(item)
            })
        }).catch();
    }
    console.log(resultArray);
    return (resultArray);
}

//Likes a post, functions like follow functions, by checking if a document exists
export async function LikePost(Post_ID) {
    var curr_UID = firebase.auth().currentUser.uid;
    var result = false;
    await firebase.firestore().collection("Posts").doc(Post_ID).collection("Likes").doc(curr_UID).get().then((snapsot) => {
        if (snapsot.exists) {
            result = true
        }
    });

    if (!result) {
        await firebase.firestore().collection("Posts").doc(Post_ID).collection("Likes").doc(curr_UID).set({ Liked: true, Liked_UID: curr_UID })
    } else {
        await firebase.firestore().collection("Posts").doc(Post_ID).collection("Likes").doc(curr_UID).delete();
    }

}

//Counts how many documents exist in the posts "likes" collection (docs deleted when posts are unliked)
export async function GetPostLikeCount(Post_ID) {
    var ResultArr = []
    await firebase.firestore().collection("Posts").doc(Post_ID).collection("Likes").get().then((snapsot) => {
        snapsot.forEach(item => {
            ResultArr.push(item)
        });
    });
    return (ResultArr.length)
}

//Checks if the current user has liked the post
export async function CheckIfLiked(Post_ID) {
    var curr_UID = firebase.auth().currentUser.uid;
    var result = false;
    await firebase.firestore().collection("Posts").doc(Post_ID).collection("Likes").doc(curr_UID).get().then((snapsot) => {
        if (snapsot.exists) {
            result = true
        }
    });
    return (result);
}

//returns an array of users the current user is following, from their "following" collection
export async function GetFollowingList() {
    var curr_UID = firebase.auth().currentUser.uid;
    var ResultArr = [];

    await firebase.firestore().collection("Users").doc(curr_UID).collection("Following").get().then((snapsot) => {
        snapsot.forEach(item => {
            ResultArr.push(item.data().UID)
        });
    });

    return (ResultArr);
}