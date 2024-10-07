
import Link from "next/link"

export default function NotFoundPage () {
    return (
        <div className="w-full h-full grid place-items-center">
            <div className="flex flex-col items-center gap-3">
                <h3 className="text-4xl font-medium text-gray-700">404</h3>
                <p className="text-gray-700">halaman tidak ditemukan</p>
                <Link href={'/'} className="py-1.5 px-2 w-full bg-violet-500 hover:bg-violet-700 text-white font-bold rounded-xl disabled:bg-gray-300">Kembali ke Homepage</Link>
            </div>
        </div>
    )
}