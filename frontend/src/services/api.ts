import axios from "axios";
import * as dotenv from 'dotenv'

dotenv.config()

export async function test() {
    const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL, { headers: { Authorization : `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` } })
    return response.data;

}