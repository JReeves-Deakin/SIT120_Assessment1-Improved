<template> <!-- Generic page, holds information about media used throughout the website -->
    <navbar/>
    <div class="Content">
        <h1> About Walkr </h1>

        All user and dog Icons made by Freepik from www.flaticon.com. <br>
        All Website icons made by google, all other images from pixabay
    </div>
</template>

<script>
import navbar from "../components/NavBar.vue"

export default{
    components:{
        navbar,
    }

}
</script>

<style scoped>
.Content{
    margin-top: 20px;
    z-index: 0;
    position: absolute;
    top: 60px;
    left: 0;
    height: calc(85%);
    width: 100%;
    overflow: hidden;
    text-align: center;
}
</style>
