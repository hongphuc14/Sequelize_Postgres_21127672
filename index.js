const express = require("express");
const app = express();
const port = 4000;
const expressHbs = require('express-handlebars');
const Handlebars = require('handlebars');
app.use(express.static(__dirname + "/html"));

Handlebars.registerHelper('pagination', function(currentPage, totalPages, options) {
    let html = '<div class="product__pagination blog__pagination">';

    if (totalPages > 1) {
        if (currentPage > 1) {
            html += `<a href="/blogs?page=${currentPage - 1}"><i class="fa fa-long-arrow-left"></i></a>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            html += `<a href="/blogs?page=${i}" ${currentPage === i ? 'class="active"' : ''}>${i}</a>`;
        }

        if (currentPage < totalPages) {
            html += `<a href="/blogs?page=${currentPage + 1}"><i class="fa fa-long-arrow-right"></i></a>`;
        }
    }

    html += '</div>';
    return new Handlebars.SafeString(html);
});

app.engine('hbs', expressHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    defaultLayout: "layout",
    extname: "hbs",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        showDate: (date) =>{
            if(!date){
                return "N/A";
            }
            return date.toLocaleDateString('en-US', {
                year: "numeric",
                month: "long",
                day: "numeric"
            })
        }
    }
}))
app.set("view engine", "hbs");

app.get("/", (req, res) => res.redirect("/blogs"));
app.use('/blogs/search', require('./routes/blogRouter'));
app.use('/blogs', require('./routes/blogRouter'));
app.get("/blogs/category/:categoryId", (req, res) => {
    const categoryId = req.params.categoryId;
    res.redirect(`/blogs/category/${categoryId}`);
});
app.get("/blogs/tag/:tagId", (req, res) => {
    const tagId = req.params.tagId;
    res.redirect(`/blogs/tag/${tagId}`);
});


app.get("/createTable", (req, res) => {
    let models = require("./models");
    models.sequelize.sync().then(() =>{
        res.send("Tables created!");
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));