<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const firstname = ref<string>('')
const lastname = ref<string>('')
const email = ref<string>('')

const router = useRouter();

function handleSignin() {
  router.push({ name:"signin" })
}

function handleRegistration() {

  if (!firstname || firstname.value.trim() === '')
    return

  if (!lastname || lastname.value.trim() === '')
    return

  if (!email || email.value.trim() === '')
    return

  console.log(firstname.value, lastname.value, email.value)

  let data = {
    "firstname": firstname.value.trim(),
    "lastname": lastname.value.trim(),
    "email": email.value.trim()
  }

  fetch('http://api.uniconnector.com/portal/environments/DEFAULT/users/registration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
	.then(response => response.text())
	.catch(error => console.error('Error:', error))
	.then(function (response) {
    router.push({ name:"chat" })
  })
}
</script>
<template>
    <div id="layout" class="theme-cyan">
      <div class="authentication">
        <div class="container d-flex flex-column">
          <div class="row align-items-center justify-content-center no-gutters min-vh-100">
            <div class="col-12 col-md-7 col-lg-5 col-xl-4 py-md-11">
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <h3 class="text-center">Sign up</h3>
                  <p class="text-center mb-6">Create your free Account</p>
                  <form class="mb-4 mt-5">
                    <div class="input-group mb-2">
                      <input type="text" class="form-control form-control-lg" v-model="firstname" placeholder="Enter your firstname"></div>
                    <div class="input-group mb-2">
                      <input type="text" class="form-control form-control-lg" v-model="lastname" placeholder="Enter your lastname"></div>
                    <div class="input-group mb-4">
                      <input type="email" class="form-control form-control-lg" v-model="email" placeholder="Enter your email"></div>
                    <div class="text-center mt-5">
                      <a href="#" class="btn btn-lg btn-primary" @click="handleRegistration" title="">Sign up</a></div>
                  </form>
                  <p class="text-center mb-0">Already have an account?
                    <a class="link" href="#" onclick="handleSignin()">Sign in</a>.</p>
                  <div class="mt-4 d-grid gap-2">
                    <button type="button" class="btn btn-block btn-outline-google">Signup with Google</button>
                    <button type="button" class="btn btn-block btn-outline-facebook">Signup with Facebook</button></div>
                </div>
              </div>
            </div>
            <div class="signin-img d-none d-lg-block text-center">
              <img src="../../assets/signin-img-cyan.svg" alt="Sign In Image"></div>
          </div>
        </div>
      </div>
    </div>
</template>
  