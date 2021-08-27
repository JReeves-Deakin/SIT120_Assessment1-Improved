<template>
    <div class="Postbox_container"> <!-- Container for the post box -->
        <img class="Post_Image" :src='ImageLocalURL' v-if="ImageLocalURL"> <!-- only appears when an image is present -->
        <div class="input_container"> 
            <!-- Textarea updates the wordcount on key up and key down -->
            <textarea class="text_input" id="postbox_input" rows="3" cols="50" placeholder="Start a woof" maxlength="120" @keydown="updateWordCount()" @keyup="updateWordCount()"></textarea>
            <span id="sendPostButton" class="material-icons" @click="SubmitPost()">send</span> 
        </div>
        <!-- Footer for upload button -->
        <div class="PostContainer_footer">
            <span class='upload_button' v-if="ImageLocalURL" @click="RemoveImage()"> Remove image </span>
            <label for="img" class='upload_button' v-if="!ImageLocalURL">Upload image</label><br>
            <input type="file" id="img" name="img" accept="image/*" style="display:none" @change="UploadImage()">
             <p style="margin: 10px 0;"> {{wordcount}} / 120 </p>
        </div>
    </div>
</template>

<script>
import {CreatePost} from "../assets/Scripts"

export default {
    data() {
        return{
            wordcount: 0,
            PostImage: null,
            ImageLocalURL: ''
        }
    },
    methods:{
        updateWordCount: function(){ //Updates the wordcount in the text area
            var value = document.getElementById("postbox_input").value;
            this.wordcount = value.length;
        },
        UploadImage: function(){ // Updates Image variables when user selects a file to upload
            this.PostImage = document.getElementById("img").files[0]
            this.ImageLocalURL = URL.createObjectURL(this.PostImage);
        },
        RemoveImage: function(){ // resets image variables (when user removes image)
            this.PostImage = null
            this.ImageLocalURL = ""
            this.PostImage = document.getElementById("img").value = "";
        },
        SubmitPost: function(){ //uses create post from scripts to save the post
            CreatePost(this.PostImage, document.getElementById("postbox_input").value);
            this.RemoveImage();
            document.getElementById("postbox_input").value = '';
            this.updateWordCount();
        }

    }
}
</script>

<style scoped>
.Postbox_container{
    width: 80%;
    max-width: 600px;
    height: auto;
    background: rgb(75, 75, 75);
    margin: 0 auto;
    
    display: flex;
    align-items: center;
    flex-direction: column;

    border-radius: 24px;
}

#postbox_input{
    margin: 0;
    text-align: center;
    padding: 2px 30px;
    width: calc(100% - 64px);
    resize: none;
    height: auto;
}

.input_container{
    padding: 0;
    display: flex;
    align-items: center;
    height: auto;
    width: 100%;
    margin: 0;
}

#sendPostButton{
    z-index: 1;
    width: 20px;
    height: 24px;
    margin-left: -32px;
    display: inline-block;
    cursor: pointer;
    margin-right: 0;
}

.upload_button{
    transition: filter 0.3s;
    background: rgb(163, 94, 195);
    padding: 2px 4px;
    border-radius: 24px;
    height: 30px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}

.upload_button:hover{
    filter: brightness(130%);
    cursor: pointer;
}

.PostContainer_footer{
    width: 80%;
    height: fit-content;

    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
}

.Post_Image{
    width: auto;
    height: 200px;
    margin: 10px 0;
    border-radius: 6px;
    border: solid white 2px;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
