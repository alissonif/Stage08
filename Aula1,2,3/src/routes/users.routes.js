const { Router } = require('express')

const UsersControllers = require('../controllers/UsersControllers')

const usersRoutes = Router();


// function myMiddleware(req, res, next) {
//   console.log('my middleware')
//   if(!req.body.isAdmin){
//     return res.json({message:'user unauthorized'});
//   }
//   next();
// }


const usersControllers = new UsersControllers()

// usersRoutes.post('/', myMiddleware,usersControllers.create);
usersRoutes.post('/', usersControllers.create);
usersRoutes.put('/:id', usersControllers.update)
// usersRoutes.put("/:id", usersControllers.update)

module.exports = usersRoutes;