import React, { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import SearchResult from './SearchResult'
import './SearchForm.css'
import axios from 'axios'

function SearchForm() {
    const [results, setResults] = useState([])

    const handleSearch = (query) => {
        const url = `http://localhost:8000/api/articles/?q=${query}`
        axios
            .get(url)
            .then((response) => {
                setResults(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
        console.log(results)
    }

    return (
        <div className="search-content">
            <h1>Search Page</h1>
            <SearchBar onSearch={handleSearch} />
            <SearchResult results={results} />
        </div>
    )
}

export default SearchForm
