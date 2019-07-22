import interceptor from '@/utils/interceptor'

export function getUserDocuments() {
  return interceptor({
    url: 'document/getUserDocuments',
    method: 'post',
  })
}

export function addDocument(newDocument) {
  return interceptor({
    url: 'document/addDocument',
    method: 'post',
    data: newDocument
  })
}

export function updateDocument(newDocument) {
  return interceptor({
    url: 'document/updateDocument',
    method: 'post',
    data: newDocument
  })
}

export function deleteDocument(doc) {
  return interceptor({
    url: 'document/deleteDocument',
    method: 'post',
    data: doc
  })
}

export function getDocById(doc_id) {
  return interceptor({
    url: 'document/getDocumentById',
    method: 'post',
    params: {
      doc_id
    }
  })
}

export function getDocPath(doc_id) {
  return interceptor({
    url: 'document/getDocumentPath',
    method: 'post',
    params: {
      doc_id
    }
  })
}

export function saveFile(file) {
  return interceptor({
    url: 'document/saveFile',
    method: 'post',
    data: file,
    headers:{'Content-Type':'multipart/form-data'}
  })
}
