import chalk from "chalk";
import News from "../models/News.js";
import { isValidObjectId } from "mongoose";

export const getNews = async (req, res) => {
    // #swagger.tags = ['News']
    const min = req.query.min || 0;
    const max = req.query.max || 5;
    if (isNaN(min) || isNaN(max)) return res.status(400).json({message: "Mínimo e máximo precisam ser números."})

    try {
        const news = await News.find().skip(min).limit(max).exec()
        res.json(news);

    } catch (err){
        console.error(chalk.red(err.stack));
        res.json(err.message);
    }
}

export const createNews = async (req, res) => {
    // #swagger.tags = ['News']
    /* #swagger.security = [{
            "bearerAuth": []
    }] */

    const {title, body, image} = req.body;
    if (!title || !body) return res.json({message: "title e body são obrigatórios."})

    try {

        const newNews = {
            title,
            body,
            image,
            postDate: new Date()
        };

        const news = await News.create(newNews);

        res.json(news)

    } catch (err){
        console.error(chalk.red(err.stack));
        res.json(err.message);
    }
}

export const updateNews = async (req, res) => {
    // #swagger.tags = ['News']
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    const {_id, title, body, image} = req.body;
    if (!_id || !isValidObjectId(_id)) return res.status(400).json({message: "_id válido é um campo obrigatório"})
    try {

        const news = await News.findById(_id).exec();
        if (!news) return res.status(404).json({message: "News not found"});

        news.title = title || news.title;
        news.body = body || news.body;
        news.image = image || news.image;

        await news.save();

        res.json(news);

    } catch (err){
        console.error(chalk.red(err.stack));
        res.json(err.message);
    }

}

export const deleteNews = async(req, res) => {

    // #swagger.tags = ['News']
    /* #swagger.security = [{
            "bearerAuth": []
    }] */

    const {_id} = req.body;

    if (!_id || !isValidObjectId(_id)) return res.status(400).json({message: "_id válido é um campo obrigatório"});

    try {
        const news = await News.findById(_id).exec();
        if (!news) return res.status(404).json({message: "News não existe ou não foi encontrada."});

        const deletedNews = await news.deleteOne();

        res.send({message: "News foi deletada.", deleteNews});


    } catch (err){
        console.error(chalk.red(err.stack));
        res.json(err.message);
    }

}