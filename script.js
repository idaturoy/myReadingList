//VARIABLES
const form = document.getElementById("form");
const divBookShelf = document.getElementsByClassName("bookShelf")[0];
//let myLibrary = [];
let myLibrary = JSON.parse(localStorage.getItem("myLibrary"));

import "./script-2.0.js";

//EVENT LISTENERS
document.getElementsByClassName("addBookBtn")[0].addEventListener("click", function(){
    document.getElementById("form").hidden = false;
}, false);

document.getElementById("close-btn").addEventListener("click", function(){
    document.getElementById("form").hidden = true;
}, false);

form.addEventListener("submit", e =>{
    let newBook = createNewBook();
    addBookToMyLibrary(newBook);
    addBook(newBook);
    saveToLocalStorage();
    form.reset();
    e.preventDefault();
})

// FUNCTIONS
function createNewBook(){
    /*     //Gets data from form filled by user
        let formInput = Array.from(document.querySelectorAll('#form input')).reduce((acc, input) => ({...acc, [input.id]: input.value }), {}); */
    
        const title = document.getElementById('form-title').value;
        const author = document.getElementById('form-author').value;
        const pages = document.getElementById('form-pages').value;
        const [titleCapitalized, authorCapitalized] = capitalizeNames(title, author);
    
        const newBook = new Book(titleCapitalized, authorCapitalized, pages, isChecked());
        return newBook;
}

function Book(title, author, pages, readStatus){
    this.title = title;
    this.author = author;
    this.pages = pages;
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

function addBookToMyLibrary(book){
    myLibrary.push(book);
    const currentTime = new Date();
    book.bookID = currentTime.getTime();
}

function addBook(book){
    let bookDiv = document.createElement('div');
    bookDiv.className = 'bookDiv';
    bookDiv.id = `${book.bookID}`;
    let bookInfo = document.createElement('p');
    bookInfo.className = 'bookInfo';

    bookInfo.innerHTML = `<h2>${book.title}</h2> <br> ${book.author} <br> ${book.pages} pages`;
    bookDiv.appendChild(bookInfo);
    //Create the reading status label
    let readLabel = document.createElement('label');
    readLabel.className = 'readLabel';
    readLabel.innerHTML = `${book.readStatus}`;
    if (readLabel.innerText === 'read'){
        readLabel.style.color = "green";}
    //Change the reading status of book and label color when clicked. 
    readLabel.addEventListener("click", () =>{
        if (readLabel.innerText === 'read'){
            readLabel.innerText = 'not read yet'
            readLabel.style.color = "black";
        }
        else if (readLabel.innerText === 'not read yet'){
            readLabel.innerText = 'read'
            readLabel.style.color = "green";
        };
    })
    bookDiv.appendChild(readLabel);

    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = '<i class="fas fa-trash"></i>'; 
    removeBtn.addEventListener("click", () => {
        removeBookCard(removeBtn.parentNode.id);
        removeFromMyLibrary(removeBtn.parentNode.id)
    });
    //Insert div first
    let thefirstChild = divBookShelf.firstChild;
    bookDiv.appendChild(removeBtn);

    //Finally, add the book to the bookshelf
    divBookShelf.insertBefore(bookDiv, thefirstChild);
} 

function isChecked(){
    if(document.getElementById('form-readStatus').checked){return 'read'};
    return 'not read yet'
}

function removeBookCard(bookDivID){
    document.getElementById(`${bookDivID}`).remove();
}

function removeFromMyLibrary(bookID){
    let removeIndex = myLibrary.map(item =>{
        return item.bookID;
    }).indexOf(bookID);
    
    myLibrary.splice(removeIndex, 1)
    console.log(myLibrary)
    saveToLocalStorage();
}

const saveToLocalStorage = () => {
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

window.onload = function displayMyLibrary(){
    if (myLibrary){
        for(let i = 0; i < myLibrary.length; i++){
            addBook(myLibrary[i]);
        }
    
    }else {
        let myLibrary = [];
        localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
     }
}







/* //This is for testing the display
const theHobbit = new Book('the hobbit', 'J.R.R Tolkien', 295, 'not read yet');
const book1 = new Book('sapiens', 'Yuval Noah Harari', 443, 'read');
const book2 = new Book('atomic habits', 'james clear', 320, 'not read yet');
const book3 = new Book('Los herederos de la tierra', 'Ildefonso falcones', 896, 'not read yet');

addBookToMyLibrary(theHobbit);
addBookToMyLibrary(book1);
addBookToMyLibrary(book2);
addBookToMyLibrary(book3);

// */