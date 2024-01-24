import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from 'axios'
import { withSwal } from 'react-sweetalert2'

function Categories({ swal }) {

    const [name, setName] = useState('')
    const [categories, setCategories] = useState([])
    const [parentCategory, setParentCategory] = useState('')
    const [editing, setEditing] = useState(null)
    const [properties, setProperties] = useState([])

    useEffect(() => {
        // const data = async () => {
        //     const result = await axios.get('/api/categories')
        //     setCategories(result.data)
        // }
        // data()
        fetchCategories()
    }, [])

    function fetchCategories() {
        try {
            axios.get('/api/categories').then(result => {
                setCategories(result.data)
            })
        } catch (error) {
            alert(error);
        }
    }

    async function saveCategory(event) {
        event.preventDefault()
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(',')
            }))
        }

        if (editing) {
            data._id = editing._id
            await axios.put('/api/categories', data)
            setEditing(null)
        } else {
            await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory('')
        setProperties('')
        fetchCategories()
    }

    function editCategory(category) {
        setEditing(category)
        setName(category.name)
        setParentCategory(category?.parent?._id)
        setProperties(category.properties.map(({ name, values }) => ({ name, values: values.join(',') })))
    }

    async function deleteCategory(category) {
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
        // const canDelete = confirm("Want to delete?")
        // if(!canDelete) return;
        // const { _id } = category;
        // await axios.delete('/api/categories?_id=' + _id);
        // fetchCategories();
    }

    function addProperty() {
        setProperties(e => {
            return [...e, { name: '', values: '' }]
        })
    }

    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties
        })
    }

    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties
        })
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    return (
        <Layout>
            <h1 className="mb-5">Categories</h1>
            <label>{editing ? `Edit Category ${editing.name}` : 'Create New Categories'}</label>
            <form onSubmit={saveCategory} className="mt-2">
                <div className="flex gap-1">
                    <input className="pt-1 mb-0"
                        type="text"
                        placeholder="Categories name"
                        onChange={e => setName(e.target.value)}
                        value={name}
                    />
                    <select className="mb-0"
                        onChange={e => setParentCategory(e.target.value)}
                        value={parentCategory}
                    >
                        <option value="">No parent Category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mt-2">
                    <label className="block">Properties</label>
                    <button className="btn-default mb-2" type="button" onClick={addProperty}>Add Properties</button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className="flex gap-1 mb-2">
                            <input type="text"
                                className="mb-0"
                                value={property.name}
                                onChange={e => handlePropertyNameChange(index, property, e.target.value)}
                                placeholder="Property Name" />
                            <input type="text"
                                className="mb-0"
                                value={property.values}
                                onChange={e => handlePropertyValuesChange(index, property, e.target.value)}
                                placeholder="Value" />
                            <button className="btn-red"
                                onClick={() => removeProperty(index)}
                                type="button"
                            >Remove</button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editing && (
                        <button className="btn-default"
                            type="button"
                            onClick={() => {
                                setEditing(null)
                                setName('')
                                setParentCategory('')
                                setProperties([])
                            }}
                        >Cancel</button>
                    )}
                    <button className="btn-primary" type="submit">Save</button>
                </div>
            </form>
            {!editing && (
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
            )}

        </Layout>
    )
}

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
))