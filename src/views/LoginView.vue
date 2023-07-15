<script setup lang="ts">
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import rules from '@/utils/validators'
import ArrowLeft from '@/components/icons/ArrowLeftIcon.vue'
import stores from '@/stores'

const { errors } = useForm()

const email = ref('')
const password = ref('')

const authStore = stores.useAuthStore()

const formIsValid = computed(() => {
  return (
    Object.keys(errors.value).length === 0 &&
    !!email.value.length &&
    !!password.value.length
  )
})

const login = async () => {
  try {
    await authStore.loginUser({ email: email.value, password: password.value })
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="login-background">
    <div class="logo flex align-items-center">
      <img
        src="../assets/images/hamburger.svg"
        class="login-dialog__logo mr-3"
      />
      <span>Kanban</span>
    </div>
    <div class="login-dialog flex flex-column align-items-center">
      <router-link to="/" class="login-dialog__back-icon">
        <ArrowLeft :size="25" />
      </router-link>
      <span class="login-dialog__title">Login</span>
      <div class="flex flex-column justify-content-center">
        <form @submit.prevent="login" class="flex flex-column gap-2 mt-5">
          <BaseInput
            v-model="email"
            label="Email"
            autocomplete="username"
            :rules="[(value:string) => rules.required(value,'Email'), rules.email]"
            icon-right="pi-user"
          />
          <BasePasswordInput v-model="password" label="Password" />
          <BaseButton
            type="submit"
            label="Login"
            class="mt-2"
            :disabled="authStore.isLoading || !formIsValid"
          />
        </form>
        <span class="singup-callback text-center mt-4"
          >Don't have an account?
          <router-link to="/signup">Sign up</router-link></span
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-background {
  height: 100vh;
  width: 100vw;
  background: linear-gradient(300deg, #04a4f7, #5554a0, #474479);
  background-size: 180% 180%;
  animation: gradient-animation 9s ease infinite;
  position: relative;
}

.logo {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translate(-50%, 0);
  color: #dfdcff;
  font-size: 32px;
  font-weight: 600;
}

.login-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: fit-content;
  background-color: #2f2f3b;
  border-radius: 8px;
  padding: 30px 50px 40px 50px;
  color: #dfdcff;
  border: 2px solid #6560ba !important;
  box-shadow: 1px 1px 10px 0px #2f2f3b;

  &__title {
    font-size: 32px;
    font-weight: 600;
  }

  &__logo {
    height: 35px;
    width: 35px;
  }

  &__back-icon {
    position: absolute;
    top: 25px;
    left: 25px;
    cursor: pointer;

    i {
      font-size: 24px;
    }
  }
}

.singup-callback {
  color: #dfdcff;
  font-size: 14px;

  a {
    color: #dfdcff;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
  }
}

@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
