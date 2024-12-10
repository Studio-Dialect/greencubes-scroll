'use client'
import { useState, useEffect, useRef } from 'react';
import { sendEvent } from '../../../utils/analytics';
import { useRouter } from 'next/navigation';

export default function Form() {
    const [userName, setUserName] = useState(''); // Store the user's name
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        sendEvent({ action: 'form_submit', value: "Form Submit" });
        
        try {
            setStatus('pending');
            setError(null);
            const myForm = event.target;
            const formData = new FormData(myForm);
            const res = await fetch('/__forms.html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString(),
            });
            if (res.status === 200) {
                setStatus('ok');
                router.push(`/certificate?name=${encodeURIComponent(userName)}`);
            } else {
                setStatus('error');
                setError(`${res.status} ${res.statusText}`);
            }
        } catch (e) {
            setStatus('error');
            setError(`${e}`);
        }
    };
return (
<div 
className="w-full h-screen bg-[url('/frog.jpg')] bg-cover bg-center flex items-center justify-center fixed top-0"
>
<div className="text-center text-white flex flex-col items-between justify-around h-full px-12">
    <h1 className="text-4xl capitalize font-semibold">ACTIVATE YOUR GREEN CUBE</h1>
    <form name='Sign Up' className="mt-4 space-y-4 flex flex-col justify-center items-center px-5" onSubmit={handleSubmit} netlify>
    <input type="hidden" name="form-name" value="Sign Up" />
        <input 
            type="text" 
            name='name'
            placeholder="Name" 
            className="block w-full p-2 bg-zinc-900 text-white rounded px-4"
            value={userName}
            onChange={(e) => setUserName(e.target.value)} // Capture the name input
        />
        <input 
            type="email" 
            name='email'
            placeholder="Email" 
            className="block w-full p-2 bg-zinc-900 text-white rounded px-4"
        />
        <div className="flex gap-2 w-full">
        <input type="checkbox" id="checkbox" name="checkbox" className="
            relative peer shrink-0
            appearance-none w-4 h-4 border-2 border-lime-500 rounded-sm bg-white
            mt-1
            checked:bg-lime-500 checked:border-0
            focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-lime-100
            disabled:border-steel-400 disabled:bg-steel-400
            "
        />
            <label htmlFor="checkbox" className='text-left'>Send me details on enterprise sponsorship options.</label>
            <svg
                className="
                absolute 
                w-4 h-4 mt-1
                hidden peer-checked:block
                pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
        <button 
            type="submit" 
            className="w-full p-2 bg-lime-500 hover:bg-green-500 text-white text-lg rounded"
        >
            Activate
        </button>
    </form>
</div> 
</div>

);
}

