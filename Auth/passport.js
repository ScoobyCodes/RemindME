const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const users = require('../Models/userdb').users;
const bcrypt = require('bcrypt');
const saltRounds = 10;

passport.serializeUser(function(user,done){
	done(null,user.id);
});
	
passport.deserializeUser(function(userId,done){
	users.findOne({
		where:{
			id:userId
		}
	}).then(function(user){
		done(null,user);
	})
});

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile,done) {
    users.findOrCreate({ 
    	where:{ googleId: profile.id },
    	defaults:{
    		fullname:profile.displayName,
    		email:profile.emails[0].value,
    		token:accessToken,
    		refreshToken:refreshToken,
    		googleId:profile.id
    	}
    }).spread(function(user, created){
    	done(null,user);
    })

});

const localStrategy = new LocalStrategy({
        usernameField : 'email',
        passReqToCallback: true
	},
	function(req,email,password,done){
		users.findOne({
			where:{
				email:email
			}
		}).then(function(user){
			if(user){
				bcrypt.compare(password,user.passwordhash).then(function(res){
					if(res){
						done(null,user);
					}
					else{
						done(null,false);
					}
				})
			}
			else{
				done(null,false);
			}
		}).catch(function(err){
			throw err;
		})
});

passport.use(googleStrategy);

passport.use(localStrategy);

module.exports = passport;