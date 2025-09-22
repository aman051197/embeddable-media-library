// server.js
const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy: SamlStrategy } = require('@node-saml/passport-saml');

// 1. Load .env from the config folder
require('dotenv').config({
  path: path.join(__dirname, 'config', '.env')
});  // by default dotenv looks for “.env” in cwd; this points it at config/.env :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}

const idpCert = fs.readFileSync(path.join(__dirname, 'config', 'idp-cert.cer'), 'utf-8');
const app = express();

app.use(express.urlencoded({ extended: true }));   // parse SAMLResponse form posts :contentReference[oaicite:1]{index=1}
app.use(express.json());   

// === Session setup ===
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this',
  resave: false,
  saveUninitialized: true,
  // For third-party iframes: SameSite=None; Secure
}));

// === Passport & SAML strategy ===
passport.use(new SamlStrategy({
  entryPoint: process.env.SAML_ENTRY_POINT,      // IdP SSO URL
  issuer: process.env.SAML_ISSUER,            // SP Entity ID
  callbackUrl: process.env.SAML_CALLBACK_URL,    // Assertion Consumer Service URL
  idpCert: idpCert,              // IdP x509 certificate
  wantAuthnResponseSigned: false,             // skip response-level signature
  wantAssertionSigned:     true,              // still require assertion-level signature
}, (profile, done) => {
  // profile contains the SAML assertions (e.g. email, name)
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(passport.initialize());
app.use(passport.session());

// === Auth middleware ===
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

// === Routes ===

// 1. Initiate SP-initiated SSO
app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/login-failed' })
);

// 2. ACS endpoint (IdP posts SAMLResponse here)
app.post('/callback',
  passport.authenticate('saml', { failureRedirect: '/login-failed' }),
  (req, res) => {
    // Successful SSO
    res.redirect('/');
  }
);

// 3. Logout
app.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => res.redirect('/'));
  });
});

// 4. Serve your widget page only if authenticated
app.get('/', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. Static assets
app.use('/static', express.static(path.join(__dirname, 'public')));

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`CMS POC listening on http://localhost:${PORT}`);
});
