'use client';

import { useEffect } from "react";
import useAuthStore from "@/stores/authStore";

export default function AuthProvider({ children }) {
    const init = useAuthStore((state) => state.init);

    useEffect(() => {
        init();
    }, [init]);

    return children;
}