const form = document.getElementById('form')
const listBody = document.getElementById('listBody')
const btnConfirm = document.getElementById('comfirm')
let confirm = false

document.addEventListener('DOMContentLoaded', init)
form.addEventListener('submit', handleFromSubmit)

let listStorage = JSON.parse(localStorage.getItem('list')) || []

function init() {
  loadListFromStorage()
}
function handleFromSubmit(e) {
  e.preventDefault()
  const formData = new FormData(form)
  const data = Object.fromEntries(formData)
  data.id = Date.now().toString()
  data.currentDate = new Date().toLocaleDateString()
  addListItem(data)
  form.reset()
}

function addListItem(data) {
  if (data) {
    listStorage.push(data)
    saveLocalStorage()
    renderList(data)
  }
}
function saveLocalStorage() {
  localStorage.setItem('list', JSON.stringify(listStorage))
}

function loadListFromStorage() {
  listStorage.forEach((element) => renderList(element))
}
function renderList({ name, amount, paid, id, currentDate }) {
  const listElement = createListItem({ name, amount, paid, id, currentDate })
  listBody.appendChild(listElement)
}

function createListItem({ name, amount, paid, id, currentDate }) {
  const row = document.createElement('tr')
  row.className = 'list'
  row.id = id
  row.innerHTML = `
    <td>${name}</td>
    <td class='amount'>${amount}</td>
    <td class='paid'>${paid}</td>
    <td>${amount - paid}</td> 
    <td>${currentDate}</td> 
    <td><button class='btn btn-primary edited px-2' name='edit'>Editar</button>
    <button class='btn btn-danger delete ' name='delete'>Eliminar</button></td> 
    `
  row
    .querySelector('[name="edit"]')
    .addEventListener('click', () => handleEdit(row))
  row
    .querySelector('[name="delete"]')
    .addEventListener('click', () => handleDeleted(row))
  return row
}

function handleEdit(row) {
  const editButton = row.querySelector('[name="edit"]')
  const isEditing = editButton.textContent === 'Guardar'
  editButton.textContent = isEditing ? 'Editar' : 'Guardar'

  const amount = row.querySelector('.amount')
  const paid = row.querySelector('.paid')

  amount.contentEditable = !isEditing
  paid.contentEditable = !isEditing

  if (isEditing) {
    updateList(row.id, { amount: amount.textContent, paid: paid.textContent })
    location.reload()
  }
}
function updateList(listId, data) {
  const listElement = listStorage.find(({ id }) => id === listId)
  Object.assign(listElement, data)
  saveLocalStorage()
}
function handleDeleted(row) {
  if (window.confirm('Etas Seguro de eliminar el Elemento ')) {
    const id = row.id
    listStorage = listStorage.filter((element) => element.id !== id)
    saveLocalStorage()
    row.remove()
  }
}
