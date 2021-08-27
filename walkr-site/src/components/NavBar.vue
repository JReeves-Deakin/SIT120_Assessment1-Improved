<template> <!-- Used on most pages -->
    <div class="navbar_container">
        
        <div class="navbar_header">
            <h2> Walkr </h2>
        </div>

        <div class="navbar_itemsContainer">

            <div class="navbar_item" id="big_screeIcon" @click="$router.push('/Dashboard')">
                <span class="material-icons">article</span>
                Dash
            </div>

            <div class="navbar_item" id="big_screeIcon" @click="OpenProfile()">
                <span class="material-icons">account_circle</span>
                Profile
            </div>

            <div class="navbar_item" id="big_screeIcon" @click="$router.push('/Inbox')">
                <span class="material-icons">mail</span>
                Inbox
            </div>

            <!-- Search bar height expands to fit search results -->
            <div class="navbar_item" id="searchBar">

                <div style="display: flex;">
                    <span class="material-icons">search</span>
                    <input type="text" class="Search_Input" placeholder="Search" id="search_input" @keyup="SearchFunction()" autocomplete="off">
                </div>

                <!-- Search results only displayed if they're availiable -->
                <hr v-if="this.SearchResults.Fname[0]">
                <div class="Search_results">
                    <!-- Index used to reference all arrays -->
                    <div class="Search_ResultContainer" v-for="(item, index) in SearchResults.Fname" :key="item" @click="OpenProfile(SearchResults.UID[index])">
                        <img :src="SearchResults.ImageURL[index]" style="flex: 1">
                        <div style="flex: 3">
                            {{ SearchResults.Fname[index] }} 
                            {{ SearchResults.Lname[index] }}<br>
                            {{ SearchResults.Account_Type[index] }}
                        </div>
                    </div>
                </div>

            </div>

             <div class="navbar_item" id="navbar_menu">

                 <div style="display: flex; align-items: center;">
                    <span class="material-icons">menu</span>
                    Other
                 </div>
                 <hr>
                <div class="navbar_menu_panel">

                    <span class="small_screen_menu">
                       
                        <div class="menu_item" @click="$router.push('/Dashboard')">
                            <span class="material-icons">article</span>
                            Dash
                        </div>

                        <div class="menu_item" @click="OpenProfile()">
                            <span class="material-icons">account_circle</span>
                            Profile
                        </div>

                        <div class="menu_item" @click="$router.push('/Inbox')">
                            <span class="material-icons">mail</span>
                            Inbox
                        </div>

                        <hr>
                    </span>

                    <div class="menu_item" @click="logout()">
                        <span class="material-icons">logout</span>
                        Logout 
                    </div>

                    <div class="menu_item"  @click="$router.push('/About')">
                        <span class="material-icons">help_outline</span>
                        About 
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import firebase from "firebase/app";
import {SearchUsers} from "../assets/Scripts";
import router from '../router'

export default {
    component:{
        SearchUsers,
    },
    data(){
        return{
            FlipMenuIcon: false,
            MenuBarOpenStyle:{
                background: 'white',
                color: 'black',
                cursor: 'pointer',
                width: '110px',
            },
            SearchResults:{
                Fname: [],
                Lname: [],
                Account_Type: [],
                ImageURL: [],
                UID: [],
            },
        }
    },
    methods:{
        logout: function(){ //Logs out user
            firebase.auth().signOut();
        },
        SearchFunction: async function(){
            var query = document.getElementById("search_input").value; //Get the value from text area
            if(query != '') //If theres actually something in the text area
            {
                const results = await SearchUsers(query);
                this.ClearSearchResults()

                    // A horrible, horrible way to counter the latency from firebase (checks search is the same on return)
                if(document.getElementById("search_input").value == query){
                    results.forEach(element => {
                        this.SearchResults.Fname.push(this.CapitaliseFirstLetter(element.data().Fname))
                        this.SearchResults.Lname.push(this.CapitaliseFirstLetter(element.data().Lname))
                        this.SearchResults.Account_Type.push(element.data().AccountType)
                        this.SearchResults.ImageURL.push(element.data().ProfileImage)
                        this.SearchResults.UID.push(element.data().UID)
                        console.log(element.data());
                    });
                }
            }
            else{ //Otherwise clear everything
                this.ClearSearchResults()
            }
        },
        ClearSearchResults: function(){ //Clears the seatch results
            for(var item in this.SearchResults){
                this.SearchResults[item] = []
            }
        },
        CapitaliseFirstLetter: function(string){ //Sets first letter to capital
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        OpenProfile: function(UID){ //opens a user profile, if we're already on profile page, emit 'loadprofile' which profile page will use to load the new content
            if(UID == null) {
                UID = firebase.auth().currentUser.uid;
            }
            console.log(UID);
            router.push({ name: 'Profile', params: { Profile_UID: UID }, query: { User: UID } })

            if(this.$route.name == "Profile"){
                this.$emit('LoadProfile', UID)
            }
        }
    },
}
</script>


.<style scoped>
.navbar_container{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 60px;
    background: rgb(214, 204, 231);
    display: flex;
    border-bottom: solid 3px black;
    justify-content: space-between;
}

.navbar_header{
    display: flex;
    align-items: center;
    margin-left: 20px;
    font-size: 2em;
}

.navbar_header h2{
    z-index: -1;
    position: absolute
}

.navbar_itemsContainer{
    display: flex;
}

.navbar_item{
    display: flex;
    margin-right: 20px;
    margin-top: 10px;
    border-radius: 24px;
    background: white;
    padding: 8px;
    width: 24px;
    height: 24px;
    overflow: hidden;
    transition: all 0.4s;
    
}

.navbar_item span{
    margin-right: 10px;
}

.navbar_item:hover{
    height: fit-content;
    width: 100px;
    transform: scaleX(100px);
    color: white;
    background: rgb(0, 0, 0);
}

#searchBar:hover{
    height: fit-content;
    width: 230px;
}

#searchBar{
    flex-direction: column;
}

#navbar_menu:hover{
    height: 120px;
    transform: scaleY(100px);
}

#navbar_menu{
    flex-direction: column;
}

.navbar_menu_panel{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

}

.menu_item{
    width: 100%;
    display: flex;
    align-items: center;
    margin: 5px;
    border-radius: 24px;
    padding: 2px;
    transition: background 0.3s;
}

.menu_item span{
    margin-right: 10px;
}

.menu_item:hover{
    background: rgb(119, 119, 119);
    cursor: pointer;
}

.small_screen_menu{
    display: none;
}

.Search_Input{
    background: inherit;
    border: none;
    color: inherit;
    outline: none;
    font-size: inherit;
    width: auto;
    overflow: hidden;
    height: auto;
}

.Search_ResultContainer{
    height: 50px;
    overflow: hidden;
    display: flex;
    border: solid 2px white;
    background: gray;
    border-radius: 6px;
    padding: 2px;
    align-items: center;
    text-align: center;
    margin: 5px;
}

.Search_ResultContainer img{
    height: 50px;
    width: 50px;
    border-radius: 24px;
    border: solid 2px rgba(255, 255, 255, 0.534);
}

.Search_ResultContainer:hover{
    background: rgb(189, 189, 189);
    cursor: pointer;
}

::placeholder { /* Sets placeholder font*/
  color: inherit;
  font-size: inherit;
}

/* Smaller screens, smaller nav bar */
@media only screen and (max-width: 600px) {
  .small_screen_menu{
    display: block;
    }

    #big_screeIcon{
        display: none;
    }

    #navbar_menu:hover{
    height: 240px;
    }

    .navbar_item{
        margin-right: 10px;
    } 
}

@media only screen and (max-width: 660px) {
    .navbar_item{
        margin-right: 10px;
    } 
}

@media only screen and (max-width: 400px) {
 .navbar_header{
        font-size: 1.2em;
    }

    .navbar_item{
        margin-right: 10px;
    }   
}

@media only screen and (max-width: 360px) {
 .navbar_header{
    font-size: 1.2em;
    margin-left: 5px;
    }

}

</style>