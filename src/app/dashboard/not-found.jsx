import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-r from-Orange-400 via-Orange-300 to-Orange-300">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-white animate-pulse">404</h1>
        <p className="mt-4 text-4xl font-bold text-white animate-bounce">ไม่พบหน้าที่คุณต้องการ</p>
        <p className="mt-4 text-lg text-gray-100">
          ขออภัย เราไม่สามารถค้นหาหน้านั้นได้
        </p>
        <Link href="/" className="mt-8 inline-block px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-Orange-400 to-Orange-500 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out">
          กลับไปหน้าหลัก
        </Link>
      </div>
    </section>
  );
}
