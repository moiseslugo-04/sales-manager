const form = document.getElementById('form')
const listBody = document.getElementById('listBody')
const btnConfirm = document.getElementById('comfirm')
let confirm = false
btnConfirm.addEventListener('click', confirmDeleted)
form.addEventListener('submit', getDataForm)
document.addEventListener('DOMContentLoaded', init)
let listStorage = JSON.parse(localStorage.getItem('list')) || []
function init() {
  loadStorage()
}
function getDataForm(e) {
  e.preventDefault()
  let date = new Date()
  const data = Object.fromEntries(new FormData(e.target))
  data.id = Date.now().toString()
  data.currentDate = date.toLocaleDateString()
  const { name, amount, paid, id, currentDate } = data
  const listItem = createListItem(name, amount, paid, id, currentDate)
  addListItem(listItem)
  e.target.reset()
}
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
  listElement.className = 'list'
  listElement.id = id
  listElement.innerHTML = `
    <td>${name}</td>
    <td class='amount'>${amount}</td>
    <td class='paid'>${paid}</td>
    <td>${amount - paid}</td> 
    <td>${currentDate}</td> 
    <td><button class='btn btn-primary edited px-2' name='edit'>Editar</button>
    <button class='btn btn-danger delete ' name='delete'>Eliminar</button></td> 
    `
  handleButtons(listElement)
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
function handleButtons(element) {
  const btnDelete = element.querySelector('.delete')
  const btnEdited = element.querySelector('.edited')
  btnDelete.addEventListener('click', handelModal)
  btnEdited.addEventListener('click', editedElement)
}
function handelModal(e) {
  const element = e.target.closest('.list')
  e.target.setAttribute('data-bs-target', '#staticBackdrop')
  e.target.setAttribute('data-bs-toggle', 'modal')
  let spanId = document.querySelector('#idModalElement')
  spanId.textContent = element.id
}
function deletedElement(button) {
  console.log(button)
  button.setAttribute('data-bs-dismiss', 'modal')
  let idElement = document.getElementById('idModalElement').textContent
  let element = document.getElementById(idElement)
  listStorage = listStorage.filter(({ id }) => id !== idElement)
  element.remove()
  saveLocalStorage()
}

function confirmDeleted({ target }) {
  return true
}
function handelDeleted(e, element) {}
function editedElement(e) {
  e.target.textContent =
    e.target.textContent === 'Editar' ? 'Guardar' : 'Editar'
  const element = e.target.closest('.list')
  let elementIndex = listStorage.findIndex((list) => list.id === element.id)
}
