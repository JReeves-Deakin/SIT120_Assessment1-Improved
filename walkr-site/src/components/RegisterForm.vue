<template>
<div class="Register_container">
        <div class="whiteout" @click="CloseFunc()"></div>

        <transition name=slide>
            <div id="BasicRegisterForm" class="RegisterForm" v-if="!ShowOwnrform">

                <div class="formHeader">
                    <h2> Create account </h2>
                    <div class="profile_container">
                        <img  v-bind:src="Account_Data.ImageURL" @click="SetRandomImage()">
                        <input type="file" id="actual-btn" hidden @change='LoadProfileImage'>
                        <label for="actual-btn" id="upload_button">+</label>
                    </div>
                </div>
                
                <div class="form_content">

                    <div class="doubleItem">
                        <input type="text" class="text_input" name="Register_Fname" placeholder="First name" style="width: 40%" v-model="Account_Data.Fname">
                        <input type="text" class="text_input" name="Register_Lname" placeholder="Surname" style="width: 40%" v-model="Account_Data.Lname">
                    </div>

                    <input type="text" class="text_input" name="Register_Email" placeholder="Email address" v-model="Account_Data.Email">
                    <input type="password" class="text_input" name="Register_Password" placeholder="Password" v-model="Account_Data.Password">
                    <input type="password" class="text_input" name="Register_ConfPassword" placeholder="Confirm Password" v-model="ConfirmPassword">

                    <div class="doubleItem">
                        <input type="number" class="text_input" name="Register_Postcode" placeholder="Postcode" style="width: 40%" v-model="Account_Data.Postcode">
                        <input type="date" class="text_input" name="Register_DOB" style="width: 40%" v-model="Account_Data.DOB">
                    </div>

                    Account type
                    <div class="doubleItem" style="justify-content: space-evenly">
                        <div>
                            <input type="radio" class="radio" name="Account_type" value="Walkr" checked required v-model="Account_Data.AccountType"> 
                            <label for = "Account_type">Walkr</label>
                        </div>
                        <div>
                            <input type="radio" class="radio" name="Account_type" value="Ownr" required  v-model="Account_Data.AccountType"> 
                            <label for = "Account_type">Ownr</label>
                        </div>
                    </div>

                    <input type="button" value="Create account" class="reigster_btn" id="btn" v-if="Account_Data.AccountType=='Walkr'" @click="CreateWalkrAccount">
                    <input type="button" value="Continue" class="reigster_btn" id="btn" v-else @click="ProgressForm">
                </div>

                

            </div>
        </transition>

        <!-- A cool transition, to slide in -->
        <transition name=slide>
            <!-- form toggles (also adding props) -->
            <RegisterOwnrForm :CloseForm="ToggleOwnrForm" v-if="ShowOwnrform" @DogAdded="AddDog" @FormDone="Generate_OwnrAccount">
                <slot> 
                    <div class="dog_holder" v-if="Dog_Data.Name.length == 0">
                        No dogs registered.
                    </div>
                    <!-- Iterates through dog information to display all the dogs -->
                    <div class="dog_holder" v-for="(item, index) in Dog_Data.Name" :key='item'>
                        <img :src="Dog_Data.ImageURL[index]"/>
                        <div class="dog_infoContainer">
                            <span style="margin:0; font-weight:600;"> {{ Dog_Data.Name[index] }} </span> - {{ Dog_Data.DOB[index] }} <br> {{ Dog_Data.Breed[index] }}<br>
                            {{ Dog_Data.Bio[index] }}
                        </div>
                    </div>

                </slot>
            </RegisterOwnrForm>
        </transition>
</div>
</template>

<script>
import RegisterOwnrForm from './RegisterForm_Ownr.vue'
import { Create_Walkr, Create_Ownr } from "../assets/Scripts"

export default{
    created: function(){
        this.SetRandomImage();
    },
    components:{
        RegisterOwnrForm //The that allows dogs to be added onto the account
    },
    props:{
        CloseFunc: Function,
    },
    methods:{
        ToggleOwnrForm: function(value){
            this.ShowOwnrform = value;
        },
        LoadProfileImage: function(event){
            console.log(event.target.files);
            this.Account_Data.ImageURL = URL.createObjectURL(event.target.files[0])
            this.Account_Data.Image = event.target.files[0];
        },
        AddDog: function(DogData){
            for(const item in DogData){
                this.Dog_Data[item].push(DogData[item]);
            }
        },
        ProgressForm: function(){
            var count = 0;
            for(const item in this.Account_Data){
                if(this.Account_Data[item] == ''){
                    count = count - 1;
                }
            }
            if(count != 0){
                alert("Please complete registration form before continuing")
            }
            else{
                if(this.ConfirmPassword == this.Account_Data.Password)
                {
                    this.ToggleOwnrForm(true);
                }
                else{
                    alert("Passwords do not match!")
                }
            }
        },
        CreateWalkrAccount: function(){
            var count = 0;
            for(const item in this.Account_Data){
                if(this.Account_Data[item] == ''){
                    count = count - 1;
                }
            }
            if(count != 0){
                alert("Please complete registration form")
            }
            else{
                if(this.ConfirmPassword == this.Account_Data.Password)
                {
                    /* Create account here! */
                    Create_Walkr(this.Account_Data);
                }
                else{
                    alert("Passwords do not match!")
                }
            }
        },
        Generate_OwnrAccount: function(){
            if(this.Dog_Data.Name.length > 0){
                Create_Ownr(this.Account_Data, this.Dog_Data)
            }
            else{
                alert("Please add a dog")
            }
        },
        SetRandomImage: function(){
            var rand = Math.random()*(8-0)
            rand = Math.floor(rand);
            this.Account_Data.ImageURL = this.DefaultImageURLs[rand];
            this.current_randImage = rand;
        },
    },
    data() {
        return{
            ShowOwnrform: false, //Used to toggle the ownr form
            ConfirmPassword: "", //Used to confirm password is correct before moving on
            // Account data
            Account_Data:{
                Image: null,
                ImageURL: "https://image.flaticon.com/icons/png/512/3011/3011270.png",
                AccountType: "Walkr",
                Fname: "",
                Lname: "",
                Email: "",
                Password: "",
                Postcode: "",
                DOB: "",
            },
            // Data for the dogs
            Dog_Data:{
                Image: [],
                ImageURL: [],
                Name: [],
                DOB: [],
                Bio: [],
                Breed: [],
            },
            // Default user images
            DefaultImageURLs:{
                0:  'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2Fpeople%2Fman_1.png?alt=media&token=0a940e14-d064-4b3a-ae80-b478fea8189d',
                1:  'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2Fpeople%2Fman_2.png?alt=media&token=3ca13d04-8c01-4ac4-b145-eeeab8142f08',
                2:  'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2Fpeople%2Fman_3.png?alt=media&token=b360e343-6028-41c0-a41b-9f8468fc7714',
                3:  'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2Fpeople%2Fman_4.png?alt=media&token=c583542c-e432-4765-aee6-097ec70069bc',
                4:  'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2Fpeople%2Fman_5.png?alt=media&token=edd43088-331b-4251-9c8d-a28a8c567432',
                5:  'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2Fpeople%2Fwoman_1.png?alt=media&token=649db363-0b0e-4466-90ac-53d50b68dc73',
                6:  'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2Fpeople%2Fwoman_2.png?alt=media&token=6f413278-0d75-443b-bf6e-4a8e312d46af',
                7:  'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2Fpeople%2Fwoman_3.png?alt=media&token=1f415cce-2a2a-485e-adc3-7e44e2643c8b',
                8:  'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2Fpeople%2Fwoman_4.png?alt=media&token=3ec3ee66-c1cb-4f1a-b58d-39f7df6f2316',
                9:  'https://firebasestorage.googleapis.com/v0/b/test-8a575.appspot.com/o/Default_Images%2Fpeople%2Fwoman_5.png?alt=media&token=599c6379-2bf4-499b-aa0b-14c8ccd2e3c2',
            },

        }
    },
}
</script>

<style>

.Register_container{
    position: absolute;
    width: 100%;
    height: 100%; 
    left: 0;
    top: 0;

    display: flex;
    justify-content: center;
    align-items: center;
    
    z-index: 12;
}

.whiteout{
    position: absolute;
    background: rgb(255, 255, 255, 0.4);
    width: 100%;
    height: 100%;
}

.RegisterForm{
    z-index: 5;
    position: absolute;
    z-index: 2;
    width: 350px;
    height: 600px;
    background: white;
    border-radius: 6px;
    border: solid 3px black;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.formHeader{
    display: flex;
    margin-bottom: 20px;
    width: 100%;
}

.formHeader h2{
    width: 60%;
    height: 20%;
    text-align: center;
}

.profile_container{
    transform: translate(20px,-40px);
    display: flex;
}

.profile_container img{
    position: absolute;
    width: 120px;
    height: 120px;
    border: solid 3px black;
    border-radius: 50%;
    background: black;
}

#upload_button{
    position: absolute;
    transform: translate(11px,95px);
    font-size: 1.5em;
    border-radius: 24px;
    border-style: none;
    width: 32px;
    height: 32px;
    background: rgb(0, 0, 0);
    color: white;
    text-align: center;
    line-height: 34px;
    font-weight: 400;
}

#RandomImage{
    position: absolute;
    transform: translate(80px,95px);
    font-size: 1.2em;
    border-radius: 24px;
    border-style: none;
    width: 32px;
    height: 32px;
    background: rgb(0, 0, 0);
    color: white;
    text-align: center;
    line-height: 34px;
    font-weight: 400;
    text-align: center;
}

#upload_button:hover{
    background: rgb(56, 56, 56);
    cursor: pointer;
}

#RandomImage:hover{
    background: rgb(56, 56, 56);
    cursor: pointer;
}

.form_content{
    height: 83%;
    width: 98%;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
    align-items: center;
}

.doubleItem{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.dog_holder{
    width: 96%;
    margin: 2% auto;
    height: 74px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.5);
    font-size: 1.3em;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    box-shadow: 5px 5px 6px -4px #000000;
    
}

.dog_holder img{
    width: 60px;
    height: 60px;
}

.dog_infoContainer{
    display: block;
    width: 76%;
    display: flex;
    flex-direction: column;
    font-size: .8em;
    font-weight: 300;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
    overflow: hidden
}

.slide-enter-active {
  transition: all 1s ease;
}
.slide-leave-active {
  transition: all 1s ease;
}

.slide-enter-from{
    transform: translateY(100vh);
}

.slide-leave-to{
    transform: translateY(-100vh);
}

@media screen and (max-width: 375px) {
    .RegisterForm{
        width: 310px;
        height: 500px;
    }

    .formHeader{
        height: 12%;
        font-size: .9em;
    }

    .profile_container{
        transform: translate(20px,-30px);
    }

    .profile_container img{
        width: 100px;
        height: 100px;
    }

    #upload_button{
        position: absolute;
        transform: translate(10px,80px);
        width: 28px;
        height: 28px;
    }

  .text_input{
      font-size: 1.2em;
      padding: 1px 5px;
  }
  



}
</style>
