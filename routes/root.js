import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {

    if (req.accepts('html')) return res.redirect('/api-docs');
    if (req.accepts('json')) return res.json({message: "Hello world!"})
    else res.type('text').send("Hello world.");
})

export default router;