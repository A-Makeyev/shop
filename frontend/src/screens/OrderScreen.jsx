import { Link, useParams } from 'react-router-dom'
import { Row, Col, Button, Form, Card, ListGroup, Image } from 'react-bootstrap'
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice'
import { addCommas } from '../utils/cartUtils'
import { toast } from 'react-toastify'
import GoBackButton from '../components/GoBackButton'
import Message from '../components/Message'
import Loader from '../components/Loader'

const OrderScreen = () => {
    const { id: orderId } = useParams()
    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId)

    return (
        <>
            <Row>
                <Col md={3} lg={2}>
                    <GoBackButton url="/placeorder" />
                </Col>
                <Col md={12} lg={8} className="text-center mt-3">
                    <h3>Order ID: {orderId}</h3>
                </Col>
            </Row>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                    <Row className="justify-content-center mt-4">
                        <Col md={5}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2>Shipping</h2>
                                    <p>
                                        <strong>Name: </strong>
                                        {order.user.name}
                                    </p>
                                    <p>
                                        <strong>Email: </strong>
                                        {order.user.email}
                                    </p>
                                    <p>
                                        <strong>Address: </strong>
                                        {' '} {order.shippingAddress.address}, {order.shippingAddress.city},
                                        {' '} {order.shippingAddress.country}, {order.shippingAddress.postalCode}
                                    </p>

                                    {order.isDelivered ? (
                                        <Message variant="success">
                                            <strong>Delievered on:</strong>
                                            {order.deliveredAt}
                                        </Message>
                                    ) : (
                                        <Message variant="info" className="text-center">
                                            <strong>Awaiting Delivery</strong>
                                        </Message>
                                    )}

                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h2>Payment</h2>
                                    <p>
                                        <strong>Method: </strong>
                                        {order.paymentMethod}
                                    </p>

                                    {order.isPaid ? (
                                        <Message variant="success">
                                            <strong>Paid At:</strong>
                                            {order.paidAt}
                                        </Message>
                                    ) : (
                                        <Message variant="info" className="text-center">
                                            <strong>Awaiting Payment</strong>
                                        </Message>
                                    )}

                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={4}>
                            <Card className="mt-3 mb-3">
                                <ListGroup variant="flush" className="fs-5">
                                    <ListGroup.Item>
                                        <h2>Order Summary</h2>
                                        <h4>Total Items ({order.orderItems.length})</h4>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>${addCommas(order.itemsPrice)}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Shipping:</Col>
                                            <Col>${addCommas(order.shippingPrice)}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Tax:</Col>
                                            <Col>${addCommas(order.taxPrice)}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Total:</Col>
                                            <Col>${addCommas(order.totalPrice)}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="p-4">
                                        <Row>
                                            <Button role="button">
                                                Pay Now
                                            </Button>
                                        </Row>
                                        <Row className="mt-1">
                                            <Button role="button">
                                                Mark As Delievered
                                            </Button>
                                        </Row>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                        <Col md={9}>
                            <ListGroup.Item>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index} className="border rounded p-3">
                                        <Row className="ms-text-center">
                                            <Col md={1}>
                                                <Link to={`/product/${item._id}`}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Link>
                                            </Col>
                                            <Col md={6}>
                                                <Link to={`/product/${item._id}`}>
                                                    <strong>{item.name}</strong>
                                                </Link>
                                            </Col>
                                            <Col md={5} className="text-center">
                                                ${addCommas((item.qty * item.price).toFixed(2))}
                                                <br />
                                                ({addCommas(item.qty)}x{addCommas(item.price)})
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup.Item>
                        </Col>
                    </Row>
                </>
            )}
        </>
    )
}

export default OrderScreen