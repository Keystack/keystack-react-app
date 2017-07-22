

module.exports = {

  getToken() {
    return localStorage.token
  },

  logout(cb) {

    if( localStorage.email || localStorage.token ){
      localStorage.clear();

      if (cb) cb()

      console.log('User Logged out!');
      window.location.href = ('/#/');

      // window.location.reload();
    }
    
  },

  isAuth(){
    return this.loggedIn()
  },

  loggedIn() {
    return !!localStorage.token && !!localStorage.email;
  },

  onChange() {}
};

