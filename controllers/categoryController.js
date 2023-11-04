import Category from "../models/Category.js";
import { stringToBool } from "../util/parseUtil.js";


export const getCategory = async(req, res) => {

    const name = req.query.name || req.params.name;

    try {
        if (name) {
            const category = await Category.findOne({name}).lean().exec();
            if (!category) return res.sendStatus(404);
    
            return res.json(category);
        }

        const categories = await Category.find({}).lean().exec();
        return res.json(categories);

    } catch (err){
        res.json({message: err.message})
    }
}

export const createNewCategory = async(req, res) => {
    const {name, active} = req.body;
    if (!name) return res.sendStatus(405);

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

export const updateCategory = async (req, res) => {
    const {id, name, newname, active} = req.body;
    if (!id && !name) return res.sendStatus(405); // Pelo menos um dos atributos é necessário

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