import React from 'react'
import { Navigate } from 'react-router-dom'
import fetchUser from './fetchUser'

function AuthenticatedRoute({ authenticated, component: Component }) {
    if (!authenticated) {
        // alert('로그인이 필요합니다')
        return <Navigate to="/login" />
    } else {
        return <Component />
    }
}

export default AuthenticatedRoute
