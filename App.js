import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard
} from 'react-native';

import Login from './src/components/Login';
import TaskList from './src/components/TaskList';
import firebase from 'firebase';
import Feather from 'react-native-vector-icons/Feather';


export default function App() {


  const [user, setUser] = useState(null);
  const inputRef = useRef(null);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [key, setKey] = useState('');

  useEffect(() => {

    function getUser() {
      if (!user) {
        return
      }

      firebase.database().ref('Tarefas').child(user).once('value', (snapshot) => {
        setTasks([]);

        snapshot?.forEach((childItem) => {
          let data = {
            key: childItem.key,
            nome: childItem.val().nome
          }

          setTasks(oldTasks => [...oldTasks, data])
        })
      })
    }
    getUser();
  }, [user])


  function handleAdd() {
    if (newTask === '') {
      return
    }

    if (key !== '') {
      firebase.database().ref('Tarefas').child(user).child(key).update({
        nome: newTask
      })
        .then(() => {
          const taskIndex = tasks.findIndex(item => item.key === key);
          const taskClone = tasks;
          taskClone[taskIndex].nome = newTask
          setTasks([...taskClone]);
        })
      Keyboard.dismiss();
      setNewTask('')
      setKey('')
      return
    }

    let tarefas = firebase.database().ref('Tarefas').child(user);
    let chave = tarefas.push().key;

    tarefas.child(chave).set({
      nome: newTask
    })
      .then(() => {
        const data = {
          key: chave,
          nome: newTask
        };
        setTasks(oldTasks => [...oldTasks, data].reverse())
      })

    Keyboard.dismiss();
    setNewTask('');
  }

  function handleDelete(key) {
    firebase.database().ref('Tarefas').child(user).child(key).remove()
      .then(() => {
        const findTask = tasks.filter(item => item.key !== key)
        setTasks(findTask)
      })
  }

  function handleEdit(data) {
    setKey(data.key);
    setNewTask(data.nome);
    inputRef.current.focus();
  }

  function cancelEdit() {
    setKey('');
    setNewTask('');
    Keyboard.dismiss();
  }

  async function logOut(){
    await firebase.auth().signOut();
    setUser(null);
  }

  if (!user) {
    return (
      <Login changeStatus={(user) => setUser(user)} />
    )
  }

  return (
    <SafeAreaView style={styles.container}>

      {key.length > 0 && (
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <TouchableOpacity onPress={cancelEdit}>
            <Feather name='x-circle' size={20} color='#FF0000' />
          </TouchableOpacity>
          <Text style={{ marginLeft: 5, color: '#FF0000' }}>Você está editando uma tarefa!</Text>
        </View>
      )}

      <View style={styles.containerTask}>
        <TextInput
          style={styles.input}
          placeholder='O que vai fazer hoje?'
          value={newTask}
          onChangeText={(text) => setNewTask(text)}
          ref={inputRef}
        />
        <TouchableOpacity style={styles.areaBtn} onPress={handleAdd}>
          <Text style={styles.textBtn}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <TaskList data={item} deleteItem={handleDelete} editItem={handleEdit} />
        )}
      />
      <View>
        <TouchableOpacity style={styles.logout} onPress={logOut}>
          <Feather name='log-out' size={20} color='#FF0000' />
          <Text style={{ marginLeft: 5, color: '#FF0000' }}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: '#F2f6fc'
  },
  containerTask: {
    flexDirection: 'row'
  },
  input: {
    flex: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#141414',
    height: 45
  },
  areaBtn: {
    backgroundColor: '#141414',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    paddingHorizontal: 14,
    borderRadius: 4
  },
  textBtn: {
    color: '#FFF',
    fontSize: 22
  },
  logout: {
    padding: 5,
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center'
  }
})