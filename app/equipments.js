const express = require('express');
const nanoid = require('nanoid');
const multer = require('multer');
const path = require('path');
const config = require('../config')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const createRouter = connection => {
    const router = express.Router();

    router.get('/', (req, res) => {
        connection.query('SELECT `id`, `location_id`, `category_id`, `title` FROM `equipments`', (error, result) => {
            if (error) {
                res.status(500).send({error: 'Database error'});
            }
            res.send(result);
        });
    });

    router.post('/', upload.single('image'), (req, res) => {
        const equipment = req.body


        if (req.file) {
            equipment.image = req.file.filename;
        }

        connection.query('INSERT INTO `equipments` ' +
            '(`title`, `category_id`, `location_id`, `description`, `image`)' +
            'VALUES (?, ?, ?, ?, ?); SELECT * FROM `equipments` WHERE `id` = LAST_INSERT_ID();',
            [equipment.title, equipment.category_id, equipment.location_id, equipment.description, equipment.image],
            (error, result) => {
                if (error) {
                    res.status(500).send({error: error});
                }
                res.send(result[1][0])
            })
    });

    router.put('/:id', upload.single('image'), (req, res) => {
        const equipment = req.body

        let query = 'UPDATE `equipments` SET `title` = ?, ' +
            '`category_id` = ?, ' +
            '`location_id` = ?, ' +
            '`description` = ? ' +
            'WHERE id = ?; SELECT * FROM `equipments` WHERE `id` = ?';
        let data = [equipment.title,
                    equipment.category_id,
                    equipment.location_id,
                    equipment.description,
                    req.params.id,
                    req.params.id,];

        if (req.file) {
            equipment.image = req.file.filename;
            query = 'UPDATE `equipments` SET `title` = ?, ' +
                '`category_id` = ?, ' +
                '`location_id` = ?, ' +
                '`description` = ?, ' +
                '`image` = ? ' +
                'WHERE id = ?; SELECT * FROM `equipments` WHERE `id` = ?';
            data = [equipment.title,
                equipment.category_id,
                equipment.location_id,
                equipment.description,
                equipment.image,
                req.params.id,
                req.params.id];
        }

        connection.query(query, data,
            (error, result) => {
                if (error) {
                    res.status(500).send({error: 'Database error'});
                }
                res.send(result[1][0]);
            })
    });

    router.get('/:id', (req, res) => {
        connection.query('SELECT * FROM `equipments` WHERE `id` = ?', req.params.id, (error, result) => {
            if (error) {
                res.status(500).send({error: 'Database error'});
            }
            if (result[0]) {
                res.send(result[0]);
            } else {
                res.status(404).send({error: 'Equipment not found'})
            }

        })
    });

    router.delete('/:id', (req, res) => {
        connection.query('SELECT * FROM `equipments` WHERE `id` = ?', req.params.id, (error, equipments) => {
            if (error) {
                res.status(500).send({error: error});
            }
            if (equipments[0]) {
                const categoryId = equipments[0].category_id;
                const locationId = equipments[0].location_id;
                const equipmentId = equipments[0].id;
                if (categoryId) {
                    res.status(403).send({error: 'Equipment can not be deleted as it has connected categories'});
                } else if (locationId) {
                    res.status(403).send({error: 'Equipment can not be deleted as it has connected locations'});
                } else {
                    connection.query('DELETE FROM `equipments` WHERE `id` = ?', equipmentId, (error, result) => {
                        res.status(200).send(equipments[0]);
                    })
                }
            } else {
                res.status(404).send({error: 'Equipment not found'})
            }
        })
    });

    return router;
}



module.exports = createRouter;