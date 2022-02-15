const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
 
    const submitForm = document.getElementById("inputBook");
 
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });
});

function addBook() {
    const textTitle = document.getElementById("inputBookTitle").value;
    const textAuthor = document.getElementById("inputBookAuthor").value;
    const numberYear = document.getElementById("inputBookYear").value;
    const datePurchasing = document.getElementById("inputBookPurchasing").value;
    const date = new Date();
    let timestamp = date.toDateString();

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textTitle, textAuthor, numberYear, datePurchasing, timestamp, false);
    books.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
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
            removeTaskFromCompleted(bookObject.id);
        });

        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function () {
            undoTaskFromCompleted(bookObject.id);
        });
   
        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            removeTaskFromCompleted(bookObject.id);
        });
   
        actionContainer.append(editButton, undoButton, trashButton);

    } else {
   
        const editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", function () {
            removeTaskFromCompleted(bookObject.id);
        });

        const checkButton = document.createElement("button");
        checkButton.classList.add("checklist-button");
        checkButton.addEventListener("click", function () {
            addBookCompleted(bookObject.id);
        });
   
        actionContainer.append(editButton, checkButton);
    }

    return container;
 }

 function addBookCompleted(bookId) {
 
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
  
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(bookId){
    for(bookItem of books){
        if(bookItem.id === bookId){
            return bookItem
        }
    }
    return null
}

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
    const uncompletedBookList = document.getElementById("incompleteBookshelfList");
    uncompletedBookList.innerHTML = "";
 
    for(bookItem of books){
        const bookElement = makeListBook(bookItem);
        uncompletedBookList.append(bookElement);
    }
 });
