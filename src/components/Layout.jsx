import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
    return (
        <>
            <Header />
            <main id="main-content">
                <Outlet /> {/* This is where Dashboard/Settings/About will appear */}
            </main>
            <Footer />
        </>
    );
}
