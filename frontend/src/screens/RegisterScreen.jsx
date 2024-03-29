import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useRegisterMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'
import FormContainer from '../components/FormContainer'
import GoBackButton from '../components/GoBackButton'
import Loader from '../components/Loader'
import Meta from '../components/Meta'


const RegisterScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [register, { isLoading }] = useRegisterMutation()
    const { userInfo } = useSelector(state => state.auth)
    const { search } = useLocation()
    const searchParams = new URLSearchParams(search)
    const redirect = searchParams.get('redirect') || '/'

    const submitHandler = async (event) => {
        event.preventDefault()
        if (password !== confirmPassword) {
            toast.error('Passwords don\'t match!')
        } else {
            try {
                const response = await register({ name, email, password }).unwrap()
                dispatch(setCredentials({ ...response }))
                navigate(redirect)
                toast(`Welcome ${response.name}!`)
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        }
    }

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    return (
        <>
            <Meta title={'Shop | Register'} />
            <GoBackButton text="Login" url="/login" />
            <FormContainer>
                <h1 className="text-center">Sign Up</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className="my-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="email" className="my-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="password" className="my-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="confirmPassword" className="my-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Button type="submit" variant="primary" id="register" className="mt-2" disabled={isLoading}>
                        {isLoading ? <Loader register /> : 'Register'}
                    </Button>
                </Form>
                <Row className="py-3">
                    <Col>
                        Have an account? {' '}
                        <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                            Sign in
                        </Link>
                    </Col>
                </Row>
            </FormContainer>
        </>
    )
}

export default RegisterScreen