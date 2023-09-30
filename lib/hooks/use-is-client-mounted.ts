'use client'

import { useEffect, useState } from "react";

export default function useIsClientMounted() {
    const [isClientMounted, setIsClientMounted] = useState(false);
    useEffect(() => {
        setIsClientMounted(true);
    }, []);

    return isClientMounted;
};
