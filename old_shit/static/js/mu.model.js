

function Model () {
  this._token = ''
  this.getToken()
}


Model.prototype.search = function (query) {
  this.AJAX({
    type: 'GET',
    url: '/api/search',
    params: {
      q: query
    },
    done: function () {
      
    }
  })
}



/**
 * Grabs a token from the server assuming we already don't have one
 */
Model.prototype.getToken = function () {
  var self = this

  // Grab a token from the localStorage
  // If it's null, grab one.
  
  this._token = localStorage['TOKEN']

  if (!this._token) {
    self.AJAX({
      type: 'GET',
      url: '/api/v1/token',
      params: {
        // These parameters help understand this user.
        print: Mu.Controller.fingerPrint(),
        navId: Mu.Controller.grabNav()
      },
      done: function (e) {
        self._token = e.token
      },
      error: function () {
        // Keep fetching if it's not working.
        setTimeout(function () {
          self.getToken()
        },1000)
      }
    })
  }
}


/**
 * Just an AJAX wrapper.
 * @param {JSON} opts - the options passed:
 *   @key {String} type - Enum('GET','POST') 
 *   @key {String} url - the URL of the request
 *   @key {JSON} params - the GET url parameters
 *   @key {JSON} data - the POST parameters
 *   @key {Function} done - executed if this is complete, successfully.
 *   @key {Function} error - called if request fails or returns JSON with 'error' key. 
 *   @key {Boolean} notJSON - set to true if the request is a non JSON request.
 */
Model.prototype.AJAX = function (opts) {

  // Set up the url properly.
  var url = opts.url

  for (var param in opts.params) {
    url += param + '=' + encodeURI(opts.params[param]) + '&'
  }

  // Set up the data properly.
  var data = ""
  if (opts.type == 'POST') {
    for (var key in opts.data) {
      data += key + '=' + encodeURI(opts.data[key]) + '&'
    }
  }


  // Now start the request.
  var request = new XMLHttpRequest()
  request.open(opts.type, url, true)

  // Try to do a request otherwise fail.
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {

      // If it's not JSON, just deliver it, otherwise try to parse it 
      // and process it.
      if (opts.notJSON) {
        opts.done && opts.done(request.responseText)
        return
      }

      try {
        var thing = JSON.parse(request.responseText)
      } catch (e) {
        opts.error && opts.error({
          error: 'BAD JSON'
        })
        return
      }

      if (thing.error) {
        opts.error && opts.error(thing.error)
        return
      }

      opts.done && opts.done(thing)
    } else {
      opts.error && opts.error()
    }
  }

  request.onerror = function() {
    opts.error && opts.error()
  }


  request.send(data)
}