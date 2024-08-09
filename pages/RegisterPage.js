import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function LoginPage() {
    const [formData, setFormData] = useState({ fullname: "", email: "", password: "" });
    const [error, setError] = useState({ fullname: "", email: "", password: "" });
    const [invalid, setInvalid] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fullname) {
            setError({ ...error, fullname: "Full Name Field is Required" });
            return;
        }
        if (!formData.email) {
            setError({ ...error, email: "Email Field is Required" });
            return;
        }
        if (!formData.password) {
            setError({ ...error, password: "Password Field is required" });
            return;
        }

        try {
            const res = await axios.post('api/UserRegister', { formData });
            console.log('Directing into main page with Email:' + formData.email);
            router.push({
                pathname: '/MainPage',
                query: { Email: formData.email },
            });

        }
        catch (error) {
            if (error.response && error.response.status === 401) {
                setInvalid("Email is already existed!");
            } else {
                console.error("An error occurred:", error);
            }
        }

        /*if (res.error) {
          toast.error(res.error);
        }
        else {
          toast.success(res.message);
          router.push('/profile');
        }*/
    }


    return (
        <>
            <Head>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <section className="bg-gray-50 dark:bg-gray-900 text-center">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Register to your account
                            </h1>
                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                                <div className='text-left'>
                                    <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                                    <input onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} type="fullname" name="fullname" id="fullname" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Full Name" required="" />
                                    {
                                        error.fullname && <p className="text-sm text-red-500">{error.fullname}</p>
                                    }
                                </div>
                                <div className='text-left'>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                                    {
                                        error.email && <p className="text-sm text-red-500">{error.email}</p>
                                    }
                                </div>
                                <div className='text-left'>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input onChange={(e) => setFormData({ ...formData, password: e.target.value })} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                    {
                                        error.password && <p className="text-sm text-red-500">{error.password}</p>
                                    }
                                </div>
                                <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Register</button>
                                <p className="text-red">{invalid}</p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
