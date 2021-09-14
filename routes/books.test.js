process.env.NODE_ENV = "test"

const request = require("supertest")
const app = require("../app")
const db = require("../db")

let book_isbn

beforeEach(async () => {
    let result = await db.query(
        `INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
        VALUES ('9780147517388', 'https://www.amazon.com/dp/0147517389/ref=olp_aod_redir_impl1?_encoding=UTF8&aod=1', 'Lev Grossman', 'English', 1280, 'Pengiun Books', 'The Magicians Trilogy Boxed Set', 2015)
        RETURNING isbn`)

    book_isbn = result.rows[0].isbn
})

describe("POST /books", function () {
    test("Creates a new book", async function () {
        const result = await request(app).post('/books').send({
            isbn: '11111111111',
            amazon_url: 'https://www.amazon.com/',
            author: 'Test 1',
            language: 'English',
            pages: 1,
            publisher: 'Test',
            title: 'Test 1',
            year: 2021
        })
        console.log(result.error)
        expect(result.statusCode).toBe(201)
        expect(result.body.book).toHaveProperty('isbn')
    })
})

afterEach(async () => {
    await db.query('DELETE FROM books')
})

afterAll(async () => {
    await db.end()
})
