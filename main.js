document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form')
  const listBody = document.getElementById('listBody')
  let listStorage = JSON.parse(localStorage.getItem('list')) || []
  function init() {
    loadStorage()
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    let id = Date.now().toString()
    let date = new Date()
    let currentDate = date.toLocaleDateString()
    const data = Object.fromEntries(new FormData(e.target))
    const { name, amount, paid } = data
    const listItem = createListItem(name, amount, paid, id, currentDate)
    addListItem(listItem)
  })

  function addListItem(list) {
    if (list.listElement) {
      listStorage = [...listStorage, list]
      listBody.append(list.listElement)
      saveLocalStorage()
    }
  }
  function createListItem(name, amount, paid, id, currentDate) {
    if (!name || !amount || !paid) return
    const listElement = document.createElement('tr')
    listElement.id = id
    listElement.innerHTML = `
    <td>${name}</td>
    <td>${amount}</td>
    <td>${paid}</td>
    <td>${amount - paid}</td> 
    <td>${currentDate}</td> 
    `
    return { listElement, name, amount, paid, id, currentDate }
  }
  function saveLocalStorage() {
    localStorage.setItem('list', JSON.stringify(listStorage))
  }
  function loadStorage() {
    listStorage.forEach(({ name, amount, paid, id, currentDate }) => {
      let { listElement } = createListItem(name, amount, paid, id, currentDate)
      if (listElement) {
        listBody.append(listElement)
      }
    })
  }
  init()
})
