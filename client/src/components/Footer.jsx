import React from 'react'

const Footer = () => {
    return (
        <div className='absolute bottom-0 left-0 w-full z-[99]'>
            <footer className='text-sm bg-white/70 dark:bg-black/40 backdrop-blur-sm text-black dark:text-white py-4 text-center border-t border-neutral-300 dark:border-black'>
                <p>copyright &copy; 2024 by np</p>
            </footer>
        </div>
    )
}

export default Footer