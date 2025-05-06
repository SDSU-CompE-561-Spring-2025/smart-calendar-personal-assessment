import Link from 'next/link';

export function Headerinstance() {
    return (
        <header className="border-b border-(--txtcolor) py-2 px-4 flex justify-between items-center h-15 ">
            <div className=" items-center">
                <Link href="/" className="text-(--accentcolor) text-2xl font-bold">
                Calendar<span className="text-(--accentcolor2) text-2xl font-bold">+</span>
                </Link>
            </div>
        </header>
    );
}