const express = require('express');

const createRouter = connection => {
    const router = express.Router();

    router.get('/', (req, res) => {
        connection.query('SELECT `id`, `title` FROM `locations`', (error, result) => {
            if (error) {
                res.status(500).send({error: 'Database error'});
            }
            res.send(result);
        });
    });

    router.post('/', (req, res) => {
        const location = req.body;
        connection.query('INSERT INTO `locations` ' +
            '(`title`, `description`)' +
            'VALUES (?, ?); SELECT * FROM locations WHERE ID = LAST_INSERT_ID();',
            [location.title, location.description],
            (error, result) => {
                if (error) {
                    res.status(500).send({error: error});
                }
                res.send(result[1][0])
            }
        )
    });

    router.put('/:id', (req, res) => {
        const location = req.body
        let query = 'UPDATE `locations` SET `title` = ?, ' +
            '`description` = ? ' +
            'WHERE id = ?; SELECT * FROM `locations` WHERE `id` = ?';
        let data = [location.title,
            location.description,
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
        connection.query('SELECT * FROM `locations` WHERE `id` = ?', req.params.id, (error, result) => {
            if (error) {
                res.status(500).send({error: 'Database error'});
            }
            if (result[0]) {
                res.send(result[0]);
            } else {
                res.status(404).send({error: 'Location not found'})
            }

        })
    });

    router.delete('/:id', (req, res) => {
        connection.query('SELECT * FROM `locations` WHERE `id` = ?; SELECT * FROM `equipments` where `location_id` = ?', [req.params.id, req.params.id], (error, result) => {
            if (error) {
                res.status(500).send({error: error});
            }
            let location = result[0][0];
            let connectedEquipments = result[1][0];
            if (connectedEquipments) {
                res.status(403).send({error: "Location can not be deleted as it has related equipments!"});
            } else if (location) {
                connection.query('DELETE FROM `locations` WHERE `id` = ?', req.params.id, (error, result) => {
                    res.status(200).send(location)
                })
            } else {
                res.status(404).send({error: 'Location not found'})
            }
        })
    });

    return router;
}



module.exports = createRouter;