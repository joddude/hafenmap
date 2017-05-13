var access_token = false;

function check_auth() {
  gapi.auth.authorize(
    {
      'client_id': oauth_client_id,
      'scope': oauth_scopes.join(' '),
      'immediate': true
    }, auth_result);
}

function auth_result(authResult) {
    //console.log(authResult);
  if (authResult.access_token) {
    access_token = authResult.access_token;
    //console.log(access_token);
  } else {
    start_auth();
  }
}

function start_auth() {
  gapi.auth.authorize(
    {
      'client_id': oauth_client_id,
      'scope': oauth_scopes,
      'immediate': false
    }, auth_result);
}
