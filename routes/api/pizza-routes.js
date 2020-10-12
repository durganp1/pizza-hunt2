

const router = require('express').Router();
const {
    getAllPizza,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza
} = require('../../controllers/pizza-controller');

// SET UP GET ALL AND POST AT /API/PIZZAS
router
    .route('/')
    .get(getAllPizza)
    .post(createPizza);


// SET UP GET ONE, PUT, AND DELETE AT /API/PIZZAS/:ID
router
    .route('/:id')
    .get(getPizzaById)
    .put(updatePizza)
    .delete(deletePizza);


module.exports = router;
