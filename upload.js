// 19
function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (!bytes) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

// 22
const element = (tag, classes = [], content) => {
  const node = document.createElement(tag)
  if (classes.length) {
    node.classList.add(...classes)
  }
  if (content) {
    node.textContent = content
  }
  return node
}

// 24-1
function noop() {
}

// console.log('upload.js')
// 10 and 15
export function upload(selector, options = {}) {
  // 20-3
  let files = []
  // 24
  const onUpload = options.onUpload ?? noop
  const input = document.querySelector(selector)
  // 16
  // const preview = document.createElement('div')
  // preview.classList.add('preview')
  //22-1
  const preview = element('div', ['preview'])
  
  // const open = document.createElement('button')
  // open.classList.add('btn')
  // 22-2
  const open = element('button', ['btn'], 'Open')
  const upload = element('button', ['btn', 'btn-primary'], 'Download')
  upload.style.display = 'none'
  
  open.textContent = 'Open'
  // 15-1
  if (options.multi) {
    input.setAttribute('multiple', true)
  }
  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(','))
  }
  // 16-1
  input.insertAdjacentElement('afterend', preview)
  // 22-3
  input.insertAdjacentElement('afterend', upload)
  
  input.insertAdjacentElement('afterend', open)
  
  // 13-1
  const triggerInput = () => input.click()
  // 13-3
  const changeHandler = event => {
    // console.log(event.target.files)
    if (!event.target.files.length) {
      return
    }
    // 20-4
    files = Array.from(event.target.files)
    // console.log(Array.isArray(files))
    preview.innerHTML = ''
    // 22-6
    upload.style.display = 'inline'
    files.forEach(file => {
      // console.log(file)
      if (!file.type.match('image')) {
        return
      }
      const reader = new FileReader()
      reader.onload = ev => {
        // console.log(ev.target.result)
        const src = ev.target.result
        // input.insertAdjacentHTML('afterend', `<img src="${ev.target.result}" />`)
        // 19-1 and 20
        preview.insertAdjacentHTML('afterbegin', `
          <div class='preview-image'>
            <div class="preview-remove" data-name="${file.name}">&times;</div>
            <img src="${src}" alt="${file.name}"/>
            <div class="preview-info">
              <span>${file.name}</span>
              ${bytesToSize(file.size)}
            </div>
          </div>
        `)
      }
      reader.readAsDataURL(file)
    })
  }
  // 20-2
  const removeHandler = event => {
    // console.log('event', event.target.dataset)
    if (!event.target.dataset.name) {
      return
    }
    const {name} = event.target.dataset
    // console.log(files)
    // 20-5
    files = files.filter(file => file.name !== name)
    // 22-7
    if (!files.length) {
      upload.style.display = 'none'
    }
    const block = preview
      .querySelector(`[data-name="${name}"]`)
      .closest('.preview-image')
    // console.log(block)
    block.classList.add('removing')
    setTimeout(() => block.remove(), 300)
    // block.remove()
  }
  // 24-3
  const clearPreview = el => {
    el.style.bottom = '4px'
    el.innerHTML = '<div class="preview-info-progress"></div>'
  }
  // 22-5
  const uploadHandler = () => {
    // 24-2
    preview.querySelectorAll('.preview-remove').forEach(e => e.remove())
    const previewInfo = preview.querySelectorAll('.preview-info')
    previewInfo.forEach(clearPreview)
    // 34
    onUpload(files, previewInfo)
  }
  // 13
  open.addEventListener('click', triggerInput)
  // 13-2
  input.addEventListener('change', changeHandler)
  // 20-1
  preview.addEventListener('click', removeHandler)
  // 22-4
  upload.addEventListener('click', uploadHandler)
}