import Category from "../models/Category.js";
import { stringToBool } from "../util/parseUtil.js";

/**
 * @desc Recupera uma ou várias categorias
 * @route GET /category?name=param1
 * @access PUBLIC
 */
export const getCategory = async(req, res) => {

    const id = req.body.id;
    const name = req.query.name || req.params.id;

    try {
        if (name) {
            const category = await Category.findOne(
                {$or: [
                    {name: {$regex: name, $options: 'i'}}, 
                    {_id: id}
                ]})
                .lean().exec();

            if (!category) return res.status(404).json({message: 'Categoria não existe'});
    
            return res.json(category);
        }

        const categories = await Category.find({}).lean().exec();
        return res.json(categories);

    } catch (err){
        res.json({message: err.message})
    }
}

/**
 * @desc Cadastra uma categoria
 * @route POST /category
 * @access PRIVATE
 */
export const createNewCategory = async(req, res) => {
    const {name, active} = req.body;
    if (!name) return res.sendStatus(400);

    try {
        const duplicate = await Category.findOne({name}).lean().exec();
        if (duplicate) return res.sendStatus(409);

        const newCategory = {
            name,
            active: active || true
        }

        const category = await Category.create(newCategory);
        if (category) return res.sendStatus(201);

    } catch (err){
        res.json({message: err.message})
    }
}

/**
 * @desc Atualiza uma categoria
 * @route PATCH /category
 * @access PRIVATE
 */
export const updateCategory = async (req, res) => {
    const {id, name, newname, active} = req.body;
    if (!id && !name) return res.sendStatus(400); // Pelo menos um dos atributos é necessário

    try {
        const category = await Category.findOne({$or: [{name}, {_id: id}]}).exec();
        if (!category) return res.sendStatus(404);

        if (newname) {
            const duplicate = await Category.findOne({newname}).lean().exec();
            if (duplicate) return res.sendStatus(409);
        }

        category.name = newname || category.name;
        category.active = stringToBool(active) ?? category.active;

        const updatedCategory = await category.save();

        return res.json(updatedCategory);

    } catch (err){
        res.json({message: err.message})
    }
}