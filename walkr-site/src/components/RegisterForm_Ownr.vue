<template>
    <div id="BasicRegisterForm" class="RegisterForm">

        <div class="formHeader">
            <h2> Register dogs </h2>

                <div class="profile_container">
                    <img  :src="formData.ImageURL" @click="SetRandomImage()">
                    <input type="file" id="actual-btn" hidden @change='LoadImage'>
                    <label for="actual-btn" id="upload_button">+</label>
                </div>
        </div>

        <div class="form_content" style="justify-content:space-evenly;">

            <input type="text" class="text_input" name="Dog_Name" placeholder="Name" v-model="formData.Name">

            <div class="doubleItem">
                <input type="text" class="text_input" name="Dog_Breed" placeholder="Breed" style="width: 40%" v-model="formData.Breed">
                <input type="date" class="text_input" name="Dog_DOB" style="width: 40%" v-model="formData.DOB">
            </div>

            <textarea name="dog_bio" rows="3" cols="50" class="text_input" style="resize:none" maxlength="75" placeholder="Short bio" v-model="formData.Bio"></textarea>
            <input type="button" value="Add dog" class="reigster_btn" id="btn" style="height: 32px" @click="EmitData()">

            <div class="dog_window">
                <slot>
                </slot>
            </div>
            
            <div class="doubleItem" style="width:94%; justify-content: space-between;">
                <input type="button" value="Create account" class="reigster_btn" id="btn" @click="EmitDone()">
                <input type="button" value="Back" class="reigster_btn" id="btn" style="width: 30%; background: red;" @click="CloseForm()">
            </div>

        </div>

    </div>
</template>

<script>
export default {
    created: function(){
        this.SetRandomImage(); //Sets a random dog image, from default images
    },
    props:{
        CloseForm: Function, //Function used to close the register forms
    },
    data(){
        return{
            formData:{
                Image: null,
                ImageURL: "https://img-premium.flaticon.com/png/512/3093/premium/3093488.png?token=exp=1629644300~hmac=cdd64c154269965ed529c8ab1fafeb0a",
                Name: "",
                DOB: "",
                Bio: "",
                Breed: "",
            },
            //Default dog images
            DefaultImageURLs:{
                0:'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2FDog%2Fdog_1.png?alt=media&token=214fee45-391d-4cce-9869-ebdba0054642',
                1:'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2FDog%2Fdog_2.png?alt=media&token=d656d868-c4b1-4ef0-b995-736f6943cb99',
                2:'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2FDog%2Fdog_3.png?alt=media&token=2f0bf775-b0d4-4b59-9e54-cc47e04d6e85',
                3:'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2FDog%2Fdog_4.png?alt=media&token=a68e9331-4354-4e7a-8bba-bfcf60ade32f',
                4:'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2FDog%2Fdog_5.png?alt=media&token=6a5e2410-ee8b-4938-95d4-52c009353294',
                5:'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2FDog%2Fdog_6.png?alt=media&token=8e760317-271e-4762-ade2-f1676f143fa6',
                6:'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2FDog%2Fdog_7.png?alt=media&token=6d12f4c2-5ca9-404d-9a10-9e7486c8e0b2',
                7:'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2FDog%2Fdog_8.png?alt=media&token=7534e663-3759-4332-ad70-396b4c675916',
            },
            DefaultImage: "https://img-premium.flaticon.com/png/512/3093/premium/3093488.png?token=exp=1629644300~hmac=cdd64c154269965ed529c8ab1fafeb0a",
        }
    },
    methods:{
        LoadImage: function(event){ //Loads the user image into data
            this.formData.ImageURL = URL.createObjectURL(event.target.files[0])
            this.formData.Image = event.target.files[0];
        },
        EmitData: function(){ //Emits the dog data for register form to catch
            var count = 0;
            for(const item in this.formData){
                if(this.formData[item] == ''){
                    count = count - 1;
                }
            }
            if(count != 0){
                alert("Please complete form before adding your dog")
            }
            else{
                this.$emit('DogAdded', this.formData)
                for(const item in this.formData){
                    this.formData[item] = ''
                }
                this.SetRandomImage();
                this.formData.Image = null;
            }
        },
        EmitDone: function(){ //Emits that form is complete
            this.$emit('FormDone')
        },
        SetRandomImage: function(){
            var rand = Math.random()*(6-0)
            rand = Math.floor(rand);
            this.formData.ImageURL = this.DefaultImageURLs[rand];
        },
    }
}
</script>

<style scoped>
.dog_window{
    height: 60%;
    width: 95%;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    margin: 3% 0;


    overflow-y: auto;

    display: flex;
    flex-direction: column-reverse;
    border: solid 2px gray;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #d6d6d6;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

</style>
