import axios from 'axios';
const url = '/api';

export default class API {
    static async registerUser(data) {
        const res = await axios.post(url + "/user/register", data);
        return res.data;
    }
}