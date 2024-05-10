import React, { useState } from 'react'

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSearch(query)
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
            <button type="submit">Search</button>
        </form>
    )
}

export default SearchBar
