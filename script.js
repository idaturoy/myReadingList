//VARIABLES
const form = document.getElementById("form");
const divBookShelf = document.getElementsByClassName("bookShelf")[0];

//EVENT LISTENERS
/* document.getElementById("addBook-btn").addEventListener("click", () => {
    document.getElementById("form").hidden = false;
}, false); */

/* document.getElementById("close-btn").addEventListener("click", function(){
    document.getElementById("form").hidden = true;
}, false); */

form.addEventListener("submit", e =>{
    let newBook = createNewBook();
    addBookToLibrary(newBook);
    addBook(newBook);
    form.reset();
    e.preventDefault();
    //document.getElementById("form").hidden = true;
})

// FUNCTIONS
function createNewBook(){
    /*     //Gets data from form filled by user
        let formInput = Array.from(document.querySelectorAll('#form input')).reduce((acc, input) => ({...acc, [input.id]: input.value }), {}); */
    
        const title = document.getElementById('form-title').value;
        const author = document.getElementById('form-author').value;
        const pages = document.getElementById('form-pages').value;
        const genre = document.getElementById('form-genre').value;
        const [titleCapitalized, authorCapitalized] = capitalizeNames(title, author);
    
        const newBook = new Book(titleCapitalized, authorCapitalized, pages, genre, isChecked());
        return newBook;
}

function Book(title, author, pages, genre, readStatus){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.genre = genre;
    this.readStatus = readStatus;
    this.bookID = undefined;
}

function capitalizeNames(title, authorName){
    //Only first letter in string
    let titleCapitalized = title[0].toUpperCase() + title.slice(1);
    //capital letter on every word in string
    let authorArray = (authorName).split(" ");
    for (let i = 0; i < authorArray.length; i++) {
        authorArray[i] = authorArray[i][0].toUpperCase() + authorArray[i].substr(1);
    }
    return [titleCapitalized, authorArray.join(" ")]
}

function addBookToLibrary(book){
    let myLibrary = getLibrary();
    myLibrary.push(book);
    const currentTime = new Date();
    book.bookID = currentTime.getTime();
    saveToLocalStorage(myLibrary);
}

function addBook(book){
    let bookDiv = document.createElement('div');
    bookDiv.className = 'bookDiv';
    bookDiv.id = `${book.bookID}`;
    let bookInfo = document.createElement('p');
    bookInfo.className = 'bookInfo';

    bookInfo.innerHTML = `<b>${book.title}</b> <br> ${book.author} <br> ${book.genre} <br> ${book.pages} pages`;
    bookDiv.appendChild(bookInfo);
    
    let featureDiv = document.createElement('div');
    featureDiv.className = 'featureDiv';

    let readLabel = document.createElement('label');
    readLabel.className = 'readLabel';
    readLabel.innerHTML = `${book.readStatus}`;
    if (readLabel.innerText === 'read'){
        readLabel.style.color = "green";}
 
    readLabel.addEventListener("click", () =>{
        if (readLabel.innerText === 'read'){
            readLabel.innerText = 'not read yet';
            readLabel.style.color = "black";
        }
        else if (readLabel.innerText === 'not read yet'){
            readLabel.innerText = 'read';
            readLabel.style.color = "green";
        };

        toggleReadStatus(removeBtn.parentNode.parentNode.id, readLabel.innerText);
    })
    featureDiv.appendChild(readLabel);

    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = '<i class="fas fa-trash"></i>'; 
    removeBtn.addEventListener("click", () => {
        removeBookCard(removeBtn.parentNode.parentNode.id);
        removeFromLibrary(removeBtn.parentNode.parentNode.id)
    });
    //Insert div at beginning
    //const addBtnDiv = document.getElementById("addBook-btn");
    featureDiv.appendChild(removeBtn);
    bookDiv.appendChild(featureDiv);
    //Finally, add the book to the bookshelf
    divBookShelf.appendChild(bookDiv);
} 

function isChecked(){
    if(document.getElementById('form-readStatus').checked){return 'read'};
    return 'not read yet'
}

function getBookIndex(bookDivID){
    let myLibrary = getLibrary();
    return myLibrary.map(book =>{
        return book.bookID;
    }).indexOf(Number(bookDivID));
}

function removeBookCard(bookDivID){
    document.getElementById(`${bookDivID}`).remove();
}

function removeFromLibrary(bookDivID){
    let removeIndex = getBookIndex(bookDivID);
    let myLibrary = getLibrary();
    myLibrary.splice(removeIndex, 1)
    saveToLocalStorage(myLibrary);
}

function toggleReadStatus(bookDivID, newStatus){
    const indexBookToToggle = getBookIndex(bookDivID);
    let myLibrary = getLibrary();
    myLibrary[indexBookToToggle].readStatus = newStatus;
    saveToLocalStorage(myLibrary);
}

function getLibrary(){
    let myLibrary;
    if(localStorage.getItem('myLibrary') === null){
        myLibrary = [];
    }else{
        myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
    }
    return myLibrary;
}

const saveToLocalStorage = (libraryToStore) => {
    localStorage.setItem("myLibrary", JSON.stringify(libraryToStore));
}

window.onload = function displayLibrary(){
    let myLibrary = getLibrary();
    if (myLibrary !== null){
        for(let i = 0; i < myLibrary.length; i++){
            addBook(myLibrary[i]);
        }
    }
}