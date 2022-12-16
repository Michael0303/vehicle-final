import Head from "next/head";
import Link from "next/link";
import "../styles/styles.css"

export default function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Component {...pageProps} />
            <footer style={{ textAlign: "center" }} >
                <Link href="/">To Home</Link>
            </footer>
        </div>
    )
}