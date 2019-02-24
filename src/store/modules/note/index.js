import * as noteJs from '@/api/note'

const state = {
  
}
const getters = {

}
const mutations = {}

const actions = {
  GetNotebookNotes({commit},notebook_id){
    return new Promise((resolve,reject) =>{
      noteJs.getNotebookNotes(notebook_id).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  GetUserNotes({commit}){
    return new Promise((resolve,reject) =>{
      noteJs.getUserNotes().then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  GetCollectedNotes({commit}){
    return new Promise((resolve,reject) =>{
      noteJs.getCollectedNotes().then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  GetNoteById({commit},note_id){
    return new Promise((resolve,reject) =>{
      noteJs.getNoteById(note_id).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  AddNewNote({commit},newNote){
    return new Promise((resolve,reject) =>{
      noteJs.addNewNote(newNote).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  UpdateNote({commit},newNote){
    return new Promise((resolve,reject) =>{
      noteJs.updateNote(newNote).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  DeleteNote({commit},note_id){
    return new Promise((resolve,reject) => {
      noteJs.deleteNote(note_id).then(res =>{
        // console.loh(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  CheckNoteEdit({commit},note){
    return new Promise((resolve,reject) => {
      noteJs.checkNoteEdit(note).then(res =>{
        // console.loh(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}