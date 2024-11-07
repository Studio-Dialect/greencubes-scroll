'use client';
import CertificateElement from "../components/CertificateElement";
import ScrollElement from "../components/ScrollElement";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Certificate() {
    const router = useRouter();
    const [userName, setUserName] = useState("");

    useEffect(() => {
         // Scroll to the top when the component is mounted
        window.scrollTo(0, 0);
        // Access the query parameters from the URL
        const params = new URLSearchParams(window.location.search);
        const nameFromQuery = params.get('name'); // Get the 'name' query parameter
        setUserName(nameFromQuery);
    }, []);

    return (
        <CertificateElement userName={userName}/>
    );
}
