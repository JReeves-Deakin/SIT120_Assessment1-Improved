import { createRouter, createWebHistory } from 'vue-router'
import store from "../store" //Store holds the user data (says if we're logged in)

const routes = [{
    path: '/Login',
    name: 'Login',
    component: () =>
        import ('../views/Login.vue'),
    meta: {
        RequireLogin: false, // Page requires login to access
    }
}, {
    path: '/Dashboard',
    name: 'Dashboard',
    component: () =>
        import ('../views/Dashboard.vue'),
    meta: {
        RequireLogin: true,
    },
}, {
    path: '/Profile',
    name: 'Profile',
    component: () =>
        import ('../views/Profile.vue'),
    meta: {
        RequireLogin: true,
    },
    props: true,
}, {
    path: '/Editprofile',
    name: 'Editprofile',
    component: () =>
        import ('../views/UnderConstruction.vue'), //Placeholder page
    meta: {
        RequireLogin: true,
    },
}, {
    path: '/Inbox',
    name: 'Inbox',
    component: () =>
        import ('../views/UnderConstruction.vue'), //Placeholder page
    meta: {
        RequireLogin: true,
    },
}, {
    path: '/About',
    name: 'About',
    component: () =>
        import ('../views/About.vue'),
    meta: {
        RequireLogin: true,
    },
}]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

// Before every route, check if we're logged in (store.state.user.loggedin), if not redirect to login page.
// If we are logged in and somehow got back to the login page, redirect to the Dashboard
router.beforeEach((to, from, next) => {
    if (to.meta.RequireLogin && !store.state.user.loggedIn) next({ name: 'Login' })
    else if (!to.meta.RequireLogin && store.state.user.loggedIn) next({ name: 'Dashboard' })
    next()
})

export default router