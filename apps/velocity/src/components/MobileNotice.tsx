import Link from 'next/link';

const MobileNotice = () => {
    return (
        <div>
            <div className='absolute top-2'>
                <Link href="/">
                    <div className="text-white font-bold cursor-pointer text-3xl ">
                        VelociType
                    </div>
                </Link>
            </div>
            <div className="h-screen w-full flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold  mb-2 text-center">
                    Mobile View Limited
                </h1>
                <p className="text-xl text-slate-500 text-justify">
                    This website is best experienced on a PC. Please switch to a desktop
                    browser for full functionality.
                </p>
            </div>
        </div >
    );
}

export default MobileNotice