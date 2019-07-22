<template>
  <div id="login">
    <BgBoard class="login-bg" :imgSrc="imgSrc"></BgBoard>
    <div class="container-fluid">
      <div class="row login-wrap-row">
        <div class="col-lg-4 col-lg-offset-4 full-height">
          <div class="login-wrap">
            <div class="login-box">
              <div class="login-option-box">
                <div class="title-box">
                  <h2><small v-if="loginStatus">To </small><small v-else>Join </small>M.Homestead</h2>
                </div>
                <div class="cutting-line"></div>
                <form @submit="checkForm">
                  <div v-if="loginStatus">
                    <div class="form-group" :class="{'has-error':usernameErrorStatus}">
                      <label for="username_ipt">
                        <strong>Username:</strong>
                      </label>
                      <input 
                      v-model="loginForm.username"
                      type="text" 
                      class="form-control" 
                      id="username_ipt" 
                      tabindex="1"
                      placeholder="Please enter your username..."
                      @keyup.enter="handleLogin">
                    </div>
                    <div class="form-group" :class="{'has-error':passwordErrorStatus}">
                      <div class="row">
                        <div class="col-md-6">
                          <label for="password_ipt"><strong>Password:</strong></label>
                        </div>
                        <div class="col-md-4 col-md-offset-2 align-right">
                          <a tabindex="-1" href="#" class="forgot-btn"><small>Forgot password?</small></a> 
                        </div>
                      </div>
                      <input 
                      v-model="loginForm.password"
                      type="password" 
                      class="form-control" 
                      id="password_ipt" 
                      tabindex="2"
                      placeholder="Please enter your password..." 
                      @keyup.enter="handleLogin">
                    </div>
                    <div class="form-group error-text" v-if="errors.length">
                      <small>
                        <p v-for="item in errors">
                          <span class="glyphicon glyphicon-remove"></span>"{{item}}"
                        </p>
                      </small>
                    </div>
                  </div>
                  <div v-else></div>
                  <div class="form-group login-btn-group">
                    <button tabindex="10" type="button" class="btn btn-primary btn-lg btn-block text-uppercase" @click="handleLogin">Sign in</button>
                    <button tabindex="11" type="button" class="btn btn-secondary btn-lg btn-block text-uppercase" @click="signup">Sign up</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
  import BgBoard from "../components/bg-board.vue"

  export default{
    name: 'login',
    data: function(){
      return {
        errors: [],
        usernameErrorStatus: 0,
        passwordErrorStatus: 0,
        imgSrc: require("../assets/img/bg2.jpg"),
        loginStatus: 1,
        loginForm: {
          username: '',
          password: ''
        }
      }
    },
    watch: {
      loginForm: {
        handler: function(val){
          if(this.errors!=[]){
            this.initError()
          }
        },
        deep: true
      },
    },
    created: function(){
    },
    methods:{
      handleLogin: function(){
        if(!this.loginStatus){
          this.loginStatus = 1
          this.initError()
        }
        else{
          this.checkForm()
        }
      },
      signup: function(){
        this.loginStatus = 0
      },
      checkForm: function(){
        this.errors = []
        if (!this.loginForm.username) {
          this.errors.push("帐号不能为空.")
          this.usernameErrorStatus = 1
        }
        if(!this.loginForm.password) {
          this.errors.push("密码不能为空.")
          this.passwordErrorStatus = 1
        }
        // if(!this.validEmail(this.email)){
        //   this.errors.push('无效的邮箱格式.');
        // }
        if(this.errors.length == 0){
          this.$store.dispatch('user/SignIn',this.loginForm).then((res) => {
            console.log("用户［" + res.data.data.username + "]登录成功:")
            console.log(res.data)
            this.$router.push('/home')
          }).catch((e) => {
            console.log("error:" + e)
            if(e){
              this.errors.push("登陆失败。")
            }
            else{
              this.errors.push(e)
            }
            this.$store.dispatch('user/FedSignOut')
          })
        }
      },
      validEmail: function(email){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email);
      },
      initError: function(){
        this.errors = []
        this.usernameErrorStatus = 0
        this.passwordErrorStatus = 0
      }
    },
    components: {
      BgBoard
    }
  };
</script>

<style>
#login {
  width: 100%;
  height: 100%;
}
#login .login-bg{
  filter: blur(4px) brightness(0.4);
  -moz-filter: blur(4px) brightness(0.4);
  -webkit-filter: blur(4px) brightness(0.4);
  -ms-filter: blur(4px) brightness(0.4); 
  transition: all 0.4s;
  -moz-transition: all 0.4s; /* Firefox 4 */
  -webkit-transition: all 0.4s; /* Safari 和 Chrome */
  -o-transition: all 0.4s; /* Opera */
  position: absolute;
}
#login .login-bg:hover{
  filter: blur(0px) brightness(0.6);
}
#login .container-fluid,
#login .container-fluid .login-wrap-row{
  height: 100%;
}
#login .login-wrap{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#login .login-wrap .login-box{
  width: 100%;
}
#login .login-wrap .login-box .title-box{
  width: 100%;
  text-align: center;
  color: #2c3e50;
}
#login .login-wrap .login-box .title-box small{
  color: #fff;
}
#login .login-wrap .login-box .cutting-line{
  transform: scale(0.9,1.5);
  opacity: 0.6; 
}
#login .login-wrap .login-box .login-option-box{
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  padding: 20px;
  text-align: left;
}
#login .login-wrap .login-box .login-option-box:hover{
  /*background-color: rgba(255, 255, 255, 0.6)*/
}
#login .login-wrap .login-box .login-option-box input{
  height: 40px;
  line-height: 40px;
  margin-bottom: 4px;
}
#login .login-wrap .login-box .login-option-box label{
  /*font-size: 16px;*/
}
#login .login-wrap .login-box .login-option-box .forgot-btn{
  color: #d9534f;
}
#login .login-wrap .login-box .login-option-box .login-btn-group button{
  border-radius: 3px;
}
#login .login-wrap .login-box .login-option-box .error-text{
  color: #d9534f;
  text-indent: .5rem;
  padding: 3px 0 6px 0;
}
#login .login-wrap .login-box .login-option-box .error-text p{
  margin: .4rem 0;
  border-radius: 2px;
  height: 2.5rem;
  line-height: 2.5rem;
  background-color: #fccece;
  user-select: none;
}
#login .login-wrap .login-box .login-option-box .error-text p .glyphicon{
  margin-right: 5px;
  top: 2px;
}
</style>