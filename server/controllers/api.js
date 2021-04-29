module.exports = class API {
    static async homeRoute(req, res) {
        res.send("hello from API");
    }
}