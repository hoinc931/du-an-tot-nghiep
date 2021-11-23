var express = require('express');
var router = express.Router();

const categoryBlogController = require('../app/controllers/categoryBlogController');
const { checkLogin, checkAuthe } = require('../app/validator/methodCommon');

router.post('/add', checkLogin, checkAuthe(1), categoryBlogController.createCategoryBlog);
router.put('/:idCategoryBlog/update', checkLogin, checkAuthe(1), categoryBlogController.editCategoryBlog);
router.delete('/:idCategoryBlog/delete', checkLogin, checkAuthe(1), categoryBlogController.deleteCategoryBlog);

router.get("/", categoryBlogController.index);

module.exports = router;