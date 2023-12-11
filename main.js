document.addEventListener("DOMContentLoaded", function () {
    const bookshelf = {
        incomplete: document.getElementById("incompleteBookshelfList"),
        complete: document.getElementById("completeBookshelfList"),
    };

    function addBookToShelf(book, loadFromStorage = false) {
        const newBookElement = createBookElement(book, loadFromStorage);
        const targetShelf = book.isComplete ? bookshelf.complete : bookshelf.incomplete;

        targetShelf.appendChild(newBookElement);
        saveBooksToLocalStorage();
    }

    function createBookElement(book, loadFromStorage = false) {
        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item");
        bookItem.setAttribute("data-id", book.id);

        const bookTitle = document.createElement("h3");
        bookTitle.innerText = book.title;

        const bookAuthor = document.createElement("p");
        bookAuthor.innerText = `Penulis: ${book.author}`;

        const bookYear = document.createElement("p");
        bookYear.innerText = `Tahun: ${book.year}`;

        const bookAction = document.createElement("div");
        bookAction.classList.add("action");

        const toggleButton = document.createElement("button");
        toggleButton.classList.add("green");
        toggleButton.innerText = loadFromStorage
            ? book.isComplete
                ? "Belum selesai dibaca"
                : "Selesai dibaca"
            : book.isComplete
                ? "Belum selesai dibaca"
                : "Selesai dibaca";
        toggleButton.addEventListener("click", function () {
            toggleBookStatus(book);
        });

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("red");
        deleteButton.innerText = "Hapus buku";
        deleteButton.addEventListener("click", function () {
            deleteBook(book);
        });

        bookAction.appendChild(toggleButton);
        bookAction.appendChild(deleteButton);

        bookItem.appendChild(bookTitle);
        bookItem.appendChild(bookAuthor);
        bookItem.appendChild(bookYear);
        bookItem.appendChild(bookAction);

        return bookItem;
    }

    function toggleBookStatus(book) {
        const targetShelf = book.isComplete ? "incomplete" : "complete";
        moveBook(book, targetShelf);
        saveBooksToLocalStorage();
    }

    function deleteBook(book) {
        const currentShelfElement = book.isComplete
            ? bookshelf.complete
            : bookshelf.incomplete;
        const bookElement = currentShelfElement.querySelector(
            `.book_item[data-id="${book.id}"]`
        );
        currentShelfElement.removeChild(bookElement);

        saveBooksToLocalStorage();
    }

    function clearBookshelf() {
        bookshelf.incomplete.innerHTML = "";
        bookshelf.complete.innerHTML = "";
        saveBooksToLocalStorage();
    }

    function loadBooksFromLocalStorage() {
        const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
        storedBooks.forEach((book) => addBookToShelf(book));
    }

    function saveBooksToLocalStorage() {
        const books = [];
        const allBooks = document.querySelectorAll(".book_item");

        allBooks.forEach((bookElement) => {
            const book = {
                id: bookElement.getAttribute("data-id"),
                title: bookElement.querySelector("h3").innerText,
                author: bookElement.querySelector("p:nth-child(2)").innerText.replace("Penulis: ", ""),
                year: parseInt(bookElement.querySelector("p:nth-child(3)").innerText.replace("Tahun: ", "")),
                isComplete: bookElement.querySelector(".green").innerText === "Belum selesai dibaca",
            };

            books.push(book);
        });

        localStorage.setItem("books", JSON.stringify(books));
    }

    function displayBooks() {
        loadBooksFromLocalStorage();
    }

    function addNewBook(title, author, year, isComplete) {
        const newBook = {
            id: +new Date(),
            title: title,
            author: author,
            year: year,
            isComplete: isComplete,
        };

        addBookToShelf(newBook);
    }

    const form = document.getElementById("inputBook");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("inputBookTitle").value;
        const author = document.getElementById("inputBookAuthor").value;
        const year = document.getElementById("inputBookYear").value;
        const isComplete = document.getElementById("inputBookIsComplete").checked;

        if (title && author && year) {
            addNewBook(title, author, parseInt(year), isComplete);
            form.reset();
        } else {
            alert("Please fill in all the required fields.");
        }
    });

    function moveBook(book, targetShelf) {
        const currentShelfElement = book.isComplete
            ? bookshelf.complete
            : bookshelf.incomplete;
        const bookElement = currentShelfElement.querySelector(
            `.book_item[data-id="${book.id}"]`
        );

        currentShelfElement.removeChild(bookElement);
        book.isComplete = targetShelf === "complete";

        addBookToShelf(book);
    }

    const searchForm = document.getElementById("searchBook");
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const searchTerm = document.getElementById("searchBookTitle").value.toLowerCase();
        searchBooksByTitle(searchTerm);
    });

    function searchBooksByTitle(searchTerm) {
        const allBooks = document.querySelectorAll(".book_item");

        allBooks.forEach((bookElement) => {
            const title = bookElement.querySelector("h3").innerText.toLowerCase();
            const isMatch = title.includes(searchTerm);

            if (isMatch) {
                bookElement.style.display = "block";
            } else {
                bookElement.style.display = "none";
            }
        });
    }

    displayBooks();
});