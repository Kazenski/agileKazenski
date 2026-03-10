// --- CONFIGURAÇÃO FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyAA9QgT2iULQIdrdvQ8RvdD4cAVo26EOz0",
    authDomain: "agilekazenski.firebaseapp.com",
    projectId: "agilekazenski",
    storageBucket: "agilekazenski.appspot.com",
    messagingSenderId: "111700352869",
    appId: "1:111700352869:web:39f591d5a9f83188218b8c"
};

// 1. Inicializa o App com segurança
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// 2. Atrela os serviços EXATAMENTE a este app (evita o erro do DEFAULT)
const db = app.firestore();
const cloudFunctions = app.functions();