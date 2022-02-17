const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "READING_LIST";

function isStorageExist() {
    if(typeof(Storage) === undefined){
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

function generateId() {
    return +new Date();
}
 
function generateBookObject(id, title, author, year, purchasing, timestamp, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        purchasing,
        timestamp,
        isCompleted
    }
}

function addBook() {
    const textTitle = document.getElementById("inputBookTitle").value;
    const textAuthor = document.getElementById("inputBookAuthor").value;
    const numberYear = document.getElementById("inputBookYear").value;
    const datePurchasing = document.getElementById("inputBookPurchasing").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;
    const date = new Date();
    let timestamp = date.toDateString();

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textTitle, textAuthor, numberYear, datePurchasing, timestamp, isComplete);
    books.push(bookObject);
   
    clearForm();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function makeListBook(bookObject) {
    const bookTitle = document.createElement("h3");
    const title = document.createElement("span");
    title.classList.add("book_title");
    title.innerText = bookObject.title;
    bookTitle.append(title);

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Penulis : ";
    const author = document.createElement("span");
    author.classList.add("book_author");
    author.innerText = bookObject.author;
    bookAuthor.append(author);

    const bookYear = document.createElement("p");
    bookYear.innerText = "Tahun Terbit : ";
    const year = document.createElement("span");
    year.classList.add("book_year");
    year.innerText = bookObject.year;
    bookYear.append(year);

    const bookPurchasing = document.createElement("p");
    bookPurchasing.innerText = "Tanggal Pembelian : ";
    const purchasing = document.createElement("span");
    purchasing.classList.add("book_purchasing");
    purchasing.innerText = bookObject.purchasing;
    bookPurchasing.append(purchasing);

    const bookTimestamp = document.createElement("p");
    bookTimestamp.innerText = "Tanggal Input : ";
    const timestamp = document.createElement("span");
    timestamp.classList.add("book_timestamp");
    timestamp.innerText = bookObject.timestamp;
    bookTimestamp.append(timestamp);
  
    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(bookTitle, bookAuthor, bookYear, bookPurchasing, bookTimestamp);

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");
  
    const container = document.createElement("article");
    container.classList.add("book_item")
    container.append(textContainer, actionContainer);
    container.setAttribute("id", `book-${bookObject.id}`);

    if(bookObject.isCompleted){
 
        const editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", function () {
            editBook(bookObject.id);
        });

        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function () {
            undoBookFromCompleted(bookObject.id);
        });
   
        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            removeBook(bookObject.id);
        });
   
        actionContainer.append(trashButton, editButton, undoButton );

    } else {
   
        const editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", function () {
            editBook(bookObject.id);
        });

        const checkButton = document.createElement("button");
        checkButton.classList.add("checklist-button");
        checkButton.addEventListener("click", function () {
            addBookCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            removeBook(bookObject.id);
        });
   
        actionContainer.append(trashButton, editButton, checkButton);
    }

    return container;
 }

 function addBookCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
  
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId) {
    const isDelete = window.confirm("Apakah yakin ingin menghapus buku ini?");

    if (isDelete) {
        const bookTarget = findBookIndex(bookId);
        if(bookTarget === -1) return;
        books.splice(bookTarget, 1);
   
        document.dispatchEvent(new Event(RENDER_EVENT));
        alert("Buku berhasil dihapus");
        saveData();
    } else {
        alert("Buku gagal dihapus");
    }
    
}
   
function undoBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
   
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function editBook(bookId) {
    document.getElementById("bookSubmit").style.display = "none";
    document.getElementById("checkBook").style.display = "none";
    const editButton = document.getElementById("bookEdit");
    editButton.style.display = "block";
    const bookEditData = findBook(bookId);
    const dataBook = generateBookObject(bookEditData.id, bookEditData.title, bookEditData.author, bookEditData.year, bookEditData.purchasing, bookEditData.timestamp, bookEditData.isCompleted);
    document.getElementById("inputBookTitle").value = bookEditData.title;
    document.getElementById("inputBookAuthor").value = bookEditData.author;
    document.getElementById("inputBookYear").value = bookEditData.year;
    
    const EditForm = document.getElementById("inputBook");
    EditForm.addEventListener("submit", function (event) {
        event.preventDefault();
        
        const bookTarget = findBookIndex(bookId);
        if(bookTarget === -1) return;
        books.splice(bookTarget, 1);

        addEditBook(dataBook);
    });
    
}

function addEditBook(dataBook) {
    const textTitle = document.getElementById("inputBookTitle").value;
    const textAuthor = document.getElementById("inputBookAuthor").value;
    const numberYear = document.getElementById("inputBookYear").value;
    const datePurchasing = document.getElementById("inputBookPurchasing").value;
    
    const generatedID = dataBook.id;
    const timestamp = dataBook.timestamp;
    const isComplete = dataBook.isCompleted;
    const bookEditObject = generateBookObject(generatedID, textTitle, textAuthor, numberYear, datePurchasing, timestamp, isComplete);
    // books.push(bookEditObject);
   
    clearForm();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    resetButon();
}

function searchBook() {
    const searchBook = document.getElementById("searchBookTitle");
    const filter = searchBook.value.toUpperCase();
    const bookItem = document.querySelectorAll("section.book_shelf > .book_list > .book_item");
    for (let i = 0; i < bookItem.length; i++) {
        txtValue = bookItem[i].textContent || bookItem[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            bookItem[i].style.display = "";
        } else {
            bookItem[i].style.display = "none";
        }
    }
}

function findBook(bookId){
    for(bookItem of books){
        if(bookItem.id === bookId){
            return bookItem
        }
    }
    return null
}

function findBookIndex(bookId) {
    for(index in books){
        if(books[index].id === bookId){
            return index
        }
    }
    return -1
}

function checkButton() {
    const span = document.querySelector("span");
    if (inputBookIsComplete.checked) {
        span.innerText = "Selesai dibaca";
    } else {
        span.innerText = "Belum selesai dibaca";
    }
}

function resetButon() {
    document.getElementById("bookSubmit").style.display = "block";
    document.getElementById("bookEdit").style.display = "none";
    document.getElementById("checkBook").style.display = "block";
}

function clearForm() {
    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookPurchasing").value = "";
    document.getElementById("inputBookIsComplete").checked = false;
}

function saveData() {
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
        alert("Data akan disalin atau diperbaharui di lokal storage?");
    }
  }

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
   
    let data = JSON.parse(serializedData);
   
    if(data !== null){
        for(book of data){
            books.push(book);
        }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
 
    const submitForm = document.getElementById("inputBook");
    const inputSearchBook = document.getElementById("searchBook");
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");
 
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    inputSearchBook.addEventListener("keyup", function (event) {
        event.preventDefault();
        searchBook();
    });
    
    inputSearchBook.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBook();
    });
    
    inputBookIsComplete.addEventListener("input", function (event) {
        event.preventDefault();
        checkButton();
    });
    
    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById("incompleteBookshelfList");
    uncompletedBookList.innerHTML = "";

    const completedBookList = document.getElementById("completeBookshelfList");
    completedBookList.innerHTML = "";
 
    for(bookItem of books){
        const bookElement = makeListBook(bookItem);

        if(bookItem.isCompleted == false)
            uncompletedBookList.append(bookElement);
        else
            completedBookList.append(bookElement);
        
    }
 });

 document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
