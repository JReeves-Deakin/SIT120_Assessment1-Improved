<template> <!-- Template used for all posts -->
    <div class="post_container">

        <div class="post_header">
            <!-- Allow profile image to link to profiles, only when on dash -->
            <img id="profileLink" :src="Poster_imageURL" @click="OpenProfile()" v-if="this.$route.path == '/Dashboard'"/>
            <img :src="Poster_imageURL" v-else/> 
            <div class="nameDate">
                <h2> {{Poster_Fname}} {{ Poster_Lname }}</h2>
                <h5> {{ post_Date }} </h5>
            </div>
        </div>
        <img id="post_image" :src='ImageURL' v-if="ImageURL" />

        <div class="content">
            <h4> {{Content}} </h4>
        </div>
        
        <div class="footer">
            <div class="footer_buttons">

                <div class="Button" v-if="!Liked_Comment" @click="LikePost()">
                    <span class="material-icons" >thumb_up_off_alt</span>
                    <h4> Like </h4>
                </div>

                <div class="Button" v-else @click="LikePost()">
                    <span class="material-icons">thumb_up</span>
                    <h4> Unlike </h4>
                </div>

                <div class="post_stats">
                    <h4> {{ Post_likes }} Likes </h4>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { LikePost, GetPostLikeCount, CheckIfLiked } from "../assets/Scripts"
import router from '../router'

export default {
    created(){
        this.GetLikeCount();
        this.CheckLiked();
    },
    props:{
        Content: String,
        Poster_imageURL: String,
        ImageURL: String,
        Poster_Fname: String,
        Poster_Lname: String,
        post_Date: String,
        Post_ID: String,
        Poster_UID: String,
    },
    data() {
        return{
            Post_likes: 0,
            Liked_Comment: false,
        }
    },
    methods: {
        LikePost: async function(){
            await LikePost(this.Post_ID);
            this.GetLikeCount();
            this.CheckLiked();
        },
        GetLikeCount: async function(){
            this.Post_likes = await GetPostLikeCount(this.Post_ID);
        },
        CheckLiked: async function(){
            this.Liked_Comment = await CheckIfLiked(this.Post_ID)
        },
        OpenProfile: function(){ //used to reload profile if already on profile view (see navbar function)
            var UID = this.Poster_UID;
            console.log(UID);
            router.push({ name: 'Profile', params: { Profile_UID: UID }, query: { User: UID } })

            if(this.$route.name == "Profile"){
                this.$emit('LoadProfile', UID)
            }
        }
    },
    
}
</script>


<style scoped>
.post_container{
    margin: 0 auto;
    width: 80vw;
    height: auto; /* Set this to auto */
    max-width: 600px;
    background: rgba(163, 163, 163, 0.37);
    margin-top: 10px;
    border-radius: 6px;
    padding-top: 5px;
    padding-bottom: 5px;
}

.post_container img{
    width: 75px;
    height: 75px;
    margin: 0 5px auto 5px;
    border-radius: 50%;
    border: solid rgb(0, 0, 0) 2px;
    background: rgb(0, 0, 0);
}

#profileLink:hover{
    filter: brightness(110%);
    cursor: pointer;
}

.post_header{
    display: flex;
    align-items: center;
    width: 100%;
}

.post_header h2{
    margin: 0
}

.post_header h5{
    margin: 0
}

.content{
    width: 90%;
    height: auto;
    background: rgb(255, 255, 255);
    margin: 5px auto;
    padding: 5px;
    border: solid black 2px;
    border-radius: 12px;
}

.content h4{
    margin: 0;
}

.Button{
    background: rgb(163, 94, 195);
    width: 110px;
    padding: 0 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px;
    border-radius: 6px;
    transition: filter 0.3s;
}

.Button h4{
    margin: 0;
}

.Button span{
    margin: 0 4px;
}

.Button:hover{
    cursor: pointer;
    filter: brightness(120%)
}

.footer_buttons{
    display: flex;
    width: 100%;
    justify-content: space-evenly;
}

.post_stats{
    display: flex;
    justify-content: center;
    align-items: center;
}

.post_stats h4{
    margin: 0;
}

#post_image{
    display: block;
    height: auto;
    width: 90%;
    border-radius: 6px;
    margin: 0 auto;
    margin-top: 3px;
}

</style>

