

module.exports = {

  getToken() {
    return localStorage.token
  },

  logout(cb) {
    delete localStorage.token;
    delete localStorage.email;
    delete localStorage.user;
    delete localStorage.contacts;

    console.log("User logged out!");

    if (cb) cb()
    this.onChange(false);

    window.location.href = ('/#/login');
    // window.location.reload();
  },

  loggedIn() {
    return !!localStorage.token && !!localStorage.email;
  },

  onChange() {}
};

