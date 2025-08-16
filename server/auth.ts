import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import type { Express } from 'express';
import { DatabaseStorage } from './storage';

const storage = new DatabaseStorage();

export function setupAuth(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        // Check if user exists
        let user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
        
        if (!user) {
          // Create new user
          const userData = {
            email: profile.emails?.[0]?.value || '',
            fullName: profile.displayName || '',
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            profileImageUrl: profile.photos?.[0]?.value || '',
            registrationMethod: 'google',
            isProfileComplete: false,
          };
          user = await storage.createUserWithExtendedInfo(userData);
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }));
  }

  // GitHub OAuth Strategy
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback"
    }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        // Check if user exists
        let user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
        
        if (!user) {
          // Create new user
          const userData = {
            email: profile.emails?.[0]?.value || '',
            fullName: profile.displayName || profile.username || '',
            firstName: profile.displayName?.split(' ')[0] || profile.username || '',
            lastName: profile.displayName?.split(' ').slice(1).join(' ') || '',
            profileImageUrl: profile.photos?.[0]?.value || '',
            registrationMethod: 'github',
            isProfileComplete: false,
          };
          user = await storage.createUserWithExtendedInfo(userData);
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }));
  }

  // Local Strategy (for phone/email login)
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return done(null, false, { message: 'Email não encontrado' });
      }
      
      // In a real app, you'd verify the password hash here
      // For now, we'll just check if the user exists
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// Authentication middleware
export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}