import interceptor from '@/utils/interceptor'


export function getNotebookNotes(notebook_id) {
  return interceptor({
    url: 'note/getNotebookNotes',
    method: 'post',
    params: {
      notebook_id
    }
  })
}
export function getUserNotes() {
  return interceptor({
    url: 'note/getUserNotes',
    method: 'post'
  })
}
export function getShareNotes() {
  return interceptor({
    url: 'note/getShareNotes',
    method: 'post'
  })
}
export function getCollectedNotes() {
  return interceptor({
    url: 'note/getCollectedNotes',
    method: 'post'
  })
}
export function getNoteById(note_id) {
  return interceptor({
    url: 'note/getNoteById',
    method: 'post',
    params: {
      note_id
    }
  })
}
export function getNotesByTagName(tags_name){
  return interceptor({
    url: 'note/getNotesByTagName',
    method: 'post',
    params: {
      tags_name
    }
  })
}
export function addNewNote(note) {
  return interceptor({
    url: 'note/addNewNote',
    method: 'post',
    data: note
  })
}
export function updateNote(note) {
  return interceptor({
    url: 'note/updateNote',
    method: 'post',
    data: note
  })
}
export function deleteNote(note_id) {
  return interceptor({
    url: 'note/deleteNote',
    method: 'post',
    params: {
      note_id
    }
  })
}
export function checkNoteEdit(note) {
  return interceptor({
    url: 'note/checkNoteEdit',
    method: 'post',
    data: note
  })
}