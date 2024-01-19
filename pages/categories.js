import Layout from "@/components/Layout";
import { useState } from "react";
import axios from 'axios'

export default function Categories() {

    const [name, setName] = useState('')

    async function saveCategory(event) {
        event.preventDefault()
        await axios.post('/api/categories', { name });
        setName('');
    }

    return (
        <Layout>
            <h1 className="mb-5">Categories</h1>
            <label>New Categories</label>
            <form onSubmit={saveCategory} className="flex gap-1 mt-2">
                <input className="mb-0 pt-1"
                    type="text"
                    placeholder="Categories name"
                    onChange={e => setName(e.target.value)}
                    value={name}
                />
                <button className="btn-primary" type="submit">Save</button>
            </form>
        </Layout>
    )
}