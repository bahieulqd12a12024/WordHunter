import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import splitToWords from 'split-to-words';

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
    { name: 'Dashboard', href: '/MainPage', current: false },
    { name: 'Your Vocabularies', href: '/YourVocabularies', current: true },
    { name: 'Your Learning Progress', href: '/YourLearningProgress', current: false },
]
const userNavigation = [
    // { name: 'Your Profile', href: '#' },
    // { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '/' },
]

function classNames(...classNamees) {
    return classNamees.filter(Boolean).join(' ')
}


export default function YourVocabularies() {
    const router = useRouter();
    let list = [];
    const [listOfWord, setListOfWord] = useState(list);
    const [currentLengthOfWord, setCurrentLengthOfWord] = useState(0);
    const [listOfDesiredDef, setListOfDesiredDef] = useState(Array.from({ length: currentLengthOfWord }, () => 1));
    const [previousListOfDesiredDef, setPreviousListOfDesiredDef] = useState(Array.from({ length: currentLengthOfWord }, () => 1));
    const [listOfGetDef, setListOfGetDef] = useState(Array.from({ length: currentLengthOfWord }, () => 0));
    const [listOfCompleteDef, setListOfCompleteDef] = useState(Array.from({ length: currentLengthOfWord }, () => []));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post('api/CombineWord', { list: [], email: router.query.Email });
                const words = res.data.uniqueWords || [];
                setListOfWord(words);
                setCurrentLengthOfWord(words.length);
                setListOfDesiredDef(Array.from({ length: words.length }, () => 1));
                setPreviousListOfDesiredDef(Array.from({ length: words.length }, () => 1));
                setListOfGetDef(Array.from({ length: words.length }, () => 0));
                setListOfCompleteDef(Array.from({ length: words.length }, () => []));
            } catch (error) {
                console.error("Error fetching data:", error);
                setListOfWord([]);
                setCurrentLengthOfWord(0);
                setListOfDesiredDef([]);
                setPreviousListOfDesiredDef([]);
                setListOfGetDef([]);
                setListOfCompleteDef([[]]);
            }
        };

        if (router.query.Email) {
            fetchData();
        }
    }, [router.query.Email]);

    const handleRedirecting = (href) => async (e) => {
        e.preventDefault();
        router.push({
            pathname: href,
            query: { Email: router.query.Email },
        });
    };

    const handleLogOut = (href) => (e) => {
        router.push({
            pathname: href,
        });
    };

    const onIncreaseDef = (i) => {
        setListOfDesiredDef(prevItems => {
            const newItems = [...prevItems];
            newItems[i]++;
            return newItems;
        });
    };

    const onDecreaseDef = (i) => {
        setListOfDesiredDef(prevItems => {
            const newItems = [...prevItems];
            newItems[i]--;
            return newItems;
        });
    };

    const onGetDefinition = (i) => {
        setListOfGetDef(prevItems => {
            // Create a new array based on the previous state
            const newItems = [...prevItems];
            // Update the item at index i
            newItems[i] = 1;
            // Return the new array to update the state
            return newItems;
        });
    };

    const addEachDefinition = async (i) => {
        try {
            const res = await axios.post('api/GenerateWord', { word: listOfWord[i] });
            setListOfCompleteDef(
                prevItems => {
                    // Create a new array based on the previous state
                    const newItems = [...prevItems];
                    // Update the item at index i
                    const wFormAndMeaning = res.data.flatMap(item => item.meanings);
                    console.log(wFormAndMeaning[0]);
                    newItems[i] = [];
                    for (let j = 0; j < wFormAndMeaning.length && j < listOfDesiredDef[i]; j++) {
                        newItems[i].push(j + 1 + ". (" + wFormAndMeaning[j].partOfSpeech + ") " + wFormAndMeaning[j].definitions[0].definition);
                    }
                    console.log(newItems[i]);
                    // Return the new array to update the state

                    return newItems;
                }
            );
        } catch (error) {
            console.log("Error while searching");
        }
    };

    const handleDeletingWord = async (i) => {
        try {
        console.log("Handle deleting");
        const res = await axios.post('api/DeletingWord', { word: listOfWord[i], email: router.query.Email });
        } catch (error) {
            console.log("Deleting failed");
        }
    };

    useEffect(() => {
        listOfDesiredDef.forEach((currentValue, index) => {
            if (currentValue !== previousListOfDesiredDef[index]) {
                // Make the API call for the specific index if there's a change
                addEachDefinition(index);
            }
        });
        // Update the previous state to the current one after processing
        setPreviousListOfDesiredDef([...listOfDesiredDef]);
    }, [listOfDesiredDef]);

    const CompleteListOfWord = () => {
        const elements = [];
        for (let i = 0; i < currentLengthOfWord; i++) {
            elements.push(
                <tr>
                    <td className={` px-6 py-4 whitespace-no-wrap border-b border-gray-200 `}>
                        <div className={` flex items-center `}>
                            <div className={` ml-4 `}>
                                <div className={` text-sm font-medium leading-5 text-gray-900 `}>
                                    {listOfWord[i]}
                                </div>
                            </div>
                        </div>
                    </td>

                    <td className={` px-6 py-4 whitespace-no-wrap border-b border-gray-200 `}>
                        <div className={` text-sm leading-5 text-gray-900 `}>{listOfDesiredDef[i]}</div>
                        <div className={` text-sm leading-5 text-gray-900 `}>
                            <button
                                type="submit" class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
                                onClick={async (e) => {
                                    e.preventDefault();
                                    onIncreaseDef(i);
                                    await addEachDefinition(i);
                                }}
                            >
                                +
                            </button>
                            <button type="submit" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    onDecreaseDef(i);
                                    await addEachDefinition(i);
                                }}
                            >
                                -
                            </button>
                        </div>
                    </td>

                    <td className={` px-6 py-4 whitespace-normal border-b border-gray-200 `}>
                        {
                            listOfGetDef[i] === 0 ?
                                <button
                                    type="submit"
                                    class={` text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 `}
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        onGetDefinition(i);
                                        await addEachDefinition(i);
                                    }}
                                > Get definition
                                </button>
                                :
                                <div className={` text-sm leading-5 text-gray-900 `}>
                                    {listOfCompleteDef[i]}
                                </div>
                        }
                    </td>

                    <td
                        className={` px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200 `}>
                        <button
                            type="submit"
                            className={` text-indigo-600 hover:text-indigo-900 `}
                            onClick={async (e) => {
                                e.preventDefault();
                                await handleDeletingWord(i);
                            }}
                        >
                            Learned!
                        </button>
                    </td>
                </tr>
            );

        };
        return <>{elements}</>;
    };


    return (
        <>
            <Head>
                <title>VocabHunter</title>
                <meta name="description" content="Your Vocabularies" />
                <link rel="icon" href="/WordHunterIcon.jpeg" />
            </Head>
            <div className="min-h-full">
                <Disclosure as="nav" className="bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <img
                                        alt="Your Company"
                                        src="/WordHunterIcon.jpeg"
                                        className="h-8 w-8"
                                    />
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        {navigation.map((item) => (
                                            <button
                                                key={item.name}
                                                onClick={handleRedirecting(item.href)}
                                                aria-current={item.current ? 'page' : undefined}
                                                className={classNames(
                                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'rounded-md px-3 py-2 text-sm font-medium',
                                                )}
                                            >
                                                {item.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center md:ml-6">
                                    <button
                                        type="button"
                                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    >
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon aria-hidden="true" className="h-6 w-6" />
                                    </button>

                                    {/* Profile dropdown */}
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">Open user menu</span>
                                                <img alt="" src={user.imageUrl} className="h-8 w-8 rounded-full" />
                                            </MenuButton>
                                        </div>
                                        <MenuItems
                                            transition
                                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                        >
                                            {userNavigation.map((item) => (
                                                <MenuItem key={item.name}>
                                                    <button
                                                        onClick={handleLogOut(item.href)}
                                                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                                    >
                                                        {item.name}
                                                    </button>
                                                </MenuItem>
                                            ))}
                                        </MenuItems>
                                    </Menu>
                                </div>
                            </div>
                            <div className="-mr-2 flex md:hidden">
                                {/* Mobile menu button */}
                                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                                    <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className="md:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                            {navigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    aria-current={item.current ? 'page' : undefined}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium',
                                    )}
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}
                        </div>
                        <div className="border-t border-gray-700 pb-3 pt-4">
                            <div className="flex items-center px-5">
                                <div className="flex-shrink-0">
                                    <img alt="" src={user.imageUrl} className="h-10 w-10 rounded-full" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium leading-none text-white">{user.name}</div>
                                    <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                                </div>
                                <button
                                    type="button"
                                    className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                >
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="mt-3 space-y-1 px-2">
                                {userNavigation.map((item) => (
                                    <DisclosureButton
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                    >
                                        {item.name}
                                    </DisclosureButton>
                                ))}
                            </div>
                        </div>
                    </DisclosurePanel>
                </Disclosure>

                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Vocabularies</h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th
                                        className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                        Word</th>
                                    <th
                                        className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                        Desired Number of Definitions</th>
                                    <th
                                        className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                        Definition</th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                <CompleteListOfWord />
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </>
    )
}