import React from 'react'
import styled from "styled-components";

const CarWrapper = styled.div`
    position: absolute;
    right: ${(props) => props.x}px;
    background-color: ${(props) => props.color};
    width: 30px;
    height: 20px;
    text-align: center;
    transition-duration: 1s;
    z-index: 1;
`;

const MaterialIcon = () => (
    <span className="material-symbols-outlined">
        airport_shuttle
    </span >
);
const Link = styled(MaterialIcon)`
`

export default function Car({ x = 0, id, color }) {
    console.log(`car #${id} is at (${x})`)
    return (
        <CarWrapper x={x} color={color}>
            <Link />
        </CarWrapper>
    )
}
