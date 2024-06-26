import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaTrash } from 'react-icons/fa'
import { Container, Row, Col, ListGroup, Form, Button, Card, Image } from 'react-bootstrap'
import { addToCart, removeFromCart } from '../slices/cartSlice'
import { adjustPrice } from '../utils/cartUtils'
import GoBackButton from '../components/GoBackButton'
import Message from '../components/Message'
import Meta from '../components/Meta'


const CartScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const cart = useSelector(state => state.cart)
    const { cartItems } = cart
    const totalItems = cartItems.reduce((accumulator, item) => accumulator + item.qty, 0)
    const totalPrice = adjustPrice(cartItems.reduce((accumulator, item) => accumulator + item.qty * item.price, 0).toFixed(2))

    const addToCartHandler = async (product, qty) => {
        dispatch(addToCart({ ...product, qty }))
    }

    const removeFromCartHandler = async (id) => {
        dispatch(removeFromCart(id)) // id -> action payload
    }

    const checkoutHandler = () => {
        const emptyShippingAddress = Object.keys(cart.shippingAddress).length === 0
        const emptyPaymentMethod = Object.keys(cart.paymentMethod).length === 0

        if (!emptyShippingAddress && emptyPaymentMethod) {
            navigate('/login?redirect=/payment')
        } else if (!emptyShippingAddress && !emptyPaymentMethod) {
            navigate('/login?redirect=/placeorder')
        } else {
            navigate('/login?redirect=/shipping')
        }
    }

    return (
        <>
            <Meta 
                title={totalItems > 0 ? `Shop | Cart (${totalItems})` : 'Shop | Cart'}
                description={JSON.stringify(cartItems.map((p) => p.category + ' ' + p.brand + ' ' + p.name + ' ').toString())} 
                keywords={JSON.stringify(cartItems.map((p) => p.category + ' ' + p.brand + ' ' + p.name + ' ').toString())} 
            /> 
            
            <Row>
                <Col sm={3} md={3} lg={2}>
                    <GoBackButton text="Home" url="/" />
                </Col>
                <Col sm={13} md={6} lg={6} xl={6} className="text-center mt-3">
                    <h1>{cartItems.length === 0 ? 'Your cart is empty' : 'Shopping Cart'}</h1>
                </Col>
            </Row>
            <Container>
                <Row>
                    <Col md={13} lg={8}>
                        {cartItems.length === 0 ? (
                            <Row>
                                <Col md={1} lg={5} xl={4}></Col>
                                <Col md={11} lg={5} xl={7}>
                                    <Message variant="none" className="text-center mt-5">
                                        <h1>(◡ _ ◡)</h1>
                                    </Message>
                                </Col>
                            </Row>
                        ) : (
                            <ListGroup variant="flush" className="mt-3 me-3">
                                {cartItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="mt-3 mb-2 justify-content-center">
                                            <Col md={2} lg={2} className="mb-3">
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col xs={13} sm={11} md={4} lg={5} className="sm-text-center mb-3 pl-5">
                                                <Link to={`/product/${item._id}`} target="_blank">
                                                    <h5>{item.name}</h5>
                                                </Link>
                                            </Col>
                                            <Col xs={4} sm={3} md={3} lg={2} className="mt-1 p-0 text-center">
                                                <h5>{adjustPrice(item.price)}</h5>
                                            </Col>
                                            <Col xs={4} sm={3} md={2} lg={2}>
                                                <Form.Control
                                                    as="select"
                                                    value={item.qty}
                                                    className="p-1 text-center"
                                                    disabled={item.countInStock === 1}
                                                    role={item.countInStock > 1 ? "button" : undefined}
                                                    onChange={(event) => addToCartHandler(item, Number(event.target.value))}
                                                >
                                                    {[...Array(item.countInStock).keys()].map((i) => (
                                                        <option key={i + 1} value={i + 1}>
                                                            {i + 1}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                            <Col xs={1} sm={3} md={1}>
                                                <Button
                                                    type="button"
                                                    variant="light"
                                                    className="p-1"
                                                    onClick={() => removeFromCartHandler(item._id)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}

                    </Col>
                    <Col md={13} lg={4} className="mt-4">
                        <Card className="sticky-top sticky-card">
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h4>Subtotal ({totalItems === 1 ? '1 item' : `${totalItems} items`})</h4>
                                    <h4>{totalPrice}</h4>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Button
                                        type="button"
                                        className="p-2 w-100"
                                        disabled={cartItems.length === 0}
                                        onClick={checkoutHandler}
                                    >
                                        Proceed To Checkout
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default CartScreen