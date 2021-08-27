<template> <!-- Basic login form, passes details to firebase to login the user  -->
    <div class="container">
        <transition name="fade">
            <RegisterForm :CloseFunc="ToggleRegister" v-if="Show_Register"/>
        </transition>

        <div class="header_area">
            <h1> Walkr. </h1>
            Created by Jordan Reeves for Assessment 1, SIT120

        </div>

        <form class="form_area">
            <input type="text" class="text_input" name="Email" placeholder="Email address" required  v-model="Account_Data.Email">
            <input type="password" class="text_input" name="Password" placeholder="Password" required  v-model="Account_Data.Password">
            <input type="button" value="Log in" class="login_btn" id="btn" @click="Login()">
            <hr>
            <input type="button" value="Join Walkr" class="reigster_btn" id="btn" @click="ToggleRegister(true);">
        </form>
    </div>
</template>

<script>
import RegisterForm from "../components/RegisterForm.vue"
import { LoginUser } from "../assets/Scripts"

export default {
    components:{
        RegisterForm,
    },
    methods:{
        ToggleRegister: function(value){
            this.Show_Register = value;
        },
        test: function(){
            alert("Worked!");
        },
        Login: function(){
            LoginUser(this.Account_Data.Email, this.Account_Data.Password);
        }
    },
    data(){
        return{
            Show_Register: false,
            Account_Data:{
                Email: "",
                Password: "",
            }
        }
    }
}
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap');

*{
    font-family: 'Poppins', sans-serif;
}

.container{
    position: absolute;
    left:0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgb(214, 204, 231);
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    z-index: -2;
}

.header_area{
    text-align: left;
    margin-left: 25px;
}

.header_area h1{
    font-size: 5em;
    margin: 0;
    font-weight: 600;
    text-decoration: underline;
}

.form_area{
    width: 350px;
    height: 324px;
    background: rgb(255, 255, 255);
    margin: 5%;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content:space-evenly;
    flex-direction: column;
    box-shadow: 2px 2px 10px 2px #000000;
    z-index: -1;
}

#form_heading{
    width: 100%;
    text-align: center;
    background: rgba(0, 0, 0, 0.2);
    margin: 0;
    height: 10%;
}

.text_input{
    padding: 10px;
    user-select: none;
    outline: none;
    width: 90%;
    margin-bottom: 5%;
    border: solid 2px gray;
    border-radius: 6px;
    font-size: 1.2em;
}

.login_btn{
    width: 90%;
    height: 60px;
    color: white;
    background: rgb(123, 30, 211);
    border-style: none;
    border-radius: 6px;
    font-size: 2em;
}

.reigster_btn{
    width: 60%;
    height: 40px;
    color: white;
    background: rgb(34, 189, 94);
    border-style: none;
    border-radius: 6px;
    font-size: 1.2em;
}

.radio{
    width: 20px;
    height: 20px;
    cursor: pointer;
    user-select: none;
    outline: none;
}

hr{
    width: 90%;
    border-color: gray
}

#btn:hover{
    filter: brightness(115%);
    border-radius: 24px;
    cursor: pointer;
}

#btn{
    transition: filter 0.5s;
     transition: border-radius 0.5s;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.65s;
}

.fade-enter-from, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}


@media only screen and (max-width: 700px) {
  .container{
      display: block;
  }
  
  .header_area{
      flex: 1;
      text-align: center;
  }

  .form_area{
      flex: 2;
      margin: 5% auto;
  }

}


@media only screen and (max-width: 320px) {
  .form_area{
      width: 300px;
  }

}

</style>