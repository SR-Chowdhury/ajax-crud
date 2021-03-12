import '../styles/index.scss';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/contacts';

window.onload = () => {

    let tbody = document.querySelector('#tbody');

    axios.get(BASE_URL)
        .then((response) => {
            response.data.forEach(element => {
                createTRElement(element, tbody);
            });
        })
        .catch((err) => console.log(err))
    
    let saveContact = document.querySelector('#saveContact'); 
    saveContact.addEventListener('click', () => {
        createNewContact();
    });        

}

// Create New Contact
function createNewContact() {

    let nameField = document.querySelector('#nameField');
    let phoneField = document.querySelector('#phoneField');
    let emailField = document.querySelector('#emailField');

    let contact = {
        name: nameField.value,
        phone: phoneField.value,
        email: emailField.value
    }

    axios.post(BASE_URL, contact)
        .then((response) => {

            let tbody = document.querySelector('#tbody');
            createTRElement(response.data, tbody);
            nameField.value = '',
            phoneField.value = '',
            emailField.value = ''
        })
        .catch((err) => console.log(err))

}


// Create a TR element and appending to it's parent element
function createTRElement (contact, tbody) {

    let TR = document.createElement('tr');

    const tdName = document.createElement('td');
    const tdPhone = document.createElement('td');
    const tdEmail = document.createElement('td');
    const tdActions = document.createElement('td');
    const tdEditBtn = document.createElement('button');
    const tdDeleteBtn = document.createElement('button');

    tdName.innerHTML = contact.name ? contact.name : 'N/A';
    tdPhone.innerHTML = contact.phone ? contact.phone : 'N/A';
    tdEmail.innerHTML = contact.email ? contact.email : 'N/A';

    TR.appendChild(tdName);
    TR.appendChild(tdPhone);
    TR.appendChild(tdEmail);

    tdEditBtn.className = 'btn btn-warning';
    tdEditBtn.innerHTML = 'Edit';
    tdEditBtn.addEventListener('click', () => {
        // console.log(contact.id);
        let mainModal = $('#contactEditModal')
        mainModal.modal('toggle');

        let editName = document.querySelector('#edit-name');
        let editPhone = document.querySelector('#edit-phone');
        let editEmail = document.querySelector('#edit-email');

        editName.value = contact.name;
        editPhone.value = contact.phone ? contact.phone: '';
        editEmail.value = contact.email ? contact.email: '';

        let updateContact = document.querySelector('#updateContact');  
        
        updateContact.addEventListener('click', () => {
            console.log(' i am clicked')

            axios.put(`${BASE_URL}/${contact.id}`, {
                name: editName.value,
                phone: editPhone.value,
                email: editEmail.value
            })
                .then((res) => {
                    tdName.innerHTML = res.data.name,
                    tdPhone.innerHTML = res.data.phone, 
                    tdEmail.innerHTML = res.data.email
                    mainModal.modal('hide');
                })
                .catch((err) => console.log(err))
        });

    });
    tdActions.appendChild(tdEditBtn);

    tdDeleteBtn.className = 'btn btn-danger mx-2';
    tdDeleteBtn.innerHTML = 'Delete';
    tdDeleteBtn.addEventListener('click', () => {
        // console.log(contact.id);
        axios.delete(`${BASE_URL}/${contact.id}`)
            .then((response) => {
                tbody.removeChild(TR);
            })
            .catch((err) => console.log(err))
    });
    tdActions.appendChild(tdDeleteBtn);

    TR.appendChild(tdActions);

    tbody.appendChild(TR);
}
