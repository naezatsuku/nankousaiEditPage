"use client"

import { Suspense, useEffect } from "react"


import { KaiseiDecol } from "@/fonts";
import PageInner from "./PageInner";

const kaiseiDecol = KaiseiDecol
export default function Page() {
    
    return(
        
        <div className="h-screen bg-white">
            <Suspense>
                <PageInner></PageInner>
            </Suspense>
            
        </div>
        
        
    )
}