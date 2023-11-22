const express = require("express")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const ErroThrow = require("./middleware/error.js")
const connectDatabase = require("./server.js")
const UserRouters = require("./routes/userRoutes.js")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const cors = require("cors")
const path = require("path")
// const isOnline = require("is-online")

const bannerRouters = require("./routes/bannerRouters.js")
const qureyRouters = require("./routes/queryRouter.js")
const InternShipRouter = require("./routes/internShipRouter.js")
const tryCatch = require("./controllers/utils/tryCatch.js")
const ErrorHandler = require("./utils/errorHandler.js")


process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to Uncaught Exception`)
    process.exit(1)
})


dotenv.config();
const port = process.env.PORT || 5000

const app = express();


app.use(cors());
app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
    next()
})

app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());


app.use('/api/v1', InternShipRouter)
app.use('/api/v1', UserRouters)
app.use('/api/v1', qureyRouters)


app.use(ErroThrow)

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"), (err)=>{
        res.status(500).send(err)
    })
});

app.get('/', (req, res) => res.json({ message: 'Welcome to our API' }))
app.use((req, res) => res.status(404).json({ success: false, message: 'Not Found' }))

const url = `mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASS}@cluster0.sz1ae71.mongodb.net/?retryWrites=true&w=majority`
connectDatabase(url)

const server = app.listen(port, () => console.log(`Server is listining on port : ${port}`))

process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to Unhandled promise Rejection`);
    server.close(() => {
        server.exit(1);
    })
})