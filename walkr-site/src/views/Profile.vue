<template>
    <navbar @LoadProfile="LoadNewProfile"/>
    <div class="Content">
        <div class="Profile_header">

            <!-- Profile info -->
            <img class="profile_image" :src="Account_Information.Profile_Image" @click="LoadPosts()">
            <h1 class="namePlate"> {{ Account_Information.Fname}} {{ Account_Information.Lname}} </h1>
            <h3 class="namePlate"> {{ Account_Information.AccountType}} </h3>
            <h4 class="namePlate"> Followers {{ Account_Information.FollowerCount }} | Following {{ Account_Information.FollowingCount }} </h4>

            <!-- Buttons -->
            <h4 class="button" v-if="!ViewingOwnPage && !following" @click="Follow"> 
                <span class="material-icons" >person_add_alt_1</span>
                Follow 
            </h4>

            <h4 class="button" v-if="!ViewingOwnPage && following" @click="UnFollow"> 
                <span class="material-icons">person_remove</span>
                Unfollow 
            </h4>

            <h4 class="button" v-if="!ViewingOwnPage && Account_Information.AccountType=='Walkr'"> 
                <span class="material-icons">event</span>
                Request walk 
            </h4>

            <h4 class="button" v-if="ViewingOwnPage" @click="$router.push('/Editprofile')"> 
                <span class="material-icons">edit</span>
                Edit account 
            </h4>

            <!-- Dog Gallery -->
            <h4 class="namePlate" style="margin: 0 auto 0 0" v-if="Account_dogs.Name[0]"> {{ Account_Information.Fname}}'s dogs </h4>
            <div class="GalleryContainer" v-if="Account_dogs.Name[0]">
                <div class="Dog_Container" v-for="(item, index) in Account_dogs.Name" :key="index">
                    <img :src="Account_dogs.ImageURL[index]">
                    <h3>{{ Account_dogs.Name[index] }}</h3>
                    {{ Account_dogs.Breed[index] }}
                </div>
            </div>
        </div>

        <!-- Section to create posts -->
        <MakePost v-if="ViewingOwnPage"/>

        <hr>

        <!-- Loads only the user posts -->
        <Post_template v-for="(item, index) in Post_data.Content" :key="item"
        :Content="Post_data.Content[index]"
        :Poster_imageURL="Post_data.Poster_ImageURL[index]"
        :Poster_Fname="Post_data.Fname[index]"
        :Poster_Lname="Post_data.Lname[index]"
        :Liked_Comment="Post_data.LikedComment[index]"
        :ImageURL="Post_data.ImageURL[index]"
        :post_Date="Post_data.post_Date[index]"
        :Post_ID="Post_data.Post_ID[index]"
        :Poster_UID="Post_data.Poster_UID[index]"
        />
    </div>
</template>

<script>
import navbar from "../components/NavBar.vue"
import firebase from "firebase/app";
import {FollowUser, CheckIfFollowing, UnFollowUser, LoadUserDogs, LoadPosts} from "../assets/Scripts"
import MakePost from "../components/MakePost.vue"
import Post_template from "../components/Posts_template.vue"

export default{
    data(){
        return{
            ViewingOwnPage: false,
            following: false,
            Current_UID: '',
            Page_UID: '',
            Account_Information:{
                Fname: "",
                Lname: "",
                AccountType: "",
                FollowerCount: 0,
                FollowingCount: 0,
                Profile_Image: "",
                Images: [],
            },
            Account_dogs:{
                Name: [],
                ImageURL: [],
                Breed: [],
            },
            Post_data:{
                Content: [],
                Poster_ImageURL: [],
                ImageURL: [],
                Fname: [],
                Lname: [],
                LikedComment: [],
                post_Date: [],
                Post_ID: [],
                Poster_UID: [],
            }
        }
    },
    components:{
        navbar,
        MakePost,
        Post_template,
    },
    props:{
        Profile_UID: String,
    },
    methods:{
        // Checks if the viewer owns the page
        CheckIfPageOwner: async function(UserID){
            this.Current_UID = await firebase.auth().currentUser.uid;
            if(this.Current_UID == UserID){
                this.ViewingOwnPage = true;
            }
            else{
                this.ViewingOwnPage = false;
            }
            
            console.log('Own account:' + this.ViewingOwnPage)
        },
        // Gets the user info of the current page
        GetUserInfo: async function(UserID){
            var user_data = await firebase.firestore().collection("Users").doc(UserID).get();
            
            this.Account_Information.Fname = this.CapitaliseFirstLetter(user_data.data().Fname)
            this.Account_Information.Lname = this.CapitaliseFirstLetter(user_data.data().Lname)
            this.Account_Information.Profile_Image = user_data.data().ProfileImage;
            this.Account_Information.AccountType = user_data.data().AccountType;
            // Set the follower counts
            await firebase.firestore().collection("Users").doc(UserID).collection("Following").get().then((snapshot) => {
                this.Account_Information.FollowingCount = snapshot.size;
            });

            await firebase.firestore().collection("Users").doc(UserID).collection("Followers").get().then((snapshot) => {
                 this.Account_Information.FollowerCount = snapshot.size;
            });
            this.Page_UID = UserID;
        },
        CapitaliseFirstLetter: function(string){
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        Follow: async function(){ //Follows the profile owner 
            await FollowUser(this.Page_UID);
            this.following = await CheckIfFollowing(this.Page_UID);

            await firebase.firestore().collection("Users").doc(this.Page_UID).collection("Followers").get().then((snapshot) => {
                 this.Account_Information.FollowerCount = snapshot.size;
            });
        },
        UnFollow: async function(){ //Unfollows the profile owner
            await UnFollowUser(this.Page_UID);
            this.following = await CheckIfFollowing(this.Page_UID);
            await firebase.firestore().collection("Users").doc(this.Page_UID).collection("Followers").get().then((snapshot) => {
                 this.Account_Information.FollowerCount = snapshot.size;
            });
        }, //Used to load the users dogs
        LoadDogs: async function(){
            var result = await LoadUserDogs(this.Page_UID);

            for(var element in this.Account_dogs){
                this.Account_dogs[element] = []
            }

            for(var item in result){
                this.Account_dogs.Name.push(result[item].data().Name)
                this.Account_dogs.ImageURL.push(result[item].data().Image)
                this.Account_dogs.Breed.push(result[item].data().Breed)
            }
        }, //Called when loading a new profile
        LoadNewProfile: async function(UID)
        {
            this.UnloadPosts();
            await this.CheckIfPageOwner(UID);
            await this.GetUserInfo(UID);
            if(!this.ViewingOwnPage){
                this.following = await CheckIfFollowing(UID);
            }
            await this.LoadDogs();
            await this.LoadPosts();
            this.$forceUpdate();
        }, //Used to load the users posts (same as dashboard, but with only one UID)
        LoadPosts: async function(){
            var results = await LoadPosts(this.Page_UID);

            await results.forEach(item => {
                if(!this.Post_data.Post_ID.includes(item.data().postID))
                {
                    var date = item.data().TimeStamp.toDate();
                    date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " • " + date.getHours() + ":" + date.getMinutes();

                    this.Post_data.post_Date.push(date)
                    this.Post_data.Content.push(item.data().PostText)
                    this.Post_data.Poster_ImageURL.push(item.data().Poster_imageURL)
                    this.Post_data.ImageURL.push(item.data().ImageURL)
                    this.Post_data.Fname.push(this.CapitaliseFirstLetter(item.data().Poster_Fname))
                    this.Post_data.Lname.push(this.CapitaliseFirstLetter(item.data().Poster_Lname))
                    this.Post_data.Post_ID.push(item.data().postID)
                    this.Post_data.Poster_UID.push(item.data().UID)
                }
                
            });
        }, //Used to clear the post data
        UnloadPosts: function(){
            for(var item in this.Post_data){
                this.Post_data[item] = []
            }
        }
    },
    created: async function(){ //Loads the profile when page is loaded
        this.LoadNewProfile(this.Profile_UID)
    },
}
</script>

<style scoped>
.Content{
    z-index: 0;
    position: absolute;
    top: 60px;
    left: 0;
    height: calc(100% - 60px);
    width: 100%;
}

.Profile_header{
    min-height: 200px;
    height: fit-content;
    width: calc(100vw - 40px);
    margin: 2% auto;
    min-width: 200px;
    min-height: 150px;
    border-radius: 6px;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.profile_image{
    width: 50%;
    max-width: 240px;
    height: auto;
    margin: 0 auto;
}

.namePlate{
    margin: 0 auto;
}

.double_item{
    display: flex;
    justify-content: space-evenly;
}

.button{
    display: flex;
    align-items: center;
    justify-content: center;
    background: pink;
    margin: 5px 0;
    padding: 2px 8px;
    border-radius: 24px;
    font-size: 1.2em;
}

.button span{
    margin-right: 3px;
}

.button:hover{
    filter: brightness(110%);
    cursor: pointer;
}

.GalleryContainer{
    background-color: gray;
    height: 26vh;
    width: 100%;
    border-radius: 12px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    max-height: 200px;
}

.Dog_Container{
    width: auto;
    max-width: 200px;
    width: 25vw;
    max-width: 140px;
    text-align: center;
    height: calc(100% - 10px);
    background-color: rgb(51, 50, 50);
    margin-left: 5px;
    border: solid 2px white;
    border-radius: 12px;
    overflow-y: auto;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    font-size: 1em;
}

.Dog_Container h3{
    font-size: 1em;
    margin: 0;
    padding: 0;
}

.Dog_Container img{
    width: auto;
    height: 100px;
    border-radius: 50%;
    margin: 5px;
}

</style>
