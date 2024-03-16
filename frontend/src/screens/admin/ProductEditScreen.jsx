import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Form, Button, Image } from 'react-bootstrap'
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../../slices/productsApiSlice'
import { toast } from 'react-toastify'
import FormContainer from '../../components/FormContainer'
import GoBackButton from '../../components/GoBackButton'
import Message from '../../components/Message'
import Loader from '../../components/Loader'


const ProductEditScreen = () => {
    const { id: productId } = useParams()
    const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId)
    const [updateProduct, { isLoading: updatingProduct }] = useUpdateProductMutation()
    const [uploadProductImage] = useUploadProductImageMutation()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [category, setCategory] = useState('')
    const [brand, setBrand] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [price, setPrice] = useState(0)

    useEffect(() => {
        if (product) {
            setName(product.name)
            setDescription(product.description)
            setImage(product.image)
            setCategory(product.category)
            setBrand(product.brand)
            setCountInStock(product.countInStock)
            setPrice(product.price)
            document.getElementById('product-header').textContent = product.name.split(' ', 3).join(' ')
        }
    }, [product])

    const submitHandler = async (event) => {
        event.preventDefault()

        const uppdatedProduct = {
            productId,
            name,
            description,
            image,
            category,
            brand,
            countInStock,
            price
        }

        const result = await updateProduct(uppdatedProduct)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Updated Product', { theme: "colored", hideProgressBar: true })
            refetch()
        }
    }

    const uploadFileHandler = async (event) => {
        const formData = new FormData()
        formData.append('image', event.target.files[0])

        try {
            const response = await uploadProductImage(formData).unwrap()
            setImage(response.image)
            // const text = document.getElementById('image-text')
            // text.innerHTML = `<label class="fw-bold text-success">Uploaded Image</label>`
            setTimeout(() => {
                // text.textContent = 'Upload Image'
                // text.classList.remove('fw-bold', 'text-success')
                document.getElementById('update-product').click()
            }, 500)
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }

    return (
        <>
            <Row>
                <Col md={3} lg={2} xl={2}>
                    <GoBackButton text="Products" url="/admin/productlist" />
                </Col>
                <Col sm={13} md={6} lg={8} xl={8} className="my-3">
                    <h1 id="product-header" className="text-center">
                        {!product && 'Update Product'}
                    </h1>
                </Col>
            </Row>
            {isLoading ? <Loader /> : error ? (
                <Message variant="danger" className="text-center">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <FormContainer>
                    <Form onSubmit={submitHandler}>
                        <Row>
                            <Col>
                                <Form.Group controlId="name" className="mt-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="image-upload" className="my-3">
                                    <Form.Label id="image-text" className="input-label">Upload Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        className="inputfile"
                                        onChange={uploadFileHandler}
                                    >
                                    </Form.Control>
                                </Form.Group>
                                {/* <Form.Group controlId="image" className="my-3">
                                    <Form.Label>Image</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={image}
                                        onChange={(event) => setImage(event.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group> */}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="brand" className="mb-3">
                                    <Form.Label>Brand</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={brand}
                                        onChange={(event) => setBrand(event.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="category" className="my-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={category}
                                        onChange={(event) => setCategory(event.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="price" className="my-3">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={price}
                                        onChange={(event) => setPrice(event.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="countInStock" className="my-3">
                                    <Form.Label>Count In Stock</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={countInStock}
                                        onChange={(event) => setCountInStock(event.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>

                            </Col>
                            <Image src={product.image} alt={product.name} className="w-50 h-25" />
                        </Row>
                        <Form.Group controlId="description" className="mb-2">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={7}
                                maxLength={1000}
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                        <Button type="submit" variant="primary" id="update-product" className="mt-2 w-100">
                            {updatingProduct ? <Loader update /> : 'Update'}
                        </Button>
                    </Form>
                </FormContainer>
            )}
        </>
    )
}

export default ProductEditScreen