const scripts_config = {

  defaultCookies: function() {
    console.log('default cookies');

    // note: using anonymized IP
    if (typeof loadGA === 'function') loadGA(true);
  },

  enableCookies: function() {
    console.log('enabled cookies');

    if (typeof loadGA === 'function') loadGA(false);
    if (typeof loadDisqus === 'function') loadDisqus();
  },

  disableCookies: function() {
    console.log('disabled cookies');

    this.defaultCookies();
  },

  loadScripts: function(requireConsent, consentUrl) {
    if (requireConsent) {
      // scripts managed based on consent status
      this.initializeCookieConsent(consentUrl);
    } else {
      // all scripts enabled
      this.enableCookies();
    }
  },

  initializeCookieConsent: function(consentUrl) {

    const me = this;

    window.cookieconsent.initialise({
      "palette": {
        "popup": {
          "background": "#edeff5",
          "text": "#838391"
        },
        "button": {
          "background": "#4b81e8"
        }
      },
      "position": "bottom-right",
      "type": "opt-in",
      "content": {
        "message": "This website uses cookies to ensure you get the best experience here.",
        "href": consentUrl
      },

      onInitialise: function (status) {
        console.log(`cc - onInitialise, status: ${status}`);

        var type = this.options.type;
        var didConsent = this.hasConsented();
        if (type == 'opt-in' && didConsent) {
          me.enableCookies();
        }
        else if (type == 'opt-out' && !didConsent) {
          me.disableCookies();
        }
        else {
          me.defaultCookies();
        }
      },

      onStatusChange: function (status, chosenBefore) {
        console.log(`cc - onStatusChange, status: ${status}, chosenBefore: ${chosenBefore}`);

        var type = this.options.type;
        var didConsent = this.hasConsented();
        if (type == 'opt-in' && didConsent) {
          me.enableCookies();
        }
        if (type == 'opt-out' && !didConsent) {
          me.disableCookies();
        }
      },

      onRevokeChoice: function () {
        // NOTE: this hook is called immediately after the revoke button is clicked and removea previous answers
        console.log(`cc - onRevokeChoice`);

        var type = this.options.type;
        if (type == 'opt-in') {
          me.disableCookies();

          // NOTE: we need to reload page, so that we get rid of the loaded GA / Disqus scripts!
          location.reload();
        }
        if (type == 'opt-out') {
          me.enableCookies();
        }
      },

      onPopupOpen: function() {
        console.log(`cc - onPopupOpen`);
      },

      onPopupClose: function() {
        console.log(`cc - onPopupClose`);
      }

    });

  }

};
