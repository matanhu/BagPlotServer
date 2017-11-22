
var admin = require("firebase-admin");

var serviceAccount = require("../firebaseFiles/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bagplot-b2914.firebaseio.com"
});

var FirebaseFactory = {
    createUserByEmail: function (signupModel) {
        return admin.auth().createUser({
            email: signupModel.email,
            emailVerified: false,
            // phoneNumber: signupModel.cellular,
            password: signupModel.password,
            displayName: signupModel.firstName + '' + signupModel.lastName,
            // photoURL: "http://www.example.com/12345678/photo.png",
            disabled: false
        });
    },

    verifyIdToken: function (idToken) {
        return admin.auth().verifyIdToken(idToken);
    }
}

module.exports = FirebaseFactory;


// var firebase = require('firebase');

// firebase.initializeApp({
//     apiKey: "AIzaSyC0LA_uWVK0YiGLG_FVNWZc_T1Fw9P6zRA",
//     authDomain: "bagplot-b2914.firebaseapp.com",
//     databaseURL: "https://bagplot-b2914.firebaseio.com",
//     projectId: "bagplot-b2914",
//     storageBucket: "bagplot-b2914.appspot.com",
//     messagingSenderId: "577810091219"
//   });

//   var FirebaseFactory = {
//     createUserByEmail: function(signupModel) {
//         return firebase.auth().createUserWithEmailAndPassword(signupModel.email, signupModel.password);
//     },
//     signinUserByEmail: function(signinModel) {
//         return firebase.auth().signInWithEmailAndPassword(signinModel.email, signinModel.password);
//     },
//     updateProfile: function(signupModel) {
//         var user = firebase.auth().currentUser;
//         if(user) {
//             return user.updateProfile({
//                 displayName: signupModel.firstName + ' ' + signupModel.lastName,
//             });
//         }
//     }
// }

// module.exports = FirebaseFactory; 


