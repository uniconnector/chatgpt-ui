<template>
    <div id="layout" class="theme-cyan">
      <div class="authentication">
        <div class="container d-flex flex-column">
          <div class="row align-items-center justify-content-center no-gutters min-vh-100">
            <div class="col-12 col-md-7 col-lg-5 col-xl-4 py-md-11">
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <h3 class="text-center">Sign in</h3>
                  <p class="text-center mb-6">Make it simple, but significant</p>
                  <form class="mb-4 mt-5">
                    <div class="input-group mb-2">
                      <input type="email" class="form-control form-control-lg" placeholder="Enter your email"></div>
                    <div class="input-group mb-4">
                      <input type="password" class="form-control form-control-lg" placeholder="Enter your password"></div>
                    <div class="form-group d-flex justify-content-between">
                      <label class="c_checkbox">
                        <input type="checkbox">
                        <span class="ms-2 todo_name">Remember me</span>
                        <span class="checkmark"></span>
                      </label>
                      <a class="link" href="#">Reset password</a></div>
                    <div class="text-center mt-5">
                      <a href="#" class="btn btn-lg btn-primary" title="">Sign in</a></div>
                  </form>
                  <p class="text-center mb-0">Don't have an account yet
                    <a class="link" href="#">Sign up</a>.</p></div>
              </div>
            </div>
            <div class="signin-img d-none d-lg-block text-center">
              <img src="../../assets/signin-img-cyan.svg" alt="Sign In Image"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style>
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
  </style>
  