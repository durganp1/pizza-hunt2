

const { Schema, model } = require('mongoose');
const moment = require('moment');

const PizzaSchema = new Schema({
        pizzaName: {
            type: String,
            required: true,
            trim: true
        },
        createdBy: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
        },
        size: {
            type: String,
            required: true,
            enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
            default: 'Large'
        },
        toppings: [],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// GET TOTAL COUNT OF COMMENTS AND REPLIES ON RETRIEVAL
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});


// CREATE THE PIZZA MODEL USING THE PIZZASCHEMA
const Pizza = model('Pizza', PizzaSchema);

// EXPORT THE PIZZA MODEL
module.exports = Pizza;
