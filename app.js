
const cafeList = document.getElementById("cafe-list")
// create element and render cafe
const renderCafe = (doc) => {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id)
    name.textContent = doc.data().name
    city.textContent = doc.data().city
    cross.textContent = 'x'

    li.appendChild(name)
    li.appendChild(city)
    li.appendChild(cross)

    cafeList.appendChild(li)

    // deleting data .delete()
    cross.addEventListener('click', (e) => {
        e.stopPropagation()
        let id = e.target.parentElement.getAttribute('data-id')
        db.collection('cafes').doc(id).delete()
    })

}

// get reference to the cafe collection; .get()
// filter the data where()
// ordered data orderBy()

db.collection('cafes').get() //this is an async request and gives us the snapshot object
    .then((snapshot) => {
        snapshot.docs.forEach(doc => {
            renderCafe(doc);

        })
    })
// let c = 'adst'
// db.collection('cafes').where('city', '==', c).orderBy('name').get() //this is an async request and gives us the snapshot object
//     .then((snapshot) => {
//         snapshot.docs.forEach(doc => {
//             renderCafe(doc);

//         })
//     })




// adding data; .add()
const form = document.getElementById("add-cafe-form")
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = ""
    form.city.value = ""
})

//real-time listener .onSnapshot()
db.collection('cafes').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderCafe(change.doc)
        } else if (change.type == 'removed') {
            let li = cafeList.querySelector(`[data-id=${change.doc.id}]`)
            cafeList.removeChild(li)
        }
    })
})
