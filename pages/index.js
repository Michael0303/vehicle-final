import Head from "next/head"
import Link from "next/link"
import styled from "styled-components"

const HomeWrapper = styled.div`
    text-align: center;
`

export default function HomePage() {
    return (
        <HomeWrapper>
            <Head>
                <title>Final Project</title>
            </Head>
            <h1>Welcome to our final project!</h1>
            <h3>Click below button to go to each scenario</h3>
            <Link href="/Scene1">Scene1</Link>
        </HomeWrapper>
    )
}