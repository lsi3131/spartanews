import React from 'react'
import { Navigate } from 'react-router-dom'
import fetchUser from './fetchUser'

function AnonymouseRoute({ authenticated, component: Component }) {
    if (authenticated) {
        // alert('이미 인증된 사용자입니다.')
        return <Navigate to="/" />
    } else {
        return <Component />
    }
}

export default AnonymouseRoute
