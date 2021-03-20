import firebase from 'firebase/app'
import 'firebase/database'
import Pokemon from '../models/Pokemon'

export const firebaseApiKey = 'AIzaSyASlp4cZJVb8_WdhrE6PJKgUy_ghYNjo2A'
export const firebaseSignUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`
export const firebaseSignInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`
export const firebaseUrl =
    'https://pokemon-game-1f608-default-rtdb.europe-west1.firebasedatabase.app/'
export const firebaseGetUserUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`

const firebaseConfig = {
    apiKey: firebaseApiKey,
    authDomain: 'pokemon-game-1f608.firebaseapp.com',
    databaseURL: firebaseUrl,
    projectId: 'pokemon-game-1f608',
    storageBucket: 'pokemon-game-1f608.appspot.com',
    messagingSenderId: '564953470709',
    appId: '1:564953470709:web:842aec4a99b8823a62d7bc',
}
firebase.initializeApp(firebaseConfig)

class FirebaseService {
    constructor() {
        this.fire = firebase
        this.database = this.fire.database()
    }

    normalizePokemon = (poke) => new Pokemon({ ...poke })

    getPokemonsSocket = (cb) => {
        this.database.ref('pokemons').on('value', (snapshot) => cb(snapshot.val()))
    }

    offPokemonsSocket = () => {
        this.database.ref('pokemons').off()
    }

    getPokemonsOnceAsync = async () => {
        return await this.database
            .ref('pokemons')
            .once('value')
            .then((snapshot) => snapshot.val())
    }

    updatePokemon = (key, poke) => {
        this.database.ref(`pokemons/${key}`).set(this.normalizePokemon(poke))
    }

    addPokemon = async (userid, tokenId, card, cb) => {
        await fetch(`${firebaseUrl}${userid}/pokemons.json?auth=${tokenId}`, {
            method: 'POST',
            body: JSON.stringify(new Pokemon({ ...card })),
        })
        cb && cb()
    }

    postNewUsersDeck = async (userid, tokenId, cards) => {
        for (const card of cards) {
            await fetch(`${firebaseUrl}${userid}/pokemons.json?auth=${tokenId}`, {
                method: 'POST',
                body: JSON.stringify(new Pokemon({ ...card })),
            })
        }
    }
}

const FirebaseClass = new FirebaseService()

export default FirebaseClass
