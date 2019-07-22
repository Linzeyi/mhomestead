import * as docJs from '@/api/document'

const state = {
  
}
const getters = {

}
const mutations = {}

const actions = {
  GetUserDocuments({commit}){
    return new Promise((resolve,reject) =>{
      docJs.getUserDocuments().then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  AddDocument({commit},newDocument){
    return new Promise((resolve,reject) =>{
      docJs.addDocument(newDocument).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  UpdateDocument({commit},newDocument){
    return new Promise((resolve,reject) =>{
      docJs.updateDocument(newDocument).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  GetDocById({commit},doc_id){
    return new Promise((resolve,reject) =>{
      docJs.getDocById(doc_id).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  DeleteDocument({commit},doc){
    return new Promise((resolve,reject) =>{
      docJs.deleteDocument(doc).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  GetDocPath({commit},doc_id){
    return new Promise((resolve,reject) =>{
      docJs.getDocPath(doc_id).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  SaveFile({commit},file){
    return new Promise((resolve,reject) =>{
      docJs.saveFile(file).then(res =>{
        // console.log(res)
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