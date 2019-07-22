<template>
  <div id="mheader">
    <div class="header-container">
      <div class="row">
        <div class="col-md-6 col-l">
          <div class="header-l">
            <ul class="nav nav-pills navbar-right">
              <!-- <li role="presentation" ><router-link to="activity"><a>Activity</a></router-link></li> -->
              <li role="presentation" class="active"><router-link to="home"><a>M.HOMESTEAD</a></router-link></li>
            </ul>
          </div>
        </div>
        <div class="col-md-4 col-m">
          <div class="header-m">
            <ul class="nav nav-pills">
              <li role="presentation"><router-link to="life"><a>Life</a></router-link></li>
              <li role="presentation"><router-link to="note"><a>Note</a></router-link></li>
              <li role="presentation"><router-link to="friends"><a>Friends</a></router-link></li>
              <li role="presentation"><router-link to="document"><a>Document</a></router-link></li>
            </ul>
          </div>
        </div>
        <div class="col-md-2 col-r">
          <div class="header-r">
            <ul class="nav nav-pills navbar-right">
              <li role="presentation">
                <a class="dropdown-toggle" aria-haspopup="true" aria-expanded="false" href="#" data-toggle="dropdown"><span class="glyphicon glyphicon-user"></span></a>
                <ul class="dropdown-menu">
                  <li role="presentation">
                    <a href="#"><span class="glyphicon glyphicon-sunglasses"></span>{{$store.getters["user/name"]}}</a>
                  </li>
                  <li role="separator" class="divider"></li>
                  <li role="presentation">
                    <a href="#" data-toggle="modal" data-target="#sign_out_pop"><span class="glyphicon glyphicon-log-out"></span>Sign out</a>
                  </li>
                </ul>
              </li>
              <li role="presentation">
                <a class="dropdown-toggle" aria-haspopup="true" aria-expanded="false" href="#" data-toggle="dropdown"><span class="glyphicon glyphicon-option-vertical"></span></a>
                <ul class="dropdown-menu">
                  <li role="presentation">
                    <a href="#"><span class="glyphicon glyphicon-question-sign"></span>Help</a>
                  </li>
                  <li role="presentation">
                    <a href="#"><span class="glyphicon glyphicon-cog"></span>Setings</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div id="sign_out_pop" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">确认登出？</h4>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="signOut">Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'mheader',
    data: function(){
      return {

      }
    },
    watch: {
      '$route': function(to, from) {
        $('.modal-backdrop.in').remove()
      }
    },
    methods: {
      signOut: function(){
        this.$store.dispatch('user/SignOut').then((res) => {
          this.$router.go(0)
          this.$router.push('/login')
        })
      }
    }
  }
</script>

<style>
  #mheader{
    z-index: 99999;
    position: fixed;
    width: 100%;
    padding: 15px 40px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px #aaa;
  }
  #mheader .header-l{
    padding-right: 20px;
  }

  #mheader .nav-pills li{
    margin-left: 2px;
  }
  #mheader .col-m{
    border-left: 1px dashed #337ab7;
  } 
  #mheader .modal .modal-content .modal-header{
    text-align: left;
  }
  #mheader a.router-link-exact-active{
    background-color: #eee;
  }
  #mheader .nav-pills>li.active a, 
  .nav-pills>li.active a:focus, 
  .nav-pills>li.active a:hover{
    color: #fff;
    background-color: #337ab7;
  }
  #mheader a:hover{
    text-decoration: none;
  }
</style>