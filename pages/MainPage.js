import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import splitToWords from 'split-to-words';

const user = {
    name: '',
    email: '',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
    { name: 'Dashboard', href: '/MainPage', current: true },
    { name: 'Your Vocabularies', href: '/YourVocabularies', current: false },
    { name: 'Your Learning Progress', href: '/YourLearningProgress', current: false },
]
const userNavigation = [
    // { name: 'Your Profile', href: '#' },
    // { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '/' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function MainPage() {
    const [text, setText] = useState("");
    const router = useRouter();
    const [listOfWord, setListOfWord] = useState([]);
    const [listOfIndexButton, setListOfIndexButton] = useState([]);
    const [listOfButton, setListOfButton] = useState([]);
    const [handleSubmitAndReload, setHandleSubmitAndReload] = useState(0);
    const [wordAndMeaning, setWordAndMeaning] = useState([]);
    const [errorFinding, setErrorFinding] = useState("");
    let processListOfWord = [];
    let listForLine = [];
    let listForChoice = [];

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

    const handleSubmitText = (e) => {
        e.preventDefault();
        if (handleSubmitAndReload === 0) {
            setListOfWord(() => {
                listForLine = text.split('\n');
                for (let i = 0; i < listForLine.length; i++) {
                    let a = listForLine[i].split(/\s+/);
                    for (let j = 0; j < a.length; j++) {
                        if (a[j].length === 0) {
                            a.splice(j, 1);
                        }
                    }
                    if (a.length > 0) {
                        a[a.length - 1] += '\n'
                        for (let j = 0; j < a.length; j++) {
                            listForChoice.push(a[j]);
                        }
                    }

                }
                return listForChoice;

            });
            console.log(listOfWord);
            setHandleSubmitAndReload(1);
        } else {
            // router.push({
            //     pathname: '/MainPage',
            //     query: {Email: router.query.Email},
            // });
            router.reload();
        }
    };

    const HandleButtonToChoose = (i) => {
        // e.preventDefault();
        setListOfIndexButton((prevList) => {
            if (prevList.includes(i)) {
                return prevList.filter(item => item !== i);
            } else {
                return [...prevList, i];
            }
        });
    }

    const implementMeaning = async (i, test) => {
        // e.preventDefault();
        let word = listOfWord[i].replace(/^[^\w-]+|[^\w-]+$/g, '');
        word = word.toLowerCase();
        if (test) {
            setWordAndMeaning(prevItem => prevItem.filter(item => item.id !== i));
            console.log("Delete");
        } else {
            try {
                const res = await axios.post('api/GenerateWord', { word: word });
                setWordAndMeaning(prevItem => [...prevItem, { id: i, word: word, information: res.data }]);
                // console.log(wordAndMeaning);
            } catch (error) {
                console.log('Error while searching: ' + word);
                setErrorFinding("Searching " + word + " not found! (Maybe it does not include in Dictionary API or time for clicking between words is too short)");
            };
        };
    }

    const PageOfButtonToChoose = () => {
        const elements = [];
        for (let i = 0; i < listOfWord.length; i++) {
            elements.push(
                <button
                    key={i}
                    className={` text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
            ${!listOfIndexButton.includes(i) ? 'bg-blue-700 hover:bg-blue-800' : 'bg-gray-500 hover:bg-gray-600'
                        }
            `}
                    onClick={(e) => {
                        e.preventDefault();
                        implementMeaning(i, listOfIndexButton.includes(i));
                        HandleButtonToChoose(i);
                        console.log(wordAndMeaning);
                    }
                    }
                >
                    {listOfWord[i]}
                </button>
            );
            if (listOfWord[i].endsWith('\n')) {
                elements.push(<br />);
            }

        };
        return <div>{elements}</div>;
    };

    const PageOfButtonInChoosing = () => {
        const elements = [];
        for (let i = 0; i < listOfIndexButton.length; i++) {
            elements.push(
                <button
                    key={i}
                    className={` focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900
                `}
                >
                    {listOfWord[listOfIndexButton[i]]}
                </button>
            );

        };
        return <div>{elements}</div>;
    };

    const onFinalSending = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('api/CombineWord', { list: wordAndMeaning, email: router.query.Email });
            console.log(res.data.uniqueWords);
            router.push({
                pathname: '/YourVocabularies',
                query: { Email: router.query.Email },
            });
        } catch (error) {
            console.log("Redirecting to My Vocabularies unsuccessfully!");
        };
    };

    return (
        <>
            <Head>
                <title>VocabHunter</title>
                <meta name="description" content="Main Page" />
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
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <form onSubmit={handleSubmitText}>
                            <label for="message" className="mb-1 text-sm font-medium text-cyan">Write your text (we will transfer your text into words for learning). Consequently, you will see the list of words to choose. </label>
                            <textarea
                                id="message"
                                rows="4"
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your text here..."
                                onChange={(e) => { e.preventDefault(); setText(e.target.value); console.log(text); }}
                            >
                                {text}
                            </textarea>
                            <button type="submit" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"

                            >
                                {handleSubmitAndReload === 0 ? 'Submit' : 'Reload Page'}
                            </button>
                        </form>
                        <PageOfButtonToChoose />
                        <PageOfButtonInChoosing />
                        {handleSubmitAndReload === 1 &&
                            <button
                                type="submit"
                                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                                onClick={onFinalSending}
                            >
                                Sending
                            </button>
                        }
                        {errorFinding !== "" &&
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error! </strong>
                                <span className="block sm:inline">{errorFinding}</span>
                                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" onClick={(e) => { e.preventDefault(); setErrorFinding(""); }}><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                                </span>
                            </div>
                        }
                    </div>
                </main>
            </div>
        </>
    )
}



// try {
// setListOfWord(() => {
//     listForLine = text.split('\n');
//     for (let i = 0; i < listForLine.length; i++) {
//         let a = listForLine[i].split(/\s+/);
//         for (let j = 0; j < a.length; j++) {
//             if (a[j].length === 0) {
//                 a.splice(j, 1);
//             }
//         }
//         if (a.length > 0) {
//             a[a.length - 1] += '\n'
//             for (let j = 0; j < a.length; j++) {
//                 listForChoice.push(a[j]);
//             }
//         }

//     }
//     return listForChoice;

// });
// console.log(listOfWord);


//     setListOfWord(async () => {
//         console.log(text);
//         let initialList1 = text.split('\n');
//         let initialList = text.split(/\s+/);
//         console.log(initialList1);
//         const checkCharacterValidOne = (word) => {
//             return (word[0]>='0'&&word[0]<='9') || (word[0]>='a'&&word[0]<='z') || (word[0]>='A'&&word[0]<='Z');
//         }
//         const checkCharacterValidLast = (word) => {
//             return (word[word.length-1]>='0'&&word[word.length-1]<='9') || (word[word.length-1]>='a'&&word[word.length-1]<='z') || (word[word.length-1]>='A'&&word[word.length-1]<='Z');
//         }
//         for (let i = 0; i < initialList.length; i++) {
//             if (!checkCharacterValidOne(initialList[i])) {
//                 initialList[i] = initialList[i].slice(1);
//             }
//             if (!checkCharacterValidLast(initialList[i])) {
//                 initialList[i] = initialList[i].slice(0,initialList[i].length-1);
//             }
//             initialList[i] = initialList[i].replace(/^[^\w-]+|[^\w-]+$/g, '');
//             console.log(initialList[i]);
//             try {
//                 const res = await axios.post('api/GenerateWord', { word: initialList[i] });
//             }
//             catch (error) {
//                 initialList.splice(i, 1);
//                 i--;
//             }


//         }
//         console.log(initialList);
//         return initialList;
//     });
//     processListOfWord = listOfWord;

//const res = await axios.post('api/GenerateWord', { text });

// console.log('Directing into main page with Email:' + formData.email);
// router.push({
//     pathname: '/MainPage',
//     query: {Email: formData.email},
// });

// } catch (error) {
// if (error.response && error.response.status === 401) {
//     toast.error("Invalid Email or Password!");
// } else {
//     console.error("An error occurred:", error);
// }
// };

//}