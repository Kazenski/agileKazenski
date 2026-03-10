// firebase.js
// --- CONFIGURAÇÃO FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyAA9QgT2iULQIdrdvQ8RvdD4cAVo26EOz0",
    authDomain: "agilekazenski.firebaseapp.com",
    projectId: "agilekazenski",
    storageBucket: "agilekazenski.appspot.com",
    messagingSenderId: "111700352869",
    appId: "1:111700352869:web:39f591d5a9f83188218b8c"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Inicia o módulo de funções
const functions = firebase.functions();