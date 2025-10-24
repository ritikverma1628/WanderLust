const joi = require('joi')

const listingSchema = joi.object({
        title : joi.string().required(),
        description: joi.string().required(),
        image: joi.string().required().allow('',null),
        price : joi.number().required().min(0),
        country : joi.string().required(),
        location : joi.string().required()
})

module.exports = listingSchema