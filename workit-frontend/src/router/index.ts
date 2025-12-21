import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { jwtDecode } from 'jwt-decode'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import AdminJobsView from '@/views/AdminJobsView.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue'
import SpontaneousApplicationsView from '@/views/SpontaneousApplicationsView.vue'
import AboutView from '@/views/AboutView.vue'
import PrivacyPolicy from '@/views/PrivacyPolicy.vue'
import JobsView from '@/views/JobsView.vue'
import JobDetailsView from '@/views/JobDetailsView.vue'
import SignupView from '@/views/SignupView.vue'
import MentionsLegales from '@/views/MentionsLegales.vue'
import VerifyEmail from '@/views/VerifyEmail.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import CandidateDashboardView from '@/views/CandidateDashboardView.vue'
import CandidateApplicationsView from '@/views/CandidateApplicationsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import AccountSettingsView from '@/views/AccountSettingsView.vue'
import SpontaneousApplicationView from '@/views/SpontaneousApplicationView.vue'
import AdminProfileView from '@/views/AdminProfileView.vue'
import SuperAdminView from '@/views/SuperAdminView.vue'

type JwtPayload = {
  userId: number
  email: string
  role: 'hr' | 'candidate' | 'super_admin'
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: 'Connexion' },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView,
    meta: { title: 'Créer un compte' },
  },
  {
    path: '/verify-email/:token',
    name: 'VerifyEmail',
    component: VerifyEmail,
    meta: { title: 'Vérification Email' },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { title: 'Mot de passe oublié' },
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { title: 'Réinitialisation' },
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: 'Accueil' },
  },
  {
    path: '/admin/jobs',
    name: 'AdminJobs',
    component: AdminJobsView,
    meta: { requiresAuth: true, role: 'hr', title: 'Offres HR' },
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true, role: 'hr', title: 'Dashboard HR' },
  },
  {
    path: '/admin/spontaneous',
    name: 'SpontaneousAdmin',
    component: SpontaneousApplicationsView,
    meta: { requiresAuth: true, role: 'hr', title: 'Candidatures Spontanées' },
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { title: 'À propos' },
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
    meta: { title: 'Politique de confidentialité' },
  },
  {
    path: '/mentions-legales',
    name: 'MentionsLegales',
    component: MentionsLegales,
    meta: { title: 'Mentions légales' },
  },
  {
    path: '/jobs',
    name: 'JobsView',
    component: JobsView,
    meta: { title: "Offres d'emploi" },
  },
  {
    path: '/jobs/:id',
    name: 'JobDetailsView',
    component: JobDetailsView,
    meta: { title: 'Détail offre' },
  },
  {
    path: '/dashboard',
    name: 'CandidateDashboard',
    component: CandidateDashboardView,
    meta: { requiresAuth: true, title: 'Tableau de bord' },
  },
  {
    path: '/applications',
    name: 'CandidateApplications',
    component: CandidateApplicationsView,
    meta: { requiresAuth: true, title: 'Mes candidatures' },
  },
  {
    path: '/profile',
    name: 'CandidateProfile',
    component: ProfileView,
    meta: { requiresAuth: true, title: 'Mon profil' },
  },
  {
    path: '/account-settings',
    name: 'AccountSettings',
    component: AccountSettingsView,
    meta: { requiresAuth: true, title: 'Paramètres du compte' },
  },
  {
    path: '/apply/spontaneous',
    name: 'SpontaneousApplication',
    component: SpontaneousApplicationView,
    meta: { requiresAuth: true, title: 'Candidature Spontanée' },
  },
  {
    path: '/admin/profile/:id',
    name: 'AdminProfileView',
    component: AdminProfileView,
    meta: { requiresAuth: true, role: 'hr', title: 'Profil Candidat' },
  },
  {
    path: '/superadmin',
    name: 'SuperAdminView',
    component: SuperAdminView,
    meta: { requiresAuth: true, role: 'super_admin', title: 'Super Admin' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  const title = to.meta.title || 'WorkIt'
  document.title = `${title} - WorkIt`
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  const isAuthRequired = to.meta.requiresAuth
  const requiredRole = to.meta.role

  if (isAuthRequired && !auth.isLoggedIn()) {
    return next('/login')
  }

  if (requiredRole) {
    const token = auth.token
    if (!token) return next('/login')

    try {
      const decoded = jwtDecode<JwtPayload>(token)
      if (decoded.role !== requiredRole) {
        return next('/') // fallback
      }
    } catch {
      return next('/login')
    }
  }

  next()
})

export default router
