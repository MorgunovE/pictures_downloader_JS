// 29-1
import firebase from 'firebase/app'
import 'firebase/storage'
// 11
import {upload} from "./upload";

// 29
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAL6A25MHcuhBfyjZhdu25s7Qcz-vaVseE",
  authDomain: "pictures-downloader.firebaseapp.com",
  projectId: "pictures-downloader",
  storageBucket: "pictures-downloader.appspot.com",
  messagingSenderId: "702867213215",
  appId: "1:702867213215:web:55c61df665e4f505eccbaa"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const storage = firebase.storage()
// console.log(storage)

upload('#file', {
  // 14
  multi: true,
  accept: ['.png', '.jpg', 'jpeg', 'gif'],
  // 23 and 35
  onUpload(files, blocks) {
    // 33 and 35-1
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`)
      const task = ref.put(file)
      task.on('stage_changed', snapshot => {
        const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
        // 35-2
        const block = blocks[index].querySelector('.preview-info-progress')
        block.textContent = percentage
        block.style.width = percentage
        // console.log(percentage)
      }, error => {
        console.log(error)
      }, () => {
        // console.log('Complete')
        // 36
        task.snapshot.ref.getDownloadURL().then(url => {
          console.log('Download url: ', url)
        })
      })
    })
    // console.log('Files', files)
  },
})
// console.log('app.js')