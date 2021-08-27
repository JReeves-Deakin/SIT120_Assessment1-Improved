<template>
    <navbar/>
    <div class="Content">
    <MakePost/> <!-- component used to create posts, also appears on profile -->
    
    <!-- Repeats for each post thats currently loaded into Post_data -->
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
import { LoadPosts, GetFollowingList } from "../assets/Scripts"
import Post_template from "../components/Posts_template.vue"
import MakePost from "../components/MakePost.vue"

export default{
    components:{
        navbar,
        MakePost,
        Post_template,
    },
    created: async function(){
        await this.LoadFollowing();
        await this.LoadFollowingPosts();
    },
    methods:{
        //Loads UID of users the current user is following (into this.Following)
        LoadFollowing: async function(){
            var following = await GetFollowingList();
            following.forEach(user => {
                this.Following.push(user)
            });
        },
        //Loads posts from users the current user follows
        LoadFollowingPosts: async function(){
            var results = await LoadPosts(this.Following);

            await results.forEach(item => {
                if(!this.Post_data.Post_ID.includes(item.data().postID))
                {
                    var date = item.data().TimeStamp.toDate();
                    date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " • " + date.getHours() + ":" + date.getMinutes();
                    //A terrible way to do this, I should have passed the actual object and then loaded it in the post component :(
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
        },CapitaliseFirstLetter: function(string){ //Because firebase is case sensitive, we need to make all names lowercase (makes searching easier)
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
    },
    data() {
        return {
            // Arrays containing all the post data (filled by LoadFollowingPosts)
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
            },
            //An array of the UID's the current user follows (Filled by LoadFollowing)
            Following:[],
        }
    },
}
</script>

<style scoped>
.Content{
    margin-top: 20px;
    z-index: 0;
    position: absolute;
    top: 60px;
    left: 0;
    height: calc(100% - 60px);
    width: 100%;
}
</style>
