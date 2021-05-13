import axios from 'axios';
const url = '/api';

export default class API {
    static async registerUser(data) {
        const res = await axios.post(url + "/user/register", data);
        return res.data;
    }

    static async loginUser(data) {
        const res = await axios.post(url + "/user/login", data);
        return res.data;
    }

    static async getAllUsers(data) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        const res = await axios.get(url + "/users", data);
        return res.data;
    }

    static async getMyProfile(data) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        const res = await axios.get(url + "/myprofile", data);
        return res.data;
    }

    static async updateUserById(data) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        const res = await axios.patch(`${url}/user/update/${data.updatedUser.id}`, data);
        return res.data;
    }
}