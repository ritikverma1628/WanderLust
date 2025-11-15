const joi = require('joi')

exports.listingValidations = joi.object({
        title : joi.string().required(),
        description: joi.string().required(),
        image: joi.object({
                url:joi.string().required(),
                fieldname:joi.string().required()
        }),
        price : joi.number().required().min(0),
        country : joi.string().required(),
        location : joi.string().required()
})

exports.reviewValidations = joi.object(
        {
                review : joi.object(
                        {
                                rating : joi.number().required().min(1).max(5),
                                comment : joi.string().required()
                        }
                ).required()
        }
)
