import React from 'react';
import {NavLink } from 'react-router-dom';

const NotFound = () =>(
  <div className="notfound">
    <div>
    <h3>404 page not found</h3>
    <p>We are sorry but the page you are looking for does not exist.</p>
    <NavLink to="/">
      Go Home
    </NavLink>
  </div>
  </div>
);

export default NotFound;