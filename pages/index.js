import App from "next/app"
import Head from "next/head"
import Link from "next/link"
import Scene1 from "../components/Scene1"
export default function HomePage() {
    return (
        <>
            <Head>
                <title>Home - HomePage</title>
            </Head>
            {/* <Link href="/App"></Link>
            <div>
                Hello, this is HomePage!
            </div> */}
            <Scene1 />
        </>
    )
}