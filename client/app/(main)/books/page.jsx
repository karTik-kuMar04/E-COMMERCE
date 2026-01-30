import { Suspense } from "react";
import BooksClient from "./booksClient";

export default function BooksPage(){
    return(
        <Suspense fallback={<div className="p-10">Loadings...</div>}>
            <BooksClient />
        </Suspense>
    );
};