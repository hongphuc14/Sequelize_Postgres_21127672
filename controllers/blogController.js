const controller = {};
const models = require('../models');

const page_blog = 3; 
controller.showList = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * page_blog;
    const totalBlogs = await models.Blog.count();
    const totalPages = Math.ceil(totalBlogs / page_blog);

    const blogs = await models.Blog.findAll({
        attributes: ["id", "title", "imagePath", "summary", "createdAt"],
        include: [
            { model: models.Comment }
        ],
        limit: page_blog,
        offset: offset
    });
    
    res.locals.blogs = blogs;
    res.locals.currentPage = page;
    res.locals.totalPages = totalPages;
    
    res.locals.categories = await models.Category.findAll({
        attributes: ["id", "name"],
        include: [{ model: models.Blog}]
    });

    res.locals.tags = await models.Tag.findAll({ 
        attributes: ["id", "name"],
    });

    res.render("index");
    
}

controller.showDetails = async(req, res) => {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
    console.log("details");
    res.locals.blog = await models.Blog.findOne({
        attributes: ["id", "title", "description", "createdAt"],
        where: { id: id },
        include: [
            {model: models.Category},
            {model: models.User},
            {model: models.Tag},
            {model: models.Comment},
        ]
    })

    res.locals.categories = await models.Category.findAll({
        attributes: ["id", "name"],
        include: [{ model: models.Blog}]
    });

    res.locals.tags = await models.Tag.findAll({  
        attributes: ["id", "name"],
    });

    res.render("details");
}

controller.showByCategory = async (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    
    res.locals.blogs = await models.Blog.findAll({
        attributes: ["id", "title", "imagePath", "summary", "createdAt"],
        include: [{ model: models.Comment }],
        where: { categoryId: categoryId }
    });
    
    res.locals.categories = await models.Category.findAll({
        attributes: ["id", "name"],
        include: [{ model: models.Blog}]
    });

    res.locals.selectedCategoryId = categoryId;

    res.locals.tags = await models.Tag.findAll({  
        attributes: ["id", "name"],
    });
    res.render("index");
}

controller.showByTag = async (req, res) => {
    const tagId = parseInt(req.params.tagId);
    
    res.locals.blogs = await models.Blog.findAll({
        attributes: ["id", "title", "imagePath", "summary", "createdAt"],
        include: [
            { model: models.Comment },
            {
                model: models.Tag,
                through: { attributes: [] },
                where: { id: tagId }, 
            },],
    });
    
    res.locals.categories = await models.Category.findAll({
        attributes: ["id", "name"],
        include: [{ model: models.Blog}]
    });

    res.locals.tags = await models.Tag.findAll({  
        attributes: ["id", "name"],
    });

    res.locals.selectedTagId = tagId;
    res.render("index");
}

const { Op } = require('sequelize');
controller.search = async (req, res) => {
    const query = req.query.q;
    const blogs = await models.Blog.findAll({
        attributes: ["id", "title", "imagePath", "summary", "createdAt"],
        include: [
            { model: models.Comment }
        ],
        where: {
            [Op.or]: [
                { [Op.iLike]: `%${query}%` } 
            ],
        },
    });
    
    res.locals.blogs = blogs;
    res.locals.categories = await models.Category.findAll({
        attributes: ["id", "name"],
    });

    res.locals.tags = await models.Tag.findAll({
        attributes: ["id", "name"],
    });

    res.render("index");
}


module.exports = controller;