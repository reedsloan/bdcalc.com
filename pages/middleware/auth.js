export default defineNuxtRouteMiddleware((ctx) => {
    if (!ctx.$auth.loggedIn) {
        return ctx.redirect('/login')
    }
    }
)