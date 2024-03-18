const path = require("path");
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const Blog = require('./models/blogs');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = 8000;

mongoose.connect('mongodb://localhost:27017/bloggo').then(() => console.log('mongodb connected'));

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.static(path.join(process.cwd(), "/public"))); // Mount express.static middleware first

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});
app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, () => console.log(`server started at PORT: ${PORT}`));
