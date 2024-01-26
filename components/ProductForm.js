import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { CldUploadButton, CldImage } from 'next-cloudinary';

export default function ProductForm({
    _id,
    name: existingName,
    description: existingDescription,
    price: existingPrice,
    imageId: existingImageId,
    category: existingCategory,
    properties: existingProperties
}) {

    const [name, setName] = useState(existingName || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProduct, setGoToProduct] = useState(false)
    const [imageId, setImageId] = useState(existingImageId || '');
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(existingCategory || '')
    const [productProperties, setProductProperties] = useState(existingProperties || {})
    const router = useRouter();

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data)
            console.log(categories);
        })
    }, [])

    async function createProduct(e) {
        const data = { name, description, price, imageId, category, properties: productProperties }
        e.preventDefault();
        if (_id) {
            await axios.put('/api/products', { ...data, _id });

        } else {
            await axios.post('/api/products', data)
        }
        setGoToProduct(true)
    }

    if (goToProduct) {
        router.push('/products')
    }

    // async function uploadImages(e) {
    //     const files = e.target?.files
    //     if (files?.length > 0) {
    //         const data = new FormData();
    //         for (const file of files) {
    //             data.append('file', file)
    //         }
    //         const res = await axios.post('/api/upload', data)
    //         console.log(res.data);
    //     }
    //     console.log(files);
    //
    const propertiesToFill = []
    if (categories.length > 0 && category) {
        let selCatInfo = categories.find(({ _id }) => _id === category);
        propertiesToFill.push(...selCatInfo.properties)
        while (selCatInfo?.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === selCatInfo?.parent?._id)
            propertiesToFill.push(...parentCat.properties)
            selCatInfo = parentCat
        }
    }

    function setProductProp(productName, value) {
        setProductProperties(prev => {
            const newProductProps = { ...prev };
            newProductProps[productName] = value
            return newProductProps;
        })
    }

    return (
        <form onSubmit={createProduct}>
            <label>Product Name</label>
            <input type="text" placeholder="product name"
                value={name}
                onChange={e => setName(e.target.value)}
            />

            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">None</option>
                {categories.length > 0 && categories.map(e => (
                    <option value={e._id}>{e.name}</option>
                ))}
            </select>

            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div className="">
                    <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
                    <div>
                    <select
                        value={productProperties[p.name]}
                        onChange={e => setProductProp(p.name, e.target.value)}>
                        {p.values.map(v => (
                            <option value={v}>{v}</option>
                        ))}
                    </select>
                    </div>
                </div>
            ))}

            <label>Photos</label>
            <div className="mb-2">
                {/* <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    Upload

                    <input type="file" className="hidden" onChange={uploadImages} />
                </label> */}

                <div className="flex p-1">
                    {/* {imageId? imageId : imageId.map(() => {
                        <CldImage className="m-2 rounded-lg"
                            width="200"
                            height="200"
                            src={imageId}
                            sizes="100vw"
                            alt="Description of my image"
                        />
                    })} */}
                    {imageId &&
                        (<CldImage className="m-2 rounded-lg"
                            width="200"
                            height="200"
                            src={imageId}
                            sizes="100vw"
                            alt="Description of my image"
                        />)}
                    <CldUploadButton className="w-44 h-32 mt-3 cursor-pointer text-center flex flex-col items-center justify-center text-md gap-1 text-gray-500 rounded-lg bg-gray-100 border shadow-md border-gray-200"

                        onUpload={(result) => {
                            setImageId(result.info.public_id);
                        }}
                        uploadPreset="rb28datv" />

                </div>

                {!imageId && (
                    <div>No Photos in the Product</div>
                )}
            </div>
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