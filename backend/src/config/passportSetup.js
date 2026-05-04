const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const {
  githubCallbackUrl,
  googleCallbackUrl,
} = require('./runtime');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return done(null, false, { message: 'That email is not registered' });
      }

      if (!user.password) {
        return done(null, false, {
          message: 'Please login using your OAuth provider (Google/GitHub)',
        });
      }

      const isMatch = await user.matchPassword(password);
      if (isMatch) {
        return done(null, user);
      }

      return done(null, false, { message: 'Password incorrect' });
    } catch (err) {
      return done(err);
    }
  })
);

function resolveGithubEmail(profile) {
  const primary = profile.emails?.find((e) => e.primary)?.value;
  const first = profile.emails?.[0]?.value;
  const jsonEmail = profile._json?.email;
  if (primary || first || jsonEmail) {
    return primary || first || jsonEmail;
  }
  const id = profile.id;
  const username = profile.username;
  if (id && username) {
    return `${id}+${username}@users.noreply.github.com`;
  }
  return null;
}

function resolveGithubAvatar(profile) {
  return profile.photos?.[0]?.value || profile._json?.avatar_url || undefined;
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: githubCallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = resolveGithubEmail(profile)?.trim().toLowerCase();
        if (!email) {
          return done(null, false, {
            message:
              'GitHub did not provide an email. Allow email access or set a public email on GitHub.',
          });
        }

        const githubId = String(profile.id);
        let user = await User.findOne({ githubId });
        if (!user) {
          user = await User.findOne({ email });
        }

        if (user) {
          user.githubAccessToken = accessToken;
          if (!user.githubId) {
            user.githubId = githubId;
          }
          const avatarUrl = resolveGithubAvatar(profile);
          if (avatarUrl && user.avatarUrl !== avatarUrl) {
            user.avatarUrl = avatarUrl;
          }
          await user.save();
          return done(null, user);
        }

        const avatarUrl = resolveGithubAvatar(profile);
        user = await User.create({
          username: profile.username || profile.displayName || `github-${profile.id}`,
          email,
          githubId,
          ...(avatarUrl ? { avatarUrl } : {}),
          authProvider: 'github',
          githubAccessToken: accessToken,
        });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: googleCallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.trim().toLowerCase();
        if (!email) {
          return done(null, false, { message: 'Google did not provide an email address.' });
        }

        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.findOne({ email });
        }

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
          }
          if (!user.avatarUrl && profile.photos?.[0]?.value) {
            user.avatarUrl = profile.photos[0].value;
          }
          await user.save();
          return done(null, user);
        }

        user = await User.create({
          username: profile.displayName,
          email,
          googleId: profile.id,
          avatarUrl: profile.photos?.[0]?.value,
          authProvider: 'google',
        });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
