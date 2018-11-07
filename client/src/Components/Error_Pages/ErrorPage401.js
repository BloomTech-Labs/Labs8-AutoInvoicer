import React, { Component } from 'react';
import './ErrorPage.css';

export default class Error401 extends Component {
    render() {
        return (
        <div className="error-page">
            401 — Unauthorized
        </div>
        )
    }
}