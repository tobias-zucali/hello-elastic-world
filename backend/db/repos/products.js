'use strict';

const sql = require('./sql');
const queries = {
    create: sql('products/create.sql'),
    empty: sql('products/empty.sql'),
    drop: sql('products/drop.sql'),
    find: sql('products/find.sql'),
    add: sql('products/add.sql')
};

/*
 This repository mixes hard-coded and dynamic SQL, primarily to show a diverse example of using both.
 */

class ProductsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    // Creates the table;
    create() {
        return this.db.none(queries.create);
    }

    // Drops the table;
    drop() {
        return this.db.none(queries.drop);
    }

    // Removes all records from the table;
    empty() {
        return this.db.none(queries.empty);
    }

    // Adds a new record and returns the full object;
    // It is also an example of mapping HTTP requests into query parameters;
    add(values) {
        return this.db.one(queries.add, {
            userId: +values.userId,
            productName: values.name
        });
    }

    // Tries to delete a product by id, and returns the number of records deleted;
    remove(id) {
        return this.db.result('DELETE FROM products WHERE id = $1', +id, r => r.rowCount);
    }

    // Tries to find a user product from user id + product name;
    find(values) {
        return this.db.oneOrNone(queries.find, {
            userId: +values.userId,
            productName: values.name
        });
    }

    // Returns all product records;
    all() {
        return this.db.any('SELECT * FROM products');
    }

    // Returns the total number of products;
    total() {
        return this.db.one('SELECT count(*) FROM products', [], a => +a.count);
    }
}

/*
    And if you prefer object prototyping instead, it will work the same.

    EXAMPLE:

    ProductsRepository.prototype.all = function () {
        return this.db.any('SELECT * FROM products');
    }
*/

module.exports = ProductsRepository;
