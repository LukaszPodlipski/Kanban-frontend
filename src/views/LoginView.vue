<script setup lang="ts">
import ArrowLeft from '@/components/icons/ArrowLeftIcon.vue'
import { useAuthStore } from '@/stores/auth'
import rules from '@/utils/validators'
import { useForm } from 'vee-validate'
import { computed, ref, Ref } from 'vue'

const { errors } = useForm()

const email: Ref<string> = ref('')
const password: Ref<string> = ref('')

const authStore = useAuthStore()

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
      <span class="login-dialog__title">{{ $t('login.title') }}</span>
      <div class="flex flex-column justify-content-center">
        <form @submit.prevent="login" class="flex flex-column gap-2 mt-5">
          <BaseInput
            v-model="email"
            :label="$t('login.email')"
            autocomplete="username"
            :rules="[(value:string) => rules.required(value, $t('login.email')), rules.email]"
            icon-right="pi-user"
          />
          <BasePasswordInput v-model="password" :label="$t('login.password')" />
          <BaseButton
            type="submit"
            :label="$t('login.submit')"
            class="mt-2"
            :disabled="authStore.loading || !formIsValid"
          />
        </form>
        <span class="singup-callback text-center mt-4"
          >{{ $t('login.doNotHaveAccount') }}
          <router-link to="/signup">{{ $t('login.signup') }}</router-link></span
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-background {
  height: 100vh;
  width: 100vw;
  background: linear-gradient(
    300deg,
    #04a4f7,
    $primary-darken1,
    $primary-darken2
  );
  background-size: 180% 180%;
  animation: gradient-animation 9s ease infinite;
  position: relative;
}

.logo {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translate(-50%, 0);
  color: $primary-lighten;
  font-size: 32px;
  font-weight: 600;
}

.login-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: fit-content;
  background-color: $grayscale-darken5;
  border-radius: 8px;
  padding: 30px 50px 40px 50px;
  color: $primary-lighten;
  border: 2px solid $primary-base !important;
  box-shadow: 1px 1px 10px 0px $grayscale-darken5;

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
  color: $primary-lighten;
  font-size: 14px;

  a {
    color: $primary-lighten;
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
