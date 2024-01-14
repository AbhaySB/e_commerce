import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
    _id,
    name: existingName,
    description: existingDescription,
    price: existingPrice
}) {

    const [name, setName] = useState(existingName || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProduct, setGoToProduct] = useState(false)
    const router = useRouter();

    console.log({ _id });

    async function createProduct(e) {
        const data = { name, description, price }
        e.preventDefault();
        if (_id) {
            await axios.put('/api/products', {...data,_id});

        } else {
            await axios.post('/api/products', data)
        }
        setGoToProduct(true)
    }

    if (goToProduct) {
        router.push('/products')
    }

    return (
        <form onSubmit={createProduct}>
            <label>Product Name</label>
            <input type="text" placeholder="product name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <label>Description</label>
            <textarea placeholder="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            ></textarea>
            <label>Price (in INR)</label>
            <input type="number" placeholder="price"
                value={price}
                onChange={e => setPrice(e.target.value)}
            />

            <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded-md mt-3">Save</button>
        </form>
    )
}