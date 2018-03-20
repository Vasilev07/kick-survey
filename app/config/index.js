/* globals process */
const port = process.env.PORT || 3001;
const secret = 'A small yellow rabbit hops all day in a black orchard with huge butterflies passing by.';
module.exports = {
    port,
    secret,
};
