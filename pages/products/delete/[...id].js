import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import axios from 'axios'

export default function deleteProductPage() {

    const [productInfo, setProductInfo] = useState()

    const router = useRouter()
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return
        }
        axios.get('/api/products?id=' + id).then(res => {
            setProductInfo(res.data)
        })
    }, [id])


    function goBack() {
        router.push('/products')
    }

    async function deleteProduct() {
        await axios.delete('/api/products?id=' + id);
        goBack();
    }

    return (
        <Layout>

            <h1 className="text-center">Do you want to <b>delete</b> Product &nbsp; "{productInfo?.name}" ?</h1>
            <div className="flex gap-1 justify-center">
                <button className="btn-red" onClick={deleteProduct}>Yes</button>
                <button className="btn-default" onClick={goBack}>No</button>
            </div>

        </Layout>
    )
}