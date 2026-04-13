export const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_dRfqHOPSp",
  client_id: "7vd64o8bjjqof0t2qh3la47ijg",
  redirect_uri: "http://localhost:5173",
  response_type: "code",
  scope: "openid email",
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};
