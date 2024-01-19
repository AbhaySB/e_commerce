import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from 'axios'
import { withSwal } from 'react-sweetalert2'

function Categories({ swal }) {

    const [name, setName] = useState('')
    const [categories, setCategories] = useState([])
    const [parentCategory, setParentCategory] = useState('')
    const [editing, setEditing] = useState(null)

    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data)
        })
    }

    useEffect(() => {
        // const data = async () => {
        //     const result = await axios.get('/api/categories')
        //     setCategories(result.data)
        // }
        // data()
        fetchCategories()
    }, [])

    async function saveCategory(event) {
        event.preventDefault()
        const data = { name, parentCategory }

        if (editing) {
            data._id = editing._id
            await axios.put('/api/categories', data)
            setEditing(null)
        } else {
            await axios.post('/api/categories', data);
        }
        setName('');
        fetchCategories()
    }

    function editCategory(category) {
        setEditing(category)
        setName(category.name)
        setParentCategory(category?.parent?._id)
    }

    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55'
        }).then(async result => {
            if (result.isConfirmed) {
                const { _id } = category;
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        })
    }

    return (
        <Layout>
            <h1 className="mb-5">Categories</h1>
            <label>{editing ? `Edit Category ${editing.name}` : 'Create New Categories'}</label>
            <form onSubmit={saveCategory} className="flex gap-1 mt-2">
                <input className="mb-0 pt-1"
                    type="text"
                    placeholder="Categories name"
                    onChange={e => setName(e.target.value)}
                    value={name}
                />
                <select className="mb-0"
                    value={parentCategory}
                    onChange={e => setParentCategory(e.target.value)}
                >
                    <option value="">No parent Category</option>
                    {categories?.length > 0 && categories.map(category => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>
                <button className="btn-primary" type="submit">Save</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category Name</td>
                        <td>Parent Category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories?.length > 0 && categories.map(category => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td className="flex gap-1 justify-end">
                                <button className="btn-primary" onClick={() => editCategory(category)}>Edit</button>
                                <button className="btn-red" onClick={() => deleteCategory(category)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
))