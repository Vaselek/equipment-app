const express = require('express');

const createRouter = connection => {
    const router = express.Router();

    router.get('/', (req, res) => {
        connection.query('SELECT `id`, `title` FROM `categories`', (error, result) => {
            if (error) {
                res.status(500).send({error: 'Database error'});
            }
            res.send(result);
        });
    });

    router.post('/', (req, res) => {
        const category = req.body;
        connection.query('INSERT INTO `categories` ' +
            '(`title`, `description`)' +
            'VALUES (?, ?); SELECT * FROM categories WHERE ID = LAST_INSERT_ID();',
            [category.title, category.description],
            (error, result) => {
                if (error) {
                    res.status(500).send({error: error});
                }
                res.send(result[1][0])
            }
        )
    });

    router.put('/:id', (req, res) => {
        const category = req.body
        let query = 'UPDATE `categories` SET `title` = ?, ' +
            '`description` = ? ' +
            'WHERE id = ?; SELECT * FROM `categories` WHERE `id` = ?';
        let data = [category.title,
            category.description,
            req.params.id,
            req.params.id,];
        connection.query(query, data,
            (error, result) => {
                if (error) {
                    res.status(500).send({error: 'Database error'});
                }
                res.send(result[1][0]);
            })
    });

    router.get('/:id', (req, res) => {
        connection.query('SELECT * FROM `categories` WHERE `id` = ?', req.params.id, (error, result) => {
            if (error) {
                res.status(500).send({error: 'Database error'});
            }
            if (result[0]) {
                res.send(result[0]);
            } else {
                res.status(404).send({error: 'Category not found'})
            }

        })
    });

    router.delete('/:id', (req, res) => {
        connection.query('SELECT * FROM `categories` WHERE `id` = ?; SELECT * FROM `equipments` where `category_id` = ?', [req.params.id, req.params.id], (error, result) => {
            if (error) {
                res.status(500).send({error: error});
            }
            let category = result[0][0];
            let connectedEquipments = result[1][0];
            if (connectedEquipments) {
                res.status(403).send({error: "Category can not be deleted as it has related equipments!"});
            } else if (category) {
                connection.query('DELETE FROM `categories` WHERE `id` = ?', req.params.id, (error, result) => {
                    res.status(200).send(category)
                })
            } else {
                res.status(404).send({error: 'Category not found'})
            }
        })
    });

    return router;
}



module.exports = createRouter;