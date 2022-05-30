//Refactoring using jQuery
//Add page count
//Collaps when books is read
//Fix add new book button
//Book recommendation based on books you have read (API to Goodread) https://www.programmableweb.com/news/10-most-popular-apis-books-2022/brief/2020/01/26


//VARIABLES
const form = document.getElementById("form");
const currentBooks = document.getElementsByClassName("currentBooks")[0];
const pastBooks = document.getElementsByClassName("pastBooks")[0];
const futureBooks = document.getElementsByClassName("futureBooks")[0];

//EVENT LISTENERS
/* document.getElementById("addBook-btn").addEventListener("click", () => {
    document.getElementById("form").hidden = false;
}, false); */

/* document.getElementById("close-btn").addEventListener("click", function(){
    document.getElementById("form").hidden = true;
}, false); */

form.addEventListener("submit", e =>{
    let newBook = createNewBook();
    stableBookOnShelf(newBook);
    stableBook(newBook);
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
    const readStatus = document.getElementById('form-readStatus').checked;  
    const bookID = new Date().getTime();
    const newBook = new Book(title, author, pages, genre, readStatus, bookID);
    const [titleCapitalized, authorCapitalized] = newBook.capitalizeNames(title, author);
    newBook.title = titleCapitalized;
    newBook.author = authorCapitalized;
    return newBook;
}

class Book {
    constructor(title, author, pages, genre, readStatus, bookID){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.genre = genre;
    this.readStatus = readStatus;
    this.bookID = bookID;
    }
    
    capitalizeNames(){
        //Only first letter in string
        let titleCapitalized = this.title[0].toUpperCase() + this.title.slice(1);
        //capital letter on every word in string
        let authorArray = (this.author).split(" ");
        for (let i = 0; i < authorArray.length; i++) {
            authorArray[i] = authorArray[i][0].toUpperCase() + authorArray[i].substr(1);
        }
        return [titleCapitalized, authorArray.join(" ")]
    }

    getReadStatus(){
        return this.readStatus;
    }
    //Set read status for presentation
    setReadStatus(){
        if (this.readStatus) {
            return 'read';
        }else{
            return 'not read';
        }
    }
}


//Init book in library memory
function stableBookOnShelf(book){
    let myBooks = getLibrary();
    myBooks.push(book);
    saveToLocalStorage(myBooks);
}

function stableBook(book){
    let bookDiv = document.createElement('div');
    bookDiv.className = 'bookDiv';
    bookDiv.id = `${book.bookID}`;
    let bookInfo = document.createElement('p');
    bookInfo.className = 'bookInfo';

    bookInfo.innerHTML = `<b>${book.title}</b> by ${book.author} <br> Pages: ${book.pages} <br> ${book.genre} `;
    bookDiv.appendChild(bookInfo);
    
    let featureDiv = document.createElement('div');
    featureDiv.className = 'featureDiv';

    let readLabel = document.createElement('label');
    readLabel.className = 'readLabel';
    //readLabel.innerHTML = book.readStatus;
    if (book.readStatus === true){
        readLabel.innerHTML = 'read';
        readLabel.style.color = "green";
    }else{
        readLabel.innerHTML = 'not read yet';
        readLabel.style.color = "black"; 
    }
 
    readLabel.addEventListener("click", () =>{
        if (readLabel.innerText === 'read'){
            readLabel.innerText = 'not read yet';
            readLabel.style.color = "black";
        }
        else if (readLabel.innerText === 'not read yet'){
            readLabel.innerText = 'read';
            readLabel.style.color = "green";
            bookDiv.style.background = 'darken($primary-color, 10%)';

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
    //Finally, add the book to correct bookshelf
        switch (book.getReadStatus) {
        case 0:
            currentBooks.appendChild(bookDiv);
            break;
        case 1:
            pastBooks.appendChild(bookDiv);
            break;
        default:
            futureBooks.appendChild(bookDiv);
            break;
    }
    //divBookShelf.appendChild(bookDiv);
} 

function isChecked(){
    if(document.getElementById('form-readStatus').checked){return 'read'};
    return 'not read yet'
}

function getBookIndex(bookDivID){
    let myBooks = getLibrary();
    return myBooks.map(book =>{
        return book.bookID;
    }).indexOf(Number(bookDivID));
}

function removeBookCard(bookDivID){
    document.getElementById(`${bookDivID}`).remove();
}

function removeFromLibrary(bookDivID){
    let removeIndex = getBookIndex(bookDivID);
    let myBooks = getLibrary();
    myBooks.splice(removeIndex, 1)
    saveToLocalStorage(myBooks);
}

function toggleReadStatus(bookDivID, newStatus){
    const indexBookToToggle = getBookIndex(bookDivID);
    let myBooks = getLibrary();
    myBooks[indexBookToToggle].readStatus = newStatus;
    saveToLocalStorage(myBooks);
}

function getLibrary(){
    let myBooks = [];
    if(localStorage.getItem('myBooks') === null){
        return myBooks;
    }else{
        return JSON.parse(localStorage.getItem("myBooks"));
    }
}

const saveToLocalStorage = (libraryToStore) => {
    localStorage.setItem("myBooks", JSON.stringify(libraryToStore));
}

window.onload = function displayLibrary(){
    let myBooks = getLibrary();
    if (myBooks !== null){
        for(let i = 0; i < myBooks.length; i++){
            stableBook(myBooks[i]);
        }
    }
}