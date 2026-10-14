export default defineNuxtRouteMiddleware(async (to) => {
  const { user } = await $fetch<{ user: string | null }>('/api/auth/me')
  if (!user && to.path !== '/admin/login') return navigateTo('/admin/login')
  if (user && to.path === '/admin/login') return navigateTo('/admin')
})
