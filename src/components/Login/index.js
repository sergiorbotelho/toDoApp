import React, { useState } from "react";
import {Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import firebase from '../../firebaseConnection';


export default function Login({changeStatus}) {

  const [type, setType] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [user, setUser] = useState('');

  async function Entrar() {
    if (type === 'login') {
      const user = firebase.auth().signInWithEmailAndPassword(email,password)
      .then((user)=>{
        changeStatus(user.user.uid);
      })
      .catch((error)=>{
        if(error.code === 'auth/invalid-password'){
          alert('Senha incorreta')
          return
        }
        if(error.code === 'auth/invalid-email'){
          alert('Email inválido')
          return
        }
        if(error.code === 'auth/user-not-found'){
          alert('Usuário não encontrado')
          return
        }
        else{
          alert('Algo deu errado, verifique usuário e senha')
        }
        
        
      })
    }
    else {
      const user = firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user)=>{
      changeStatus(user.user.uid);
    })
    .catch((error)=>{
      if(error.code === 'auth/weak-password'){
        alert('Sua senha deve ter pelo menos 6 caracteres')
        return
      }
      if(error.code === 'auth/invalid-email'){
        alert('Email inválido')
        return
      }
      else{
        alert('Ops, algo deu errado!')
      }
    })
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <FontAwesome5
        name="user"
        size={100}
        color={type === 'login' ? '#68a9ff' : '#63dd80'}
        style={{ marginBottom: 20 }}
      />
      <Text style={styles.text}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder='Seu email'
        value={email}
        onChangeText={(value) => setEmail(value)}
      />
      <Text style={styles.text}>Senha:</Text>
      <TextInput
        style={styles.input}
        placeholder='*********'
        secureTextEntry={true}
        value={password}
        onChangeText={(value) => setPassword(value)}
      />
      <TouchableOpacity
        style={[styles.areaBtn, { backgroundColor: type === 'login' ? '#68a9ff' : '#63dd80' }]}
        onPress={Entrar}
      >
        <Text style={styles.textBtn}>{type === 'login' ? 'Entrar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setType(type => type === 'login' ? 'cadastrar' : 'login')}>
        <Text style={{ marginTop: 10, color: '#121212' }}>{type === 'login' ? 'Criar uma conta' : 'Já possuo uma conta'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    width: '80%',
    fontSize: 20,
    color: '#000',
    marginBottom: 10
  },
  input: {
    width: '80%',
    height: 45,
    padding: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    fontSize: 17
  },
  areaBtn: {
    width: 150,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 15
  },
  textBtn: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15
  }
})

